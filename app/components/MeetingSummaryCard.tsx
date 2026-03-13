"use client";

import { User } from "lucide-react";
import { motion } from "framer-motion";

interface MeetingData {
    title: string;
    company?: string;
    type?: string;
    no: string;
    date: string;
    time?: string;
    location?: string;
    tags: string[];
}

interface MeetingSummaryCardProps {
    meeting: MeetingData;
    index: number;
    onClick?: () => void; // เพิ่ม onClick สำหรับเลือกรายการ
}

export default function MeetingSummaryCard({ meeting, index, onClick }: MeetingSummaryCardProps) {
    const tagColors: Record<string, string> = {
        red: "#ef4444",
        yellow: "#eab308",
        green: "#22c55e",
        blue: "#3b82f6",
    };

    return (
        <motion.div
            className="summary-card-wrapper cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.05 }}
            onClick={onClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <div className="summary-card-tags">
                {meeting.tags.map((tag, i) => (
                    <div
                        key={`${tag}-${i}`}
                        className="summary-card-tag"
                        style={{ backgroundColor: tagColors[tag] || tag }}
                    />
                ))}
            </div>

            <div className="summary-card-body">
                <div className="summary-card-header">
                    <div className="summary-card-avatar">
                        <User size={24} strokeWidth={1.5} />
                    </div>
                    <h3 className="summary-card-title">{meeting.title}</h3>
                </div>

                <div className="summary-card-details">
                    <div className="summary-card-row">
                        <span className="summary-card-label">ครั้งที่:</span>
                        <span className="summary-card-value">{meeting.no}</span>
                    </div>
                    <div className="summary-card-row">
                        <span className="summary-card-label">วันที่:</span>
                        <span className="summary-card-value">{meeting.date}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}