"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Plus, Radio, FolderUp, LayoutDashboard, ClipboardList, ArrowRight, Loader2, BookOpen } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import UploadAOACard from "./UploadAOACard";
import CodeToast from "../components/Codetoast";
import { VALID_CODES } from "../data/inviteCodes";

export default function Navbar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [codeValue, setCodeValue] = useState("");
    const [isSubmittingCode, setIsSubmittingCode] = useState(false);
    const [toast, setToast] = useState<{ show: boolean; type: "success" | "error"; code: string }>({
        show: false,
        type: "success",
        code: "",
    });
    const dropdownRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    const navItems = [
        { label: "ถ่ายทอดสดการประชุม", href: "/", icon: Radio },
        { label: "สรุปการประชุม", href: "/summary", icon: ClipboardList },
        { label: "ภาพรวมข้อมูล", href: "/dashboard", icon: LayoutDashboard },
    ];

    const currentItem = navItems.find((item) => item.href === pathname) || navItems[0];

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleUploadSubmit = (file: File) => {
        console.log("Uploaded file:", file.name);
    };

    const showToast = (type: "success" | "error", code: string) => {
        // ปิด toast เก่าก่อนแล้วค่อยเปิดใหม่ (reset animation)
        setToast({ show: false, type, code });
        setTimeout(() => {
            setToast({ show: true, type, code });
            setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3800);
        }, 80);
    };

    const handleCodeSubmit = async () => {
        if (!codeValue.trim() || isSubmittingCode) return;
        setIsSubmittingCode(true);

        // Simulate network delay
        await new Promise((r) => setTimeout(r, 900));

        const trimmed = codeValue.trim();
        const isValid = VALID_CODES.includes(trimmed);

        showToast(isValid ? "success" : "error", trimmed);
        setIsSubmittingCode(false);
        if (isValid) setCodeValue("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleCodeSubmit();
    };

    return (
        <>
            <nav className="navbar">
                <div className="navbar-inner">
                    <div className="navbar-left">
                        {/* Page Dropdown */}
                        <div className="navbar-dropdown-wrapper" ref={dropdownRef}>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="navbar-dropdown-trigger"
                                aria-expanded={isDropdownOpen}
                                aria-haspopup="listbox"
                            >
                                <currentItem.icon size={16} className="navbar-dropdown-icon" />
                                <span>{currentItem.label}</span>
                                <ChevronDown
                                    size={14}
                                    className={`navbar-chevron ${isDropdownOpen ? "navbar-chevron-open" : ""}`}
                                />
                            </button>

                            <AnimatePresence>
                                {isDropdownOpen && (
                                    <motion.div
                                        className="navbar-dropdown-menu"
                                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                                        transition={{ duration: 0.18, ease: "easeOut" }}
                                    >
                                        {navItems.map((item) => {
                                            const isActive = pathname === item.href;
                                            return (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    onClick={() => setIsDropdownOpen(false)}
                                                    className={`navbar-dropdown-item ${isActive ? "navbar-dropdown-item-active" : ""}`}
                                                >
                                                    <item.icon size={16} />
                                                    <span>{item.label}</span>
                                                </Link>
                                            );
                                        })}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Upload AOA */}
                        <button
                            className="navbar-new-meeting-btn"
                            onClick={() => setIsUploadOpen(true)}
                        >
                            <FolderUp size={16} />
                            Upload AOA
                        </button>

                        <Link href="/quiz" className="navbar-new-meeting-btn">
                            <Plus size={16} />
                            <span>New Meeting</span>
                        </Link>
                    </div>

                    {/* Code Input */}
                    <div className="flex gap-2">
                        <div className="flex items-center gap-2 bg-gray-100 border border-gray-200 rounded-lg px-3 py-1.5">
                        <span className="text-xs font-medium text-gray-400 uppercase tracking-widest select-none">
                            CODE
                        </span>
                        <div className="w-px h-3.5 bg-gray-200" />
                        <input
                            type="text"
                            value={codeValue}
                            onChange={(e) => setCodeValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="กรอกโค้ดคำชวน"
                            className="bg-transparent text-sm text-gray-700 placeholder:text-gray-300 outline-none w-36 caret-gray-500"
                        />

                        {/* Submit button — dark tone */}
                        <AnimatePresence>
                            {codeValue.length > 0 && (
                                <motion.button
                                    onClick={handleCodeSubmit}
                                    disabled={isSubmittingCode}
                                    className="flex items-center justify-center w-6 h-6 rounded-md bg-blue-600 border border-blue-200 text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                                    initial={{ opacity: 0, scale: 0.5, x: -8 }}
                                    animate={{ opacity: 1, scale: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.5, x: -8 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 50 }}
                                    whileHover={{ scale: 1.12 }}
                                    whileTap={{ scale: 0.88 }}
                                >
                                    <AnimatePresence mode="wait">
                                        {isSubmittingCode ? (
                                            <motion.span
                                                key="loading"
                                                initial={{ opacity: 0, scale: 0.6 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.6 }}
                                                transition={{ duration: 0.15 }}
                                            >
                                                <Loader2 size={11} className="animate-spin" />
                                            </motion.span>
                                        ) : (
                                            <motion.span
                                                key="arrow"
                                                initial={{ opacity: 0, x: -4 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 4 }}
                                                transition={{ duration: 0.12 }}
                                            >
                                                <ArrowRight size={11} />
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* คู่มือการใช้งาน */}
                    <a
                        href="pdf/test1.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <motion.button
                            className="flex items-center gap-1.5 p-3   rounded-lg bg-gray-100 border border-gray-200 font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-200 transition-all"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            <BookOpen size={16} />
                        </motion.button>
                    </a>
                    </div>
                </div>
            </nav>

            {/* Upload AOA Card Modal */}
            <UploadAOACard
                isOpen={isUploadOpen}
                onClose={() => setIsUploadOpen(false)}
                onSubmit={handleUploadSubmit}
            />

            {/* Code Result Toast */}
            <CodeToast
                show={toast.show}
                type={toast.type}
                code={toast.code}
                onClose={() => setToast((prev) => ({ ...prev, show: false }))}
            />
        </>
    );
}   