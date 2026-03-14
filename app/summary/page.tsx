"use client";

import { ChevronLeft, Share2 } from "lucide-react";
import Link from "next/link";
import MeetingSummaryCard from "../components/MeetingSummaryCard";
import { motion } from "framer-motion";
import { useState } from "react";
import MeetingDetailView from "../components/MeetingDetailView";

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
        agenda: [
            { title: "วาระที่ 1", topic: "พิจารณารับรองรายงานการประชุมครั้งที่ผ่านมา", result: "ที่ประชุมมีมติรับรองรายงานการประชุมครั้งที่ผ่านมาเป็นเอกฉันท์" },
            { title: "วาระที่ 2", topic: "พิจารณาแนวทางการดำเนินโครงการใหม่", discussion: "มีการอภิปรายถึงงบประมาณลงทุน", warning: "ควรตรวจสอบความเสี่ยงด้านสภาพคล่องเพิ่มเติม" }
        ],
        closing: "ประธานกล่าวขอบคุณผู้ถือหุ้นที่ให้ความไว้วางใจในการดำเนินงานของบริษัท"
    },
    {
        title: "พิจารณาอนุมัติงบการเงินประจำปี สิ้นสุดวันที่ 31 ธันวาคม 2568",
        company: "XYZ โฮลดิ้ง",
        type: "การประชุมสามัญประจำปี",
        no: "2/2569",
        date: "15 กุมภาพันธ์ 2569",
        time: "10:00 น. - 12:00 น.",
        location: "ห้องประชุมใหญ่ ชั้น 15",
        tags: ["green", "blue"],
        agenda: [
            { title: "วาระที่ 1", topic: "พิจารณาอนุมัติงบการเงิน", result: "ที่ประชุมอนุมัติงบการเงินตามที่ผู้สอบบัญชีเสนอ" },
            { title: "วาระที่ 2", topic: "พิจารณาจัดสรรกำไรสุทธิ", result: "อนุมัติการจ่ายเงินปันผลหุ้นละ 0.50 บาท" }
        ],
        closing: "ประธานแจ้งกำหนดการจ่ายเงินปันผลในวันที่ 30 มีนาคม 2569"
    },
    {
        title: "พิจารณาแต่งตั้งกรรมการแทนกรรมการที่ครบวาระ",
        company: "ABC จำกัด",
        type: "การประชุมคณะกรรมการ",
        no: "3/2569",
        date: "28 กุมภาพันธ์ 2569",
        time: "13:30 น. - 15:00 น.",
        location: "ห้องประชุมบอร์ดรูม",
        tags: ["yellow", "red"],
        agenda: [
            { title: "วาระที่ 1", topic: "คัดเลือกกรรมการรายใหม่", result: "ที่ประชุมมีมติเลือกคุณสมชาย แทนกรรมการที่ครบวาระ" },
            { title: "วาระที่ 2", topic: "กำหนดค่าตอบแทนกรรมการ", result: "เห็นชอบให้คงอัตราค่าตอบแทนเดิมไว้" }
        ],
        closing: "ประธานขอบคุณกรรมการที่ครบวาระสำหรับการทำงานที่ผ่านมา"
    },
    {
        title: "พิจารณาแผนการควบรวมกิจการ (M&A) กับบริษัทในเครือ",
        company: "Global Tech",
        type: "การประชุมวิสามัญ",
        no: "4/2569",
        date: "10 มีนาคม 2569",
        time: "09:00 น. - 17:00 น.",
        location: "ออนไลน์ (Zoom)",
        tags: ["blue", "green"],
        agenda: [
            { title: "วาระที่ 1", topic: "อนุมัติแผนการควบรวม", result: "ที่ประชุมเห็นชอบในหลักการ" },
            { title: "วาระที่ 2", topic: "แต่งตั้งที่ปรึกษาทางการเงินอิสระ", result: "แต่งตั้งบริษัท ABC Advisory เข้าดำเนินการ" }
        ],
        closing: "ประธานเน้นย้ำเรื่องการรักษาความลับข้อมูลก่อนการเปิดเผยต่อตลาดหลักทรัพย์"
    },
    {
    title: "พิจารณารับรองรายงานการประชุมผู้ถือหุ้นครั้งก่อน",
    company: "ABC จำกัด",
    type: "การประชุมสามัญประจำปี",
    no: "1/2569",
    date: "24 มกราคม 2569",
    time: "14:00 น. - 16:00 น.",
    location: "ห้องประชุม 2",
    tags: ["red", "yellow"],
    agenda: [
        { 
            title: "วาระที่ 1", 
            topic: "พิจารณารับรองรายงานการประชุมครั้งที่ผ่านมา", 
            result: "ที่ประชุมมีมติรับรองรายงานการประชุมครั้งที่ผ่านมาเป็นเอกฉันท์" 
        },
        { 
            title: "วาระที่ 2", 
            topic: "พิจารณาแนวทางการดำเนินโครงการใหม่", 
            discussion: "ในระหว่างการพิจารณาวาระนี้ มีถ้อยคำที่กล่าวในที่ประชุมดังนี้ “วาระนี้ขอคุยกว้าง ๆ ไว้ก่อน รายละเอียดค่อยไปใส่ในรายงานประชุม”",
            warning: "ถ้อยคำดังกล่าวอาจทำให้วาระการประชุมไม่ชัดเจน เสี่ยงต่อการถูกตีความว่าเป็นการพิจารณาเรื่องนอกวาระ หรือไม่ได้แจ้งผู้ถือหุ้นล่วงหน้า หากเรื่องดังกล่าวเข้าข่ายมติ มติอาจไม่ชอบด้วยกฎหมาย",
            correction: "ประธานที่ประชุมได้สรุปรอบการพิจารณาใหม่ โดยระบุว่า “การประชุมครั้งนี้เป็นเพียงการรับทราบและพิจารณาในหลักการเท่านั้น โดยยังไม่มีการลงมติในประเด็นที่อาจเข้าข่ายมติพิเศษ”",
            finalResult: "ที่ประชุมมีมติรับทราบแนวคิดหลักและให้ฝ่ายบริหารจัดทำรายละเอียดเพื่อนำเสนอในการประชุมครั้งถัดไป"
        },
        { 
            title: "วาระที่ 3", 
            topic: "พิจารณาอนุมัติรายการที่อาจมีส่วนได้เสีย", 
            discussion: "มีกรรมการท่านหนึ่งกล่าวว่า “ถึงจะเกี่ยวข้องกับตัวเอง แต่ก็เป็นกรรมการเหมือนกัน น่าจะโหวตได้”",
            warning: "ถ้อยคำดังกล่าวเข้าข่ายความเสี่ยง เรื่องผลประโยชน์ทับซ้อน กรรมการที่มีส่วนได้เสียไม่ควรเข้าร่วมอภิปรายและลงมติในวาระนั้น",
            correction: "กรรมการที่มีส่วนได้เสียลาออกเสียงและออกจากห้องประชุมระหว่างการพิจารณาวาระนี้",
            finalResult: "ที่ประชุมมีมติอนุมัติรายการดังกล่าวโดยกรรมการที่ไม่มีส่วนได้เสีย",
            riskSummary: "การใช้ถ้อยคำที่ทำให้วาระการประชุมไม่ชัดเจน, ความเสี่ยงในการพิจารณาเรื่องที่อาจเข้าข่ายวาระพิเศษโดยไม่แจ้งล่วงหน้า, ความเสี่ยงด้านผลประโยชน์ทับซ้อนของกรรมการ"
        }
    ],
    closing: "ประธานที่ประชุมได้สอบถามว่ามีผู้ใดประสงค์จะเสนอเรื่องอื่นใดเพิ่มเติมหรือไม่ เมื่อไม่มีผู้ใดเสนอเรื่องอื่นเพิ่มเติม ประธานจึงได้กล่าวขอบคุณผู้เข้าร่วมประชุมทุกท่านที่ได้สละเวลาเข้าร่วมประชุมและให้ข้อคิดเห็นอันเป็นประโยชน์ต่อบริษัท"
}
];



export default function SummaryPage() {
    const [selectedMeeting, setSelectedMeeting] = useState(meetingItems[0]);
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

            <div className="flex gap-6 mt-6 ">
            <div className="w-76 h-[600px] p-2   overflow-y-auto ">
                {meetingItems.map((item, index) => (
                    <div key={index} className="mb-2">
                        <MeetingSummaryCard 
                            meeting={item} 
                            index={index} 
                            onClick={() => setSelectedMeeting(item)} // คลิกที่นี่
                        />
                    </div>
                ))}
            </div>
            
            {/* ฝั่งขวาแสดงผลตาม state */}
            <div className="flex-1 flex gap-6">
            {/* คอลัมน์ย่อย 1: ข้อมูลหลัก */}
            <div className="flex-1">
                <MeetingDetailView meeting={selectedMeeting} />
            </div>  

            {/* คอลัมน์ย่อย 2: สรุปวาระ (ตามรูป) */}
            <div className="w-96 bg-white border border-gray-200 rounded-2xl mt-5 p-6 shadow-sm flex flex-col h-[600px]">
            <div className="flex justify-between items-center mb-6 flex-shrink-0">
                <h3 className="font-bold text-lg">สรุปวาระต่างๆ</h3>
                <span className="text-xs border px-2 py-1 rounded text-gray-500">PDF</span>
            </div>
            
            {/* สรุปวาระทั้งหมด: ให้ส่วนนี้เลื่อนได้ (Scrollable Content) */}
            <div className="flex-1 overflow-y-auto pr-2 scroll-container">
                {selectedMeeting.agenda?.map((item: any, i: number) => (
                    <div key={i} className="mb-8">
                        <p className="font-bold text-gray-800 mb-2">{item.title} {item.topic}</p>
                        <div className="text-sm space-y-2">
                            <p className="text-gray-500">ผลการพิจารณา: <span className="text-gray-700">{item.result}</span></p>
                            {item.discussion && <p className="text-gray-500">การอภิปราย: {item.discussion}</p>}
                            {item.warning && <p className="text-red-500 font-medium mt-2">• {item.warning}</p>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
        </div>
        </div>
        </motion.div>
    );
}
