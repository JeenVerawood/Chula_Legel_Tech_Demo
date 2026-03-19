"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FolderUp, FileText, Upload, Trash2, CheckCircle2 } from "lucide-react";

interface UploadAOACardProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: (file: File) => void;
}

export default function UploadAOACard({ isOpen, onClose, onSubmit }: UploadAOACardProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) setSelectedFile(file);
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setSelectedFile(file);
    };

    const handleSubmit = async () => {
        if (!selectedFile) return;
        setIsSubmitting(true);
        await new Promise((r) => setTimeout(r, 1200));
        setIsSubmitting(false);
        setSubmitted(true);
        onSubmit?.(selectedFile);
        setTimeout(() => {
            setSubmitted(false);
            setSelectedFile(null);
            onClose();
        }, 1000);
    };

    const handleClose = () => {
        setSelectedFile(null);
        setIsDragging(false);
        onClose();
    };

    const formatSize = (bytes: number) => {
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                    />

                    {/* Card */}
                    <motion.div
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
                        initial={{ opacity: 0, scale: 0.95, y: 12 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 12 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                        <div className="bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">

                            {/* Header */}
                            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-500">
                                        <FolderUp size={17} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">Upload AOA</p>
                                        <p className="text-xs text-gray-400 mt-0.5">อัปโหลดไฟล์วาระการประชุม</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleClose}
                                    className="flex items-center justify-center w-7 h-7 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
                                >
                                    <X size={15} />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-5">
                                <div
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={() => !selectedFile && fileInputRef.current?.click()}
                                    className={`
                                        relative flex items-center justify-center rounded-xl border-[1.5px] border-dashed
                                        min-h-[150px] transition-all duration-200
                                        ${selectedFile
                                            ? "border-indigo-300 bg-indigo-50/50 cursor-default"
                                            : isDragging
                                                ? "border-indigo-400 bg-indigo-50 cursor-copy"
                                                : "border-gray-200 bg-gray-50 hover:border-indigo-300 hover:bg-indigo-50/40 cursor-pointer"
                                        }
                                    `}
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".pdf,.doc,.docx,.txt"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />

                                    <AnimatePresence mode="wait">
                                        {selectedFile ? (
                                            <motion.div
                                                key="file"
                                                className="flex items-center gap-3 w-full px-5"
                                                initial={{ opacity: 0, y: 6 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -6 }}
                                            >
                                                <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-indigo-100 text-indigo-500 shrink-0">
                                                    <FileText size={22} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-700 truncate">{selectedFile.name}</p>
                                                    <p className="text-xs text-gray-400 mt-0.5">{formatSize(selectedFile.size)}</p>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedFile(null);
                                                        if (fileInputRef.current) fileInputRef.current.value = "";
                                                    }}
                                                    className="flex items-center justify-center w-7 h-7 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition-all shrink-0"
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="empty"
                                                className="flex flex-col items-center gap-2 text-center px-6"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                            >
                                                <div className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 ${isDragging ? "bg-indigo-100 text-indigo-500" : "bg-gray-100 text-gray-400"}`}>
                                                    <Upload size={22} />
                                                </div>
                                                <p className="text-sm font-medium text-gray-600">
                                                    {isDragging ? "วางไฟล์ที่นี่..." : "ลากไฟล์มาวางที่นี่"}
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    หรือ <span className="text-indigo-500 font-medium">คลิกเพื่อเลือกไฟล์</span>
                                                </p>
                                                <p className="text-[11px] text-gray-300 mt-0.5">รองรับ PDF, DOC, DOCX, TXT</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-end gap-2 px-5 pb-5">
                                <button
                                    onClick={handleClose}
                                    className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-gray-600 hover:bg-gray-100 border border-gray-200 transition-all"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={!selectedFile || isSubmitting}
                                    className={`
                                        flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all min-w-[110px] justify-center
                                        ${submitted
                                            ? "bg-green-500 text-white"
                                            : !selectedFile
                                                ? "bg-indigo-100 text-indigo-300 cursor-not-allowed"
                                                : "bg-indigo-500 hover:bg-indigo-600 text-white cursor-pointer"
                                        }
                                    `}
                                >
                                    <AnimatePresence mode="wait">
                                        {submitted ? (
                                            <motion.span key="done" className="flex items-center gap-2"
                                                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
                                                <CheckCircle2 size={14} /> สำเร็จ
                                            </motion.span>
                                        ) : isSubmitting ? (
                                            <motion.span key="loading" className="flex items-center gap-2"
                                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                                <span className="w-3.5 h-3.5 border-2 border-indigo-200 border-t-indigo-500 rounded-full animate-spin" />
                                                กำลังอัปโหลด...
                                            </motion.span>
                                        ) : (
                                            <motion.span key="idle" className="flex items-center gap-2"
                                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                                <FolderUp size={14} /> Submit
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}