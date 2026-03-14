"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { questions } from "../data/questions";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function QuizPage() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<any>({});
    const [inputValue, setInputValue] = useState("");
    const [selectedAgendas, setSelectedAgendas] = useState<string[]>([]);
    const [errorMsg, setErrorMsg] = useState("");

    const currentQuestion = questions[step];
    const authorizedNames = ["สมชาย ใจดี", "วิภา เรียนรู้", "จีน"];

    const handleNext = (valueToSave: any) => {
        const finalValue = valueToSave || inputValue;
        if (currentQuestion?.type === "input" && !authorizedNames.includes(finalValue.trim())) {
            setErrorMsg("ไม่มีอำนาจในการสร้างประชุม");
            return;
        }

        const newAnswers = { ...answers, [currentQuestion.id]: finalValue };
        
        if (step < questions.length - 1) {
            setAnswers(newAnswers);
            setStep((prev) => prev + 1);
            setInputValue("");
            setSelectedAgendas([]);
            setErrorMsg("");
        } else {
            localStorage.setItem("meeting_draft", JSON.stringify(newAnswers));
            router.push("/create-meeting"); 
        }
    };

    const toggleAgenda = (item: string) => {
        setSelectedAgendas(prev => 
            prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
        );
    };

    return (
        <motion.div 
             className="max-w-2xl mx-auto mt-10 px-4"
            initial={{ opacity: 0, y: 16 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <header className="create-form-header">
                <Link href="/" className="create-form-back">
                    <ChevronLeft size={22} />
                    <h1>ตอบคำถามเพื่อเริ่มสร้างประชุม ({step + 1}/{questions.length})</h1>
                </Link>
            </header>

            <div className="create-form-card">
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={step} 
                        initial={{ opacity: 0, x: 10 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        exit={{ opacity: 0, x: -10 }}
                        className="create-form-field"
                    >
                        <label className="block mb-4 text-gray-700 font-medium">{currentQuestion.title}</label>
                        
                        {currentQuestion.type === "input" ? (
                            <div className="flex flex-col gap-2">
                                <input 
                                    className={`create-form-input ${errorMsg ? "create-form-input-error" : ""}`} 
                                    placeholder={currentQuestion.placeholder} 
                                    value={inputValue} 
                                    onChange={(e) => {
                                        setInputValue(e.target.value);
                                        setErrorMsg("");
                                    }} 
                                />
                                {errorMsg && (
                                    <span className="create-form-error flex items-center gap-1 mt-1">
                                        <AlertCircle size={12} /> {errorMsg}
                                    </span>
                                )}
                                <button onClick={() => handleNext(inputValue)} className="create-form-submit mt-2">ถัดไป</button>
                            </div>
                        ) : currentQuestion.type === "agenda" ? (
                            <div className="space-y-4">
                                <div className="create-form-agendas">
                                    {["regularAgendas", "specialAgendas"].map((type) => (
                                        <div key={type} className="mb-4">
                                            <h3 className="font-bold text-sm mb-2 uppercase text-gray-500">{type === "regularAgendas" ? "มติธรรมดา" : "มติพิเศษ"}</h3>
                                            {(currentQuestion as any)[type]?.map((item: string) => (
                                                <label key={item} className="flex items-center gap-3 py-2 cursor-pointer border-b border-gray-50 last:border-0">
                                                    <input type="checkbox" onChange={() => toggleAgenda(item)} checked={selectedAgendas.includes(item)} />
                                                    <span className="text-gray-700">{item}</span>
                                                </label>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                                <button onClick={() => handleNext(selectedAgendas)} className="create-form-submit">ยืนยันวาระ</button>
                            </div>
                        ) : (
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
                    </motion.div>
                </AnimatePresence>
            </div>
        </motion.div>
    );
}