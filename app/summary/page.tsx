"use client";

import { ChevronLeft, Share2 } from "lucide-react";
import Link from "next/link";
import MeetingSummaryCard from "../components/MeetingSummaryCard";
import { motion } from "framer-motion";

// TODO [BACKEND]: Replace with GET /api/meetings?status=completed — see HANDOFF.md
const meetingItems = [
    {
        title: "พิจารณารับรองรายงานการประชุมผู้ถือหุ้นครั้งก่อน",
        company: "ABC จำกัด",
        type: "การประชุมสามัญประจำปี",
        no: "1/2569",
        date: "24 มกราคม 2569",
        time: "14:00 น. - 16:00 น.",
        location: "ห้องประชุม 2",
        tags: ["red", "yellow"],
    },
    {
        title: "พิจารณาเลือกตั้งกรรมการแทนกรรมการที่ครบวาระ",
        company: "ABC จำกัด",
        type: "การประชุมสามัญประจำปี",
        no: "1/2569",
        date: "24 กุมภาพันธ์ 2569",
        time: "12:00 น. - 13:00 น.",
        location: "ห้องประชุม 5 และสื่ออิเล็กทรอนิกส์",
        tags: ["yellow", "green"],
    },
    {
        title: "พิจารณากำหนดค่าตอบแทนคณะกรรมการบริษัท ประจำปี 2569",
        company: "ABC จำกัด",
        type: "การประชุมคณะกรรมการ",
        no: "2/2569",
        date: "25 มกราคม 2569",
        time: "13:30 น. - 16:30 น.",
        location: "ณ ห้องประชุมบอร์ดรูม",
        tags: ["red", "blue"],
    },
    {
        title: "พิจารณากำหนดค่าตอบแทนคณะกรรมการบริษัท ประจำปี 2569",
        company: "ABC จำกัด",
        type: "การประชุมคณะกรรมการ",
        no: "2/2569",
        date: "25 มกราคม 2569",
        time: "13:30 น. - 16:30 น.",
        location: "ณ ห้องประชุมบอร์ดรูม",
        tags: ["red", "blue"],
    },
];



export default function SummaryPage() {
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
                <div className="w-76 h-[600px] rounded-lg overflow-y-auto overflow-x-hidden scroll-container ">
                    <div className="flex flex-col gap-6"> 
                        {meetingItems.map((item, index) => (
                            <div key={index} className="mb-2 "> {/* ใส่ mb-2 หรือเพิ่ม padding ช่วยอีกชั้น */}
                                <MeetingSummaryCard meeting={item} index={index} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex-1 bg-white border border-gray-200 rounded-lg p-6">
                    {/* ใส่เนื้อหารายละเอียดการประชุมของคุณที่นี่ */}
                </div>
            </div>

        </motion.div>
    );
}
