"use client";

import { User } from "lucide-react";
import { motion } from "framer-motion";

// เพิ่มโครงสร้างข้อมูลใหม่เข้าไปใน Interface
interface AgendaItem {
    title: string;
    topic: string;
    result?: string;    // เติม ? ให้เป็น optional
    discussion?: string; // เติม ? ให้เป็น optional
    warning?: string;    // เติม ? ให้เป็น optional
}

interface MeetingData {
    title: string;
    company?: string;
    type?: string;
    no: string;
    date: string;
    time?: string;
    location?: string;
    tags: string[];
    closing?: string;    // เนื้อหาตอนปิดประชุม
    agenda?: AgendaItem[]; // รายละเอียดวาระ
}

interface MeetingSummaryCardProps {
    meeting: MeetingData;
    index: number;
    onClick?: () => void;
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
            onClick={onClick}

        >
            <div className="summary-card-tags">
                {meeting.tags.map((tag, i) => (
                    <div key={i} className="summary-card-tag" style={{ backgroundColor: tagColors[tag] || tag }} />
                ))}
            </div>

            <div className="summary-card-body">
                <div className="summary-card-header">
                    <div className="summary-card-avatar"><User size={24} strokeWidth={1.5} /></div>
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