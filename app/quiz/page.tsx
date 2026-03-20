"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { questions, directorQuestions } from "../data/questions";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Users, Briefcase, ChevronRight } from "lucide-react";

// ─────────────────────────────────────────
// Progress Bar
// ─────────────────────────────────────────
function ProgressBar({ current, total }: { current: number; total: number }) {
    return (
        <div className="w-full h-1 bg-gray-100 rounded-full mb-6">
            <motion.div
                className="h-full bg-gray-800 rounded-full"
                animate={{ width: `${((current + 1) / total) * 100}%` }}
                transition={{ duration: 0.35, ease: "easeOut" }}
            />
        </div>
    );
}

// ─────────────────────────────────────────
// หน้าเลือก Role (ผู้ถือหุ้น / กรรมการ)
// ─────────────────────────────────────────
function RoleSelection({ onSelect }: { onSelect: (role: "shareholder" | "director") => void }) {
    return (
        <motion.div
            className="max-w-xl mx-auto mt-20 px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <div className="text-center mb-10">
                <h1 className="text-2xl font-bold text-gray-800">สร้างการประชุมใหม่</h1>
                <p className="text-gray-400 mt-2 text-sm">กรุณาเลือกประเภทผู้เข้าร่วม</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {[
                    {
                        role: "shareholder" as const,
                        label: "ผู้ถือหุ้น",
                        sub: "ประชุมสามัญ / วิสามัญ",
                        Icon: Users,
                    },
                    {
                        role: "director" as const,
                        label: "กรรมการ",
                        sub: "ประชุมคณะกรรมการ",
                        Icon: Briefcase,
                    },
                ].map(({ role, label, sub, Icon }) => (
                    <motion.button
                        key={role}
                        onClick={() => onSelect(role)}
                        className="group relative flex flex-col items-center gap-4 p-8 bg-white border border-gray-200 rounded-2xl shadow-sm hover:border-gray-800 hover:shadow-md transition-all"
                        whileHover={{ y: -3 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        <div className="w-14 h-14 rounded-2xl bg-gray-100 group-hover:bg-gray-800 flex items-center justify-center transition-all duration-200">
                            <Icon
                                size={26}
                                className="text-gray-500 group-hover:text-white transition-colors duration-200"
                            />
                        </div>
                        <div className="text-center">
                            <p className="font-semibold text-gray-800">{label}</p>
                            <p className="text-xs text-gray-400 mt-1">{sub}</p>
                        </div>
                        <ChevronRight
                            size={15}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 group-hover:text-gray-600 transition-colors"
                        />
                    </motion.button>
                ))}
            </div>
        </motion.div>
    );
}

// ─────────────────────────────────────────
// Flow: ผู้ถือหุ้น (เดิม ไม่เปลี่ยน)
// ─────────────────────────────────────────
function ShareholderQuiz({ onDone }: { onDone: (answers: any) => void }) {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<any>({});
    const [inputValue, setInputValue] = useState("");
    const [selectedAgendas, setSelectedAgendas] = useState<string[]>([]);
    const [otherText, setOtherText] = useState("");       // ค่า input "อื่นๆ"
    const [otherChecked, setOtherChecked] = useState(false); // toggle checkbox อื่นๆ
    const [errorMsg, setErrorMsg] = useState("");

    const authorizedNames = ["สมชาย ใจดี", "วิภา เรียนรู้", "จีน"];
    const currentQuestion = questions[step];

    const handleNext = (value: any) => {
        // ถ้าเป็น step วาระ ให้รวม otherText เข้าด้วย
        let finalValue = value;
        if (currentQuestion.type === "agenda") {
            const extras = otherChecked && otherText.trim() ? [otherText.trim()] : [];
            finalValue = [...(value as string[]), ...extras];
        }

        const newAnswers = { ...answers, [currentQuestion.id]: finalValue };
        setAnswers(newAnswers);

        if (currentQuestion.type === "input") {
            const trimmed = value.trim();
            if (!trimmed) { setErrorMsg("กรุณากรอกชื่อ"); return; }
            if (!authorizedNames.includes(trimmed)) { setErrorMsg("ไม่มีอำนาจในการสร้างประชุม"); return; }
        }

        if (step < questions.length - 1) {
            setStep((p) => p + 1);
            setInputValue("");
            setSelectedAgendas([]);
            setOtherText("");
            setOtherChecked(false);
            setErrorMsg("");
        } else {
            onDone(newAnswers);
        }
    };

    const toggleAgenda = (item: string) =>
        setSelectedAgendas((p) =>
            p.includes(item) ? p.filter((i) => i !== item) : [...p, item]
        );

    if (!currentQuestion) return null;

    return (
        <motion.div
            className="max-w-2xl mx-auto mt-10 px-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <div className="create-form-card">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="create-form-field"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-gray-700 font-medium">
                                {currentQuestion.title}
                            </label>
                            <span className="text-sm text-gray-400">
                                ({step + 1}/{questions.length})
                            </span>
                        </div>

                        <ProgressBar current={step} total={questions.length} />

                        {/* Options */}
                        {currentQuestion.type === "options" && (
                            <div className="flex flex-col gap-2">
                                {currentQuestion.options?.map((opt: string) => (
                                    <button
                                        key={opt}
                                        onClick={() => handleNext(opt)}
                                        className="create-form-select text-left hover:bg-gray-50"
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Input */}
                        {currentQuestion.type === "input" && (
                            <div className="flex flex-col gap-2">
                                <input
                                    autoFocus
                                    className={`create-form-input ${errorMsg ? "create-form-input-error" : ""}`}
                                    placeholder={currentQuestion.placeholder}
                                    value={inputValue}
                                    onChange={(e) => { setInputValue(e.target.value); setErrorMsg(""); }}
                                    onKeyDown={(e) => e.key === "Enter" && handleNext(inputValue)}
                                />
                                {errorMsg && (
                                    <span className="create-form-error flex items-center gap-1">
                                        <AlertCircle size={12} /> {errorMsg}
                                    </span>
                                )}
                                <button
                                    onClick={() => handleNext(inputValue)}
                                    className="create-form-submit mt-2"
                                >
                                    ถัดไป
                                </button>
                            </div>
                        )}

                        {/* Agenda */}
                        {currentQuestion.type === "agenda" && (
                            <div className="space-y-4">
                                <div className="create-form-agendas">
                                    {["regularAgendas", "specialAgendas"].map((type) => (
                                        <div key={type} className="mb-4">
                                            <h3 className="font-bold text-sm mb-2 uppercase text-gray-500">
                                                {type === "regularAgendas" ? "มติธรรมดา" : "มติพิเศษ"}
                                            </h3>

                                            {(currentQuestion as any)[type]?.map((item: string) => (
                                                <label
                                                    key={item}
                                                    className="flex items-center gap-3 py-2 cursor-pointer border-b border-gray-50 last:border-0"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        onChange={() => toggleAgenda(item)}
                                                        checked={selectedAgendas.includes(item)}
                                                    />
                                                    <span className="text-gray-700">{item}</span>
                                                </label>
                                            ))}

                                            {/* อื่นๆ — เฉพาะ regularAgendas */}
                                            {type === "regularAgendas" && (
                                                <div className=" pt-2 mt-1">
                                                    <label className="flex items-start gap-3 py-2 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            className="mt-0.5"
                                                            checked={otherChecked}
                                                            onChange={(e) => {
                                                                setOtherChecked(e.target.checked);
                                                                if (!e.target.checked) setOtherText("");
                                                            }}
                                                        />
                                                        <div className="flex-1">
                                                            <span className="text-gray-700">อื่นๆ</span>
                                                            <AnimatePresence>
                                                                {otherChecked && (
                                                                    <motion.div
                                                                        initial={{ opacity: 0, height: 0 }}
                                                                        animate={{ opacity: 1, height: "auto" }}
                                                                        exit={{ opacity: 0, height: 0 }}
                                                                        transition={{ duration: 0.2 }}
                                                                        className="overflow-hidden"
                                                                    >
                                                                        <input
                                                                            autoFocus
                                                                            type="text"
                                                                            className="create-form-input mt-2 text-sm"
                                                                            placeholder="ระบุวาระอื่นๆ..."
                                                                            value={otherText}
                                                                            onChange={(e) => setOtherText(e.target.value)}
                                                                            onClick={(e) => e.stopPropagation()}
                                                                        />
                                                                    </motion.div>
                                                                )}
                                                            </AnimatePresence>
                                                        </div>
                                                    </label>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={() => handleNext(selectedAgendas)}
                                    className="create-form-submit"
                                >
                                    ยืนยันวาระ
                                </button>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

// ─────────────────────────────────────────
// Flow: กรรมการ (ใหม่ — 2 คำถาม)
// ─────────────────────────────────────────
function DirectorQuiz({ onDone }: { onDone: (answers: any) => void }) {
    const [step, setStep] = useState(0);
    const [callerName, setCallerName] = useState("");
    const [agendaText, setAgendaText] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const currentQuestion = directorQuestions[step];

    const handleNext = () => {
        if (step === 0) {
            if (!callerName.trim()) { setErrorMsg("กรุณากรอกชื่อ"); return; }
            setErrorMsg("");
            setStep(1);
        } else {
            if (!agendaText.trim()) { setErrorMsg("กรุณากรอกวาระการประชุม"); return; }
            setErrorMsg("");
            onDone({
                d1: callerName.trim(),
                d2: agendaText.trim(),
            });
        }
    };

    return (
        <motion.div
            className="max-w-2xl mx-auto mt-10 px-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <div className="create-form-card">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="create-form-field"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-gray-700 font-medium">
                                {currentQuestion.title}
                            </label>
                            <span className="text-sm text-gray-400">
                                ({step + 1}/{directorQuestions.length})
                            </span>
                        </div>

                        <ProgressBar current={step} total={directorQuestions.length} />

                        {/* Input: ชื่อผู้เรียกประชุม */}
                        {currentQuestion.type === "input" && (
                            <div className="flex flex-col gap-2">
                                <input
                                    autoFocus
                                    className={`create-form-input ${errorMsg ? "create-form-input-error" : ""}`}
                                    placeholder={currentQuestion.placeholder}
                                    value={callerName}
                                    onChange={(e) => { setCallerName(e.target.value); setErrorMsg(""); }}
                                    onKeyDown={(e) => e.key === "Enter" && handleNext()}
                                />
                                {errorMsg && (
                                    <span className="create-form-error flex items-center gap-1">
                                        <AlertCircle size={12} /> {errorMsg}
                                    </span>
                                )}
                                <button onClick={handleNext} className="create-form-submit mt-2">
                                    ถัดไป
                                </button>
                            </div>
                        )}

                        {/* Textarea: วาระการประชุม */}
                        {currentQuestion.type === "textarea" && (
                            <div className="flex flex-col gap-2">
                                <textarea
                                    autoFocus
                                    rows={6}
                                    className={`create-form-input resize-none leading-relaxed ${errorMsg ? "create-form-input-error" : ""}`}
                                    placeholder={currentQuestion.placeholder}
                                    value={agendaText}
                                    onChange={(e) => { setAgendaText(e.target.value); setErrorMsg(""); }}
                                />
                                {errorMsg && (
                                    <span className="create-form-error flex items-center gap-1">
                                        <AlertCircle size={12} /> {errorMsg}
                                    </span>
                                )}
                                <button onClick={handleNext} className="create-form-submit mt-2">
                                    สร้างการประชุม
                                </button>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

// ─────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────
export default function QuizPage() {
    const router = useRouter();
    const [role, setRole] = useState<"shareholder" | "director" | null>(null);

    const saveThenGo = (draft: object) => {
        localStorage.setItem("meeting_draft", JSON.stringify(draft));
        router.push("/create-meeting");
    };

    return (
        <AnimatePresence mode="wait">
            {/* Step 0: เลือก role */}
            {role === null && (
                <motion.div
                    key="role"
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    <RoleSelection onSelect={setRole} />
                </motion.div>
            )}

            {/* ผู้ถือหุ้น flow */}
            {role === "shareholder" && (
                <motion.div key="shareholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <ShareholderQuiz
                        onDone={(ans) =>
                            saveThenGo({ ...ans, role: "shareholder" })
                        }
                    />
                </motion.div>
            )}

            {/* กรรมการ flow */}
            {role === "director" && (
                <motion.div key="director" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <DirectorQuiz
                        onDone={(ans) =>
                            saveThenGo({ ...ans, role: "director" })
                        }
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}