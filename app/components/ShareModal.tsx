"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Share2, CheckCheck } from "lucide-react";

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    meetingTitle?: string;
    shareUrl?: string;
}

export default function ShareModal({
    isOpen,
    onClose,
    meetingTitle = "หนังสือเชิญประชุม",
    shareUrl = typeof window !== "undefined" ? window.location.href : "",
}: ShareModalProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareOptions = [
        {
            label: "ฝัง",
            icon: (
                <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none">
                    <circle cx="16" cy="16" r="16" fill="#E5E7EB"/>
                    <path d="M11 13l-4 3 4 3M21 13l4 3-4 3M18 11l-4 10" stroke="#374151" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            ),
            action: () => {
                const embedCode = `<iframe src="${shareUrl}" width="600" height="400"></iframe>`;
                navigator.clipboard.writeText(embedCode);
                alert("คัดลอก Embed Code แล้ว!");
            },
        },
        {
            label: "Facebook",
            icon: (
                <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none">
                    <circle cx="16" cy="16" r="16" fill="#1877F2"/>
                    <path d="M21 16h-3v9h-4v-9h-2v-3h2v-2c0-2.5 1-4 4-4h3v3h-2c-1 0-1 .4-1 1v2h3l-.5 3z" fill="#fff"/>
                </svg>
            ),
            action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`),
        },
        {
            label: "WhatsApp",
            icon: (
                <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none">
                    <circle cx="16" cy="16" r="16" fill="#25D366"/>
                    <path d="M23.5 8.5A10.4 10.4 0 0 0 7.1 22.4L6 26l3.7-1.1A10.4 10.4 0 1 0 23.5 8.5zm-7.5 16a8.6 8.6 0 0 1-4.4-1.2l-.3-.2-3.1.9.9-3-.2-.3A8.6 8.6 0 1 1 16 24.5zm4.7-6.4c-.3-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.1-.5 0a6.4 6.4 0 0 1-3.2-2.8c-.2-.4.2-.4.6-1.2.1-.2 0-.3 0-.4l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.5 4c1.7.7 2.3.8 3.1.7a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3z" fill="#fff"/>
                </svg>
            ),
            action: () => window.open(`https://wa.me/?text=${encodeURIComponent(`${meetingTitle}\n${shareUrl}`)}`),
        },
        {
            label: "X",
            icon: (
                <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none">
                    <circle cx="16" cy="16" r="16" fill="#000"/>
                    <path d="M18.2 14.8L23.5 9h-1.2l-4.5 5.1L14 9H9.5l5.6 7.9L9.5 23h1.2l4.9-5.5 3.9 5.5H24l-5.8-8.2zm-1.7 2l-.6-.8-4.6-6.4h2l3.7 5.2.6.8 4.8 6.7h-2l-3.9-5.5z" fill="#fff"/>
                </svg>
            ),
            action: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${meetingTitle} ${shareUrl}`)}`),
        },
        {
            label: "อีเมล",
            icon: (
                <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none">
                    <circle cx="16" cy="16" r="16" fill="#6B7280"/>
                    <rect x="8" y="10" width="16" height="12" rx="2" stroke="#fff" strokeWidth="1.5" fill="none"/>
                    <path d="M8 12l8 6 8-6" stroke="#fff" strokeWidth="1.5"/>
                </svg>
            ),
            action: () => window.open(`mailto:?subject=${encodeURIComponent(meetingTitle)}&body=${encodeURIComponent(`${meetingTitle}\n\n${shareUrl}`)}`),
        },
        {
            label: "Line",
            icon: (
                <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none">
                    <circle cx="16" cy="16" r="16" fill="#06C755"/>
                    <path d="M25 15.3C25 11.2 20.9 8 16 8S7 11.2 7 15.3c0 3.7 3.3 6.8 7.7 7.4.3.1.7.2.8.5.1.3 0 .6 0 .9l-.1.8c0 .2-.2 1 .9.5a34.3 34.3 0 0 0 8.3-6.1A6.4 6.4 0 0 0 25 15.3z" fill="#fff"/>
                    <path d="M13.4 17.3h-2.2a.4.4 0 0 1-.4-.4v-3.4a.4.4 0 0 1 .8 0v3h1.8a.4.4 0 0 1 0 .8zm1.4 0a.4.4 0 0 1-.4-.4v-3.4a.4.4 0 1 1 .8 0v3.4a.4.4 0 0 1-.4.4zm4.3 0a.4.4 0 0 1-.3-.2l-1.8-2.5v2.3a.4.4 0 1 1-.8 0v-3.4a.4.4 0 0 1 .7-.3l1.8 2.5v-2.2a.4.4 0 1 1 .8 0v3.4a.4.4 0 0 1-.4.4zm2.7-2.4a.4.4 0 0 1 0 .8h-1v.8h1a.4.4 0 0 1 0 .8h-1.4a.4.4 0 0 1-.4-.4v-3.4a.4.4 0 0 1 .4-.4h1.4a.4.4 0 0 1 0 .8h-1v.8h1z" fill="#06C755"/>
                </svg>
            ),
            action: () => window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}`),
        },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={onClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    />

                    {/* Modal Card */}
                    <motion.div
                        className="relative w-full max-w-sm mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden"
                        initial={{ opacity: 0, y: 60, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 60, scale: 0.95 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 pt-5 pb-4">
                            <h2 className="text-base font-semibold text-gray-800">แชร์ในโพสต์</h2>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition text-gray-500"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Success badge */}
                        <div className="px-5 pb-4">
                            <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-xl p-3">
                                <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                    <Share2 size={16} className="text-blue-600" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs text-blue-500 font-medium">สร้างสำเร็จแล้ว ✓</p>
                                    <p className="text-sm font-semibold text-blue-800 truncate">{meetingTitle}</p>
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-gray-100 mx-5" />

                        {/* Share options */}
                        <div className="px-5 py-4">
                            <p className="text-sm font-semibold text-gray-700 mb-3">แชร์</p>
                            <div className="flex justify-between gap-1">
                                {shareOptions.map((opt) => (
                                    <button
                                        key={opt.label}
                                        onClick={opt.action}
                                        className="flex flex-col items-center gap-1.5 flex-1 group"
                                    >
                                        <div className="w-11 h-11 rounded-full flex items-center justify-center shadow-sm transition-transform group-hover:scale-110">
                                            {opt.icon}
                                        </div>
                                        <span className="text-[10px] text-gray-500">{opt.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="h-px bg-gray-100 mx-5" />

                        {/* Copy link */}
                        <div className="px-5 py-4">
                            <div className="flex gap-2">
                                <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-500 truncate">
                                    {shareUrl}
                                </div>
                                <motion.button
                                    onClick={handleCopy}
                                    whileTap={{ scale: 0.95 }}
                                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                        copied
                                            ? "bg-green-500 text-white"
                                            : "bg-blue-600 hover:bg-blue-700 text-white"
                                    }`}
                                >
                                    {copied ? <CheckCheck size={14} /> : <Copy size={14} />}
                                    {copied ? "คัดลอกแล้ว" : "คัดลอก"}
                                </motion.button>
                            </div>
                        </div>

                        <div className="pb-2" />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}