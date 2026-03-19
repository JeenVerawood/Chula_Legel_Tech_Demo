"use client";

import { ChevronLeft, Share2, ChevronDown, Check, Download, Play, Pause, Volume2 } from "lucide-react";
import Link from "next/link";
import MeetingSummaryCard from "../components/MeetingSummaryCard";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import MeetingDetailView from "../components/MeetingDetailView";
import { meetingItems, type MeetingItem } from "../data/meetingData";
import {
    meetingTranslations,
    languageOptions,
    type LanguageKey,
    type AgendaTranslation,
} from "../data/meetingTranslations";

// ── Language Dropdown Component ───────────────────────────────
function LanguageDropdown({
    selected,
    onChange,
}: {
    selected: LanguageKey;
    onChange: (key: LanguageKey) => void;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const current = languageOptions.find((l) => l.key === selected)!;

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen((p) => !p)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-all text-sm font-medium text-gray-700 shadow-sm"
            >
                <span>{current.label}</span>
                <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={14} className="text-gray-400" />
                </motion.div>
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        className="absolute right-0 top-full mt-1.5 w-44 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-20"
                        initial={{ opacity: 0, y: -6, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                    >
                        {languageOptions.map((lang) => (
                            <button
                                key={lang.key}
                                onClick={() => { onChange(lang.key); setOpen(false); }}
                                className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 text-sm transition-colors
                                    ${selected === lang.key
                                        ? "bg-gray-50 text-gray-900 font-medium"
                                        : "text-gray-600 hover:bg-gray-50"
                                    }`}
                            >
                                <span className="flex items-center gap-2">
                                    <span>{lang.label}</span>
                                </span>
                                {selected === lang.key && (
                                    <Check size={13} className="text-gray-500 shrink-0" />
                                )}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ── Audio Play Button Component ───────────────────────────────
function AudioPlayButton({ audioUrl }: { audioUrl?: string }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // หยุดเสียงเมื่อ audioUrl เปลี่ยน (เปลี่ยน card)
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        setIsPlaying(false);

        if (audioUrl) {
            audioRef.current = new Audio(audioUrl);
            // เมื่อเล่นจบให้ reset
            audioRef.current.addEventListener("ended", () => setIsPlaying(false));
        } else {
            audioRef.current = null;
        }

        return () => {
            audioRef.current?.pause();
        };
    }, [audioUrl]);

    const handleToggle = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play();
            setIsPlaying(true);
        }
    };

    const hasAudio = !!audioUrl;

    return (
        <motion.button
            whileHover={{ scale: hasAudio ? 1.05 : 1 }}
            whileTap={{ scale: hasAudio ? 0.95 : 1 }}
            onClick={handleToggle}
            disabled={!hasAudio}
            title={
                !hasAudio
                    ? "ไม่มีไฟล์เสียง"
                    : isPlaying
                        ? "หยุดเสียง"
                        : "เล่นเสียง"
            }
            className={`
                flex items-center justify-center w-8 h-8 rounded-lg border transition-all shadow-sm
                ${!hasAudio
                    ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed"
                    : isPlaying
                        ? "border-blue-300 bg-blue-50 text-blue-600 hover:bg-blue-100"
                        : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                }
            `}
        >
            <AnimatePresence mode="wait">
                {isPlaying ? (
                    <motion.div
                        key="pause"
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.7, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                    >
                        <Pause size={14} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="play"
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.7, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                    >
                        <Volume2 size={14} />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.button>
    );
}

// ── Agenda Item with language-aware content ───────────────────
function AgendaCard({ item }: { item: AgendaTranslation }) {
    return (
        <div className="mb-8">
            <p className="font-bold text-gray-800 mb-2">
                {item.title} {item.topic}
            </p>
            <div className="text-sm space-y-2">
                {item.result && (
                    <p className="text-gray-500">
                        ผลการพิจารณา:{" "}
                        <span className="text-gray-700">{item.result}</span>
                    </p>
                )}
                {item.discussion && (
                    <p className="text-gray-500">การอภิปราย: {item.discussion}</p>
                )}
                {item.warning && (
                    <p className="text-red-500 font-medium mt-2">• {item.warning}</p>
                )}
                {item.correction && (
                    <p className="text-blue-500 text-xs mt-1">✓ {item.correction}</p>
                )}
                {item.finalResult && (
                    <p className="text-green-600 text-xs">→ {item.finalResult}</p>
                )}
            </div>
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────
export default function SummaryPage() {
    const [selectedMeeting, setSelectedMeeting] = useState<MeetingItem>(meetingItems[0]);
    const [language, setLanguage] = useState<LanguageKey>("central");

    const translation = meetingTranslations[selectedMeeting.no]?.[language];
    const displayAgendas: AgendaTranslation[] =
        translation?.agenda ?? selectedMeeting.agenda ?? [];
    const displayClosing = translation?.closing ?? selectedMeeting.closing;

    return (
        <motion.div
            className="summary-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
        >
            <header className="summary-page-header">
                <Link href="/" className="summary-back-link">
                    <ChevronLeft size={22} />
                    <h1>สรุปการประชุมทั้งหมด</h1>
                </Link>
                <motion.button
                    className="summary-share-btn"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                >
                    <Share2 size={16} />
                    <span>Share</span>
                </motion.button>
            </header>

            <div className="flex gap-6 mt-6">
                {/* ── ซ้าย: รายการประชุม ── */}
                <div className="w-76 h-[600px] p-2 overflow-y-auto">
                    {meetingItems.map((item, index) => (
                        <div key={index} className="mb-2">
                            <MeetingSummaryCard
                                meeting={item}
                                index={index}
                                onClick={() => setSelectedMeeting(item)}
                            />
                        </div>
                    ))}
                </div>

                {/* ── ขวา: detail + สรุปวาระ ── */}
                <div className="flex-1 flex gap-6">
                    {/* คอลัมน์ 1: ข้อมูลหลัก */}
                    <div className="flex-1">
                        <MeetingDetailView meeting={selectedMeeting} />
                    </div>

                    {/* คอลัมน์ 2: สรุปวาระ + language dropdown + audio */}
                    <div className="w-96 bg-white border border-gray-200 rounded-2xl mt-5 p-6 shadow-sm flex flex-col h-[600px]">

                        {/* Header + controls */}
                        <div className="flex justify-between items-center mb-4 flex-shrink-0">
                            <h3 className="font-bold text-lg">สรุปวาระต่างๆ</h3>
                            <div className="flex items-center gap-2">
                                {/* Language Dropdown */}
                                <LanguageDropdown
                                    selected={language}
                                    onChange={(key) => setLanguage(key)}
                                />

                                {/* ── ปุ่มเล่นเสียง (ข้างๆ language dropdown) ── */}
                                <AudioPlayButton audioUrl={selectedMeeting.audioUrl} />

                                {/* Download */}
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-700 transition-all shadow-sm"
                                    title="ดาวน์โหลด"
                                    onClick={() => {/* TODO: download logic */}}
                                >
                                    <Download size={14} />
                                </motion.button>

                                {/* Share */}
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-700 transition-all shadow-sm"
                                    title="แชร์"
                                    onClick={() => {/* TODO: share logic */}}
                                >
                                    <Share2 size={14} />
                                </motion.button>
                            </div>
                        </div>

                        {/* Language badge */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={language}
                                className="mb-4 flex-shrink-0"
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 font-medium">
                                    {languageOptions.find((l) => l.key === language)?.label}
                                </span>
                            </motion.div>
                        </AnimatePresence>

                        {/* Scrollable agenda content */}
                        <div className="flex-1 overflow-y-auto pr-2 scroll-container">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={`${selectedMeeting.no}-${language}`}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.25 }}
                                >
                                    {displayAgendas.map((item, i) => (
                                        <AgendaCard key={i} item={item} />
                                    ))}

                                    {displayClosing && (
                                        <div className="mt-4 pt-4 border-t border-gray-100">
                                            <p className="text-xs text-gray-400 mb-1 font-medium uppercase tracking-wide">
                                                ปิดการประชุม
                                            </p>
                                            <p className="text-sm text-gray-600 leading-relaxed">
                                                {displayClosing}
                                            </p>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}