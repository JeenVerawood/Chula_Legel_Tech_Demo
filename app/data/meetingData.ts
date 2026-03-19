// ─────────────────────────────────────────────────────────────
// meetingData.ts
// Mock data สำหรับหน้า Summary — แยกออกมาจาก page.tsx
// TODO [BACKEND]: Replace with GET /api/meetings?status=completed
// ─────────────────────────────────────────────────────────────

export interface AgendaItem {
    title: string;
    topic: string;
    result?: string;
    discussion?: string;
    warning?: string;
    correction?: string;
    finalResult?: string;
    riskSummary?: string;
}

export interface MeetingItem {
    title: string;
    company: string;
    type: string;
    no: string;
    date: string;
    time: string;
    location: string;
    tags: string[];
    agenda: AgendaItem[];
    closing: string;
    audioUrl?: string; // ← เพิ่ม optional audio URL
}

export const meetingItems: MeetingItem[] = [
    {
        title: "พิจารณารับรองรายงานการประชุมผู้ถือหุ้นครั้งก่อน",
        company: "ABC จำกัด",
        type: "การประชุมสามัญประจำปี",
        no: "1/2569",
        date: "24 มกราคม 2569",
        time: "14:00 น. - 16:00 น.",
        location: "ห้องประชุม 2",
        tags: ["red", "yellow"],
        audioUrl: "/mp3/test.mp3", // ← ตัวอย่าง URL สำหรับไฟล์เสียง
        agenda: [
            {
                title: "วาระที่ 1",
                topic: "พิจารณารับรองรายงานการประชุมครั้งที่ผ่านมา",
                result: "ที่ประชุมมีมติรับรองรายงานการประชุมครั้งที่ผ่านมาเป็นเอกฉันท์",
            },
            {
                title: "วาระที่ 2",
                topic: "พิจารณาแนวทางการดำเนินโครงการใหม่",
                discussion: "มีการอภิปรายถึงงบประมาณลงทุนในโครงการระยะกลาง",
                warning: "ควรตรวจสอบความเสี่ยงด้านสภาพคล่องเพิ่มเติม",
            },
            {
                title: "วาระที่ 3",
                topic: "พิจารณาอนุมัติรายการที่อาจมีส่วนได้เสีย",
                discussion: "กรรมการที่มีส่วนได้เสียขอถอนตัวออกจากการลงมติ",
                warning: "กรรมการที่มีส่วนได้เสียไม่ควรร่วมลงมติในวาระนี้",
                correction: "กรรมการที่มีส่วนได้เสียลาออกเสียงและออกจากห้องประชุม",
                finalResult: "ที่ประชุมมีมติอนุมัติโดยกรรมการที่ไม่มีส่วนได้เสีย",
                riskSummary: "ความเสี่ยงด้านผลประโยชน์ทับซ้อนของกรรมการ",
            },
        ],
        closing: "ประธานกล่าวขอบคุณผู้ถือหุ้นที่ให้ความไว้วางใจในการดำเนินงานของบริษัท",
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
        audioUrl: "/audio/meeting-2.mp3",
        agenda: [
            {
                title: "วาระที่ 1",
                topic: "พิจารณาอนุมัติงบการเงิน",
                result: "ที่ประชุมอนุมัติงบการเงินตามที่ผู้สอบบัญชีเสนอ",
            },
            {
                title: "วาระที่ 2",
                topic: "พิจารณาจัดสรรกำไรสุทธิ",
                result: "อนุมัติการจ่ายเงินปันผลหุ้นละ 0.50 บาท",
            },
        ],
        closing: "ประธานแจ้งกำหนดการจ่ายเงินปันผลในวันที่ 30 มีนาคม 2569",
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
        audioUrl: "/audio/meeting-3.mp3",
        agenda: [
            {
                title: "วาระที่ 1",
                topic: "คัดเลือกกรรมการรายใหม่",
                result: "ที่ประชุมมีมติเลือกคุณสมชาย แทนกรรมการที่ครบวาระ",
            },
            {
                title: "วาระที่ 2",
                topic: "กำหนดค่าตอบแทนกรรมการ",
                result: "เห็นชอบให้คงอัตราค่าตอบแทนเดิมไว้",
            },
        ],
        closing: "ประธานขอบคุณกรรมการที่ครบวาระสำหรับการทำงานที่ผ่านมา",
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
        audioUrl: "/audio/meeting-4.mp3",
        agenda: [
            {
                title: "วาระที่ 1",
                topic: "อนุมัติแผนการควบรวม",
                result: "ที่ประชุมเห็นชอบในหลักการ",
            },
            {
                title: "วาระที่ 2",
                topic: "แต่งตั้งที่ปรึกษาทางการเงินอิสระ",
                result: "แต่งตั้งบริษัท ABC Advisory เข้าดำเนินการ",
            },
        ],
        closing: "ประธานเน้นย้ำเรื่องการรักษาความลับข้อมูลก่อนการเปิดเผยต่อตลาดหลักทรัพย์",
    },
];