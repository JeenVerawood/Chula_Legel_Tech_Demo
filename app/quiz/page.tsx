"use client";
import { useState } from "react";
import { questions } from "../data/questions";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, FileText } from "lucide-react";

export default function QuizPage() {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<any>({});
    const [inputValue, setInputValue] = useState("");
    const [selectedAgendas, setSelectedAgendas] = useState<string[]>([]);
    const [errorMsg, setErrorMsg] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [additionalNotes, setAdditionalNotes] = useState("");

    const currentQuestion = questions[step];
    const isFinished = step >= questions.length;
    const authorizedNames = ["สมชาย ใจดี", "วิภา เรียนรู้", "จีน"];

    const handleNext = (valueToSave: any) => {
        const finalValue = valueToSave || inputValue;

        if (currentQuestion?.type === "input" && !authorizedNames.includes(finalValue.trim())) {
            setErrorMsg("ไม่มีอำนาจในการสร้างประชุม");
            return;
        }

        const newAnswers = { ...answers, [currentQuestion.id]: finalValue };
        setAnswers(newAnswers);
        
        if (step < questions.length - 1) {
            setStep((prev) => prev + 1);
            setInputValue("");
            setSelectedAgendas([]);
        } else {
            setStep(questions.length);
        }
    };

    const toggleAgenda = (item: string) => {
        setSelectedAgendas(prev => 
            prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
        );
    };

    // --- หน้าสรุปข้อมูล ---
    if (isFinished && !isSubmitted) {
        return (
            <motion.div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-2xl border border-gray-200 shadow-sm" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2"><FileText /> สรุปข้อมูลการประชุม</h1>
                <div className="space-y-6 mb-8">
                    {questions.map((q) => (
                        <div key={q.id} className="border-b pb-4">
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">{q.title}</p>
                            <p className="text-gray-900 font-semibold mt-1 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                {Array.isArray(answers[q.id]) ? answers[q.id].join(", ") : answers[q.id] || "ไม่ได้ระบุ"}
                            </p>
                        </div>
                    ))}
                </div>
                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                    <label className="block font-bold text-blue-900 mb-2">ระบุหมายเหตุเพิ่มเติม (ถ้ามี):</label>
                    <textarea className="w-full p-4 rounded-xl border border-blue-200" rows={3} value={additionalNotes} onChange={(e) => setAdditionalNotes(e.target.value)} />
                </div>
                <button onClick={() => setIsSubmitted(true)} className="mt-8 w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700">ยืนยันข้อมูลและสร้างประชุม</button>
            </motion.div>
        );
    }

    // --- ส่วนเรนเดอร์คำถาม ---
    return (
        <div className="max-w-2xl mx-auto mt-10 px-4">
            <AnimatePresence mode="wait">
                {currentQuestion && (
                    <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                        <h2 className="text-xl font-bold mb-6 text-gray-800">{currentQuestion.title}</h2>
                        
                        {currentQuestion.type === "input" ? (
                            <div className="flex flex-col gap-4">
                                <input className={`w-full p-3 border rounded-xl ${errorMsg ? "border-red-500" : ""}`} placeholder={currentQuestion.placeholder} value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
                                {errorMsg && <div className="text-red-500 text-sm flex items-center gap-2"><AlertCircle size={16}/> {errorMsg}</div>}
                                <button onClick={() => handleNext(inputValue)} className="w-full bg-gray-800 text-white py-3 rounded-xl font-medium">ตกลง</button>
                            </div>
                        ) : currentQuestion.type === "agenda" ? (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {["regularAgendas", "specialAgendas"].map((type) => (
                                        <div key={type}>
                                            <h3 className="font-bold mb-3">{type === "regularAgendas" ? "มติธรรมดา" : "มติพิเศษ"}</h3>
                                                {(currentQuestion as any)[type]?.map((item: string) => (
                                                <label key={item} className="flex items-center gap-3 py-2 cursor-pointer">
                                                    <input type="checkbox" onChange={() => toggleAgenda(item)} checked={selectedAgendas.includes(item)} />
                                                    {item}
                                                </label>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                                <button onClick={() => handleNext(selectedAgendas)} className="w-full bg-gray-800 text-white py-3 rounded-xl font-medium">ยืนยันวาระ</button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-3">
                                {currentQuestion.options?.map((opt: string) => (
                                    <button key={opt} onClick={() => handleNext(opt)} className="w-full border p-4 bg-gray-100 rounded-xl text-left hover:bg-gray-200">{opt}</button>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}