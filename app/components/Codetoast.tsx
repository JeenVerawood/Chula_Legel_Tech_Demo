"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, X } from "lucide-react";

interface CodeToastProps {
    show: boolean;
    type: "success" | "error";
    code?: string;
    onClose: () => void;
}

export default function CodeToast({ show, type, code, onClose }: CodeToastProps) {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className="fixed bottom-6 right-6 z-50"
                    initial={{ opacity: 0, y: 24, scale: 0.92 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 16, scale: 0.94 }}
                    transition={{ type: "spring", stiffness: 400, damping: 28 }}
                >
                    <div
                        className={`
                            relative flex items-start gap-3 px-4 py-3.5 rounded-2xl shadow-2xl
                            border backdrop-blur-md min-w-[280px] max-w-[340px]
                            ${type === "success"
                                ? "bg-white border-green-100 shadow-green-100/40"
                                : "bg-white border-red-100 shadow-red-100/40"
                            }
                        `}
                    >
                        {/* Icon */}
                        <motion.div
                            className={`shrink-0 mt-0.5 ${type === "success" ? "text-green-500" : "text-red-400"}`}
                            initial={{ scale: 0, rotate: -20 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 22, delay: 0.08 }}
                        >
                            {type === "success"
                                ? <CheckCircle2 size={20} />
                                : <XCircle size={20} />
                            }
                        </motion.div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                            <motion.p
                                className="text-sm font-semibold text-gray-800"
                                initial={{ opacity: 0, x: -6 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                {type === "success" ? "ใช้โค้ดสำเร็จ!" : "โค้ดไม่ถูกต้อง"}
                            </motion.p>
                            <motion.p
                                className="text-xs text-gray-400 mt-0.5 truncate"
                                initial={{ opacity: 0, x: -6 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.15 }}
                            >
                                {type === "success"
                                    ? `โค้ด "${code}" ถูกนำไปใช้งานแล้ว`
                                    : `ไม่พบโค้ด "${code}" ในระบบ กรุณาลองใหม่`
                                }
                            </motion.p>

                            {/* Progress bar */}
                            <motion.div
                                className={`mt-2.5 h-0.5 rounded-full ${type === "success" ? "bg-green-100" : "bg-red-50"}`}
                            >
                                <motion.div
                                    className={`h-full rounded-full ${type === "success" ? "bg-green-400" : "bg-red-300"}`}
                                    initial={{ width: "100%" }}
                                    animate={{ width: "0%" }}
                                    transition={{ duration: 3.5, ease: "linear" }}
                                />
                            </motion.div>
                        </div>

                        {/* Close */}
                        <button
                            onClick={onClose}
                            className="shrink-0 mt-0.5 text-gray-300 hover:text-gray-500 transition-colors"
                        >
                            <X size={14} />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}