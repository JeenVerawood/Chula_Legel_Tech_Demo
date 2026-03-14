// components/MeetingDetailView.tsx
import { FileText } from "lucide-react";

const tagColors: Record<string, string> = {
    red: "#ef4444",
    yellow: "#eab308",
    green: "#22c55e",
    blue: "#3b82f6",
};

export default function MeetingDetailView({ meeting }: { meeting: any }) {
    if (!meeting) return <div className="text-gray-400 p-6">กรุณาเลือกรายการประชุม</div>;

    return (
        <div className="flex flex-col h-[600px] overflow-y-auto pt-5 space-y-4">
            {/* Header: แจ้งเตือน */}
            <div className="flex items-center gap-3 bg-white border border-gray-200 p-3 rounded-lg shadow-sm">
                <div className="w-1 bg-red-500 self-stretch rounded-full" />
                <div className="text-sm">
                    <p className="font-semibold text-gray-800">ทั้งหมด 3 การแจ้งเตือน</p>
                    <p className="text-gray-500 truncate">{meeting.title}</p>
                </div>
            </div>

            {/* ข้อมูลการประชุมหลัก */}
            <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
                {/* ส่วนแสดงแท็กสี */}
                <div className="flex items-center gap-2 mb-3">
                    {meeting.tags?.map((tag: string, i: number) => (
                        <div 
                            key={i} 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: tagColors[tag] || tag }} 
                        />
                    ))}
                </div>
                
                <h2 className="text-xl font-bold mb-4">{meeting.title}</h2>
                <div className="grid grid-cols-2 gap-y-3 text-sm">
                    <p className="text-gray-400">บริษัท: <span className="text-gray-700">{meeting.company}</span></p>
                    <p className="text-gray-400">ประเภท: <span className="text-gray-700">{meeting.type}</span></p>
                    <p className="text-gray-400">ครั้งที่: <span className="text-gray-700">{meeting.no}</span></p>
                    <p className="text-gray-400">วันที่: <span className="text-gray-700">{meeting.date}</span></p>
                    <p className="text-gray-400">เวลา: <span className="text-gray-700">{meeting.time}</span></p>
                    <p className="text-gray-400">สถานที่: <span className="text-gray-700">{meeting.location}</span></p>
                </div>
            </div>

            {/* ส่วนสรุปตอนปิดประชุม */}
            <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100">
                {meeting.closing}
            </p>
        </div>
    );
}