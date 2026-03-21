"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function WelcomeCard() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setShow(true), 500);
        return () => clearTimeout(t);
    }, []);

    return (
        <AnimatePresence>
            {show && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShow(false)}
                    />

                    {/* Card */}
                    <motion.div
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-full max-w-3xl"
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", stiffness: 320, damping: 28 }}
                    >
                        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">

                            {/* Video */}
                            <div className="relative w-full aspect-video bg-black">
                                <video
                                    className="h-full object-cover"
                                    src="/mp4/final2.mov"
                                    autoPlay
                                    loop
                                    muted 
                                    playsInline
                                    controls

                                />

                                {/* ปุ่ม X */}
                                    {/* <motion.button
                                        onClick={() => setShow(false)}
                                        className="absolute top-3 right-3 flex items-center justify-center w-8 h-8 rounded-full bg-black/50 hover:bg-black/75 text-white backdrop-blur-sm transition-all"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <X size={15} />
                                    </motion.button> */}
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 bg-gray-50">
                                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">
                                    โฆษณา
                                </p>
                                <button
                                    onClick={() => setShow(false)}
                                    className="text-xs font-medium text-gray-500 hover:text-gray-800 transition-colors"
                                >
                                    ปิดและดำเนินการต่อ →
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}