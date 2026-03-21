"use client";

import {
    ChevronLeft,
    ChevronDown,
    AlertCircle,
    Calendar as CalendarIcon,
    ChevronRight,
    Plus,
    Trash2,
    RotateCcw,
    PenTool,
    Check,
    UserPlus,
    X,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ShareModal from './ShareModal';

interface AttendeeOption {
    id: string;
    label: string;
}

const DEFAULT_ATTENDEES: AttendeeOption[] = [
    { id: "1", label: "นาย วีรสัก เจรจรูน (ทอม)" },
    { id: "2", label: "นาง สมใจ รักดี (แนน)" },
    { id: "3", label: "นาย ประสิทธิ์ มีชัย (ปั้น)" },
];

export default function CreateMeetingForm() {
    const options3 = ["สามัญ", "วิสามัญ"];

    const [showShareModal, setShowShareModal] = useState(false);
    const [shareUrl, setShareUrl] = useState("");

    const [role, setRole] = useState<"shareholder" | "director" | "">("");
    const [selected2, setSelected2] = useState("");
    const [callerName, setCallerName] = useState("");
    const [subject, setSubject] = useState("");
    const [meetingNo, setMeetingNo] = useState("");
    const [meetingSubType, setMeetingSubType] = useState("");
    const [location, setLocation] = useState("");
    const [meetingDate, setMeetingDate] = useState("");
    const [meetingDateSent, setMeetingDateSent] = useState("");
    const [agendas, setAgendas] = useState([""]);
    const [agendaText, setAgendaText] = useState("");
    const [signerName, setSignerName] = useState("");
    const [signerPosition, setSignerPosition] = useState("");

    const [attendeeOptions, setAttendeeOptions] = useState<AttendeeOption[]>(DEFAULT_ATTENDEES);
    const [selectedAttendees, setSelectedAttendees] = useState<AttendeeOption[]>([]);
    const [isAttendeesOpen, setIsAttendeesOpen] = useState(false);
    const [showAddAttendee, setShowAddAttendee] = useState(false);
    const [newAttendeeName, setNewAttendeeName] = useState("");
    const attendeesRef = useRef<HTMLDivElement>(null);

    const [isOpen3, setIsOpen3] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [showCalendarSent, setShowCalendarSent] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

    const sigCanvas = useRef<SignatureCanvas | null>(null);
    const [isSigned, setIsSigned] = useState(false);

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (attendeesRef.current && !attendeesRef.current.contains(e.target as Node)) {
                setIsAttendeesOpen(false);
                setShowAddAttendee(false);
                setNewAttendeeName("");
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const draft = localStorage.getItem("meeting_draft");
        if (!draft) return;
        const savedData = JSON.parse(draft);
        if (savedData.role) setRole(savedData.role);
        if (savedData.role === "director") {
            if (savedData["d1"]) setCallerName(savedData["d1"]);
            if (savedData["d2"]) setAgendaText(savedData["d2"]);
            setSelected2("ประชุมคณะกรรมการ");
        } else {
            if (savedData["1"]) setSelected2(savedData["1"]);
            if (savedData["2"]) setCallerName(savedData["2"]);
            if (savedData["3"]) setAgendas(savedData["3"]);
        }
    }, []);

    const changeMonth = (offset: number) =>
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1));

    const selectDate = (day: number) => {
        const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        setMeetingDate(selected.toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" }));
        setShowCalendar(false);
        setErrors((prev) => ({ ...prev, date: false }));
    };

    const selectDateSent = (day: number) => {
        const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        setMeetingDateSent(selected.toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" }));
        setShowCalendarSent(false);
        setErrors((prev) => ({ ...prev, dateSent: false }));
    };

    const addAgenda = () => setAgendas([...agendas, ""]);
    const updateAgenda = (index: number, value: string) => {
        const newAgendas = [...agendas];
        newAgendas[index] = value;
        setAgendas(newAgendas);
        if (value.trim()) setErrors((prev) => ({ ...prev, agendas: false }));
    };
    const removeAgenda = (index: number) => {
        if (agendas.length > 1) setAgendas(agendas.filter((_, i) => i !== index));
    };

    const clearSignature = () => {
        sigCanvas.current?.clear();
        setIsSigned(false);
        setErrors((prev) => ({ ...prev, signature: false }));
    };

    const handleReset = () => {
        if (confirm("คุณต้องการล้างข้อมูลทั้งหมดและเริ่มสร้างการประชุมใหม่ใช่หรือไม่?")) {
            localStorage.removeItem("meeting_draft");
            window.location.reload();
        }
    };

    const closeAllDropdowns = () => {
        setIsOpen3(false);
        setShowCalendar(false);
        setShowCalendarSent(false);
        setIsAttendeesOpen(false);
        setShowAddAttendee(false);
        setNewAttendeeName("");
    };

    const toggleAttendee = (option: AttendeeOption) => {
        const exists = selectedAttendees.find((a) => a.id === option.id);
        if (exists) {
            setSelectedAttendees(selectedAttendees.filter((a) => a.id !== option.id));
        } else {
            setSelectedAttendees([...selectedAttendees, option]);
        }
        setErrors((prev) => ({ ...prev, attendees: false }));
    };

    const removeSelectedAttendee = (id: string) =>
        setSelectedAttendees(selectedAttendees.filter((a) => a.id !== id));

    const handleAddNewAttendee = () => {
        const trimmed = newAttendeeName.trim();
        if (!trimmed) return;
        const newOption: AttendeeOption = { id: Date.now().toString(), label: trimmed };
        setAttendeeOptions([...attendeeOptions, newOption]);
        setSelectedAttendees([...selectedAttendees, newOption]);
        setNewAttendeeName("");
        setShowAddAttendee(false);
        setErrors((prev) => ({ ...prev, attendees: false }));
    };

    const handleSave = () => {
        const isSigEmpty = sigCanvas.current ? sigCanvas.current.isEmpty() : true;
        const isDirector = role === "director";
        const newErrors: { [key: string]: boolean } = {
            companyType: false, // ← ไม่เช็ค เพราะชื่อบริษัท hardcode
            meetingType: isDirector ? false : !selected2,
            caller: !callerName.trim(),
            subject: !subject.trim(),
            meetingNo: !meetingNo.trim(),
            meetingSubType: !meetingSubType,
            attendees: selectedAttendees.length === 0,
            location: !location.trim(),
            date: !meetingDate,
            dateSent: !meetingDateSent,
            signer: !signerName.trim(),
            position: !signerPosition.trim(),
            agendas: isDirector ? !agendaText.trim() : agendas.some((a) => !a.trim()),
            signature: isSigEmpty,
        };
        setErrors(newErrors);
        if (Object.values(newErrors).some((v) => v)) return;

        // ✅ validation ผ่าน → เปิด ShareModal
        const url = `${window.location.origin}/meeting/${Date.now()}`;
        setShareUrl(url);
        setShowShareModal(true);
    };

    const renderCalendarGrid = (onSelectDay: (day: number) => void) => (
        <motion.div
            className="create-form-calendar"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
        >
            <div className="create-form-calendar-header">
                <button onClick={() => changeMonth(-1)} className="create-form-calendar-nav">
                    <ChevronLeft size={18} />
                </button>
                <span className="create-form-calendar-month">
                    {currentMonth.toLocaleDateString("th-TH", { month: "long", year: "numeric" })}
                </span>
                <button onClick={() => changeMonth(1)} className="create-form-calendar-nav">
                    <ChevronRight size={18} />
                </button>
            </div>
            <div className="create-form-calendar-grid">
                {["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"].map((d) => (
                    <span key={d} className="create-form-calendar-day-label">{d}</span>
                ))}
                {Array.from({ length: firstDayOfMonth(currentMonth.getFullYear(), currentMonth.getMonth()) }).map((_, i) => (
                    <div key={`e-${i}`} />
                ))}
                {Array.from({ length: daysInMonth(currentMonth.getFullYear(), currentMonth.getMonth()) }).map((_, i) => (
                    <button key={i} onClick={() => onSelectDay(i + 1)} className="create-form-calendar-day">
                        {i + 1}
                    </button>
                ))}
            </div>
        </motion.div>
    );

    return (
        <>
            {/* ── Share Modal ── */}
            <ShareModal
                isOpen={showShareModal}
                onClose={() => setShowShareModal(false)}
                meetingTitle={subject || "หนังสือเชิญประชุม"}
                shareUrl={shareUrl}
            />

            <motion.div
                className="max-w-2xl mx-auto mt-10 px-4"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <div className="flex justify-between items-center mb-6">
                    <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition">
                        <ChevronLeft size={20} />
                        <span>ย้อนกลับ</span>
                    </Link>
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 transition px-3 py-1.5 rounded-lg border border-red-100 hover:bg-red-50"
                    >
                        <RotateCcw size={14} />
                        สร้างการประชุมใหม่
                    </button>
                </div>

                <div className="create-form-card">
                    {/* 1. Company */}
                    <div className="create-form-field">
                        <div className="create-form-field-header"><label>ชื่อบริษัท</label></div>
                        <div className="create-form-select-wrapper">
                            <div className="create-form-select"><h1>Legal Tech จำกัด.</h1></div>
                        </div>
                    </div>

                    {/* 2. Meeting type */}
                    <div className="create-form-field">
                        <div className="create-form-field-header">
                            <label>ประเภทการประชุม</label>
                            {errors.meetingType && <span className="create-form-error"><AlertCircle size={12} /> จำเป็น</span>}
                        </div>
                        <div className="create-form-select-wrapper">
                            {role === "director" ? (
                                <div className="create-form-input bg-gray-50 text-gray-400 pointer-events-none select-none">-</div>
                            ) : (
                                <button
                                    onClick={() => { closeAllDropdowns(); }}
                                    className={`create-form-select ${errors.meetingType ? "create-form-select-error" : ""}`}
                                >
                                    <span className={selected2 ? "" : "create-form-placeholder"}>
                                        {selected2 || "คลิกเลือกประเภท..."}
                                    </span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* 3. Caller */}
                    <div className="create-form-field">
                        <div className="create-form-field-header"><label>ผู้เรียกประชุม</label></div>
                        <div className="create-form-input bg-gray-50 text-gray-700">
                            {callerName || <span className="text-gray-400">ไม่มีข้อมูลจากหน้า Quiz</span>}
                        </div>
                    </div>

                    {/* 4. Subject */}
                    <div className="create-form-field">
                        <div className="create-form-field-header">
                            <label>เรื่อง</label>
                            {errors.subject && <span className="create-form-error"><AlertCircle size={12} /> จำเป็น</span>}
                        </div>
                        <input type="text" value={subject} placeholder="หนังสือนัดประชุม..."
                            onChange={(e) => { setSubject(e.target.value); setErrors({ ...errors, subject: false }); }}
                            className={`create-form-input ${errors.subject ? "create-form-input-error" : ""}`} />
                    </div>

                    {/* 5. Attendees */}
                    <div className="create-form-field" ref={attendeesRef}>
                        <div className="create-form-field-header">
                            <label>เรียน</label>
                            {errors.attendees && <span className="create-form-error"><AlertCircle size={12} /> กรุณาเลือกผู้รับอย่างน้อย 1 คน</span>}
                        </div>
                        {selectedAttendees.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-2">
                                {selectedAttendees.map((a) => (
                                    <span key={a.id} className="flex items-center gap-1 bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full border border-blue-200">
                                        {a.label}
                                        <button onClick={() => removeSelectedAttendee(a.id)} className="ml-1 hover:text-red-500 transition">
                                            <X size={12} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                        <div className="create-form-select-wrapper">
                            <button
                                onClick={() => { closeAllDropdowns(); setIsAttendeesOpen(!isAttendeesOpen); }}
                                className={`create-form-select ${errors.attendees ? "create-form-select-error" : ""}`}
                            >
                                <span className="create-form-placeholder">
                                    {selectedAttendees.length > 0 ? `เลือกแล้ว ${selectedAttendees.length} คน` : "คลิกเพื่อเลือกผู้รับ..."}
                                </span>
                                <ChevronDown size={18} className={`transition-transform ${isAttendeesOpen ? "rotate-180" : ""}`} />
                            </button>
                            <AnimatePresence>
                                {isAttendeesOpen && (
                                    <motion.div className="create-form-dropdown" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15 }}>
                                        {attendeeOptions.map((option) => {
                                            const isSelected = !!selectedAttendees.find((a) => a.id === option.id);
                                            return (
                                                <button key={option.id} onClick={() => toggleAttendee(option)}
                                                    className={`create-form-dropdown-item flex items-center justify-between gap-2 ${isSelected ? "bg-blue-50 text-blue-700" : ""}`}>
                                                    <span>{option.label}</span>
                                                    {isSelected && <Check size={14} className="text-blue-600 flex-shrink-0" />}
                                                </button>
                                            );
                                        })}
                                        <div className="border-t border-gray-100 my-1" />
                                        {!showAddAttendee ? (
                                            <button onClick={() => setShowAddAttendee(true)}
                                                className="create-form-dropdown-item flex items-center gap-2 text-blue-600 hover:bg-blue-50 font-medium">
                                                <UserPlus size={14} />เพิ่มรายชื่อใหม่
                                            </button>
                                        ) : (
                                            <div className="px-3 py-2 flex flex-col gap-2">
                                                <input type="text" value={newAttendeeName}
                                                    onChange={(e) => setNewAttendeeName(e.target.value)}
                                                    onKeyDown={(e) => { if (e.key === "Enter") handleAddNewAttendee(); }}
                                                    placeholder="เช่น นาย วีรสัก เจรจรูน (ทอม)"
                                                    className="create-form-input text-sm" autoFocus />
                                                <div className="flex gap-2">
                                                    <button onClick={handleAddNewAttendee}
                                                        className="flex-1 flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-sm py-1.5 rounded-lg transition">
                                                        <Plus size={13} />เพิ่ม
                                                    </button>
                                                    <button onClick={() => { setShowAddAttendee(false); setNewAttendeeName(""); }}
                                                        className="flex-1 text-sm py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition text-gray-600">
                                                        ยกเลิก
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* 6. Meeting number + subtype */}
                    <div className="create-form-field">
                        <div className="create-form-field-header">
                            <label>ครั้งที่</label>
                            {(errors.meetingNo || errors.meetingSubType) && <span className="create-form-error"><AlertCircle size={12} /> จำเป็น</span>}
                        </div>
                        <div className="create-form-row">
                            <input type="text" value={meetingNo} placeholder="1/2569"
                                onChange={(e) => { setMeetingNo(e.target.value); setErrors({ ...errors, meetingNo: false }); }}
                                className={`create-form-input create-form-input-short ${errors.meetingNo ? "create-form-input-error" : ""}`} />
                            <div className="create-form-select-wrapper create-form-flex-1">
                                <button onClick={() => { closeAllDropdowns(); setIsOpen3(!isOpen3); }}
                                    className={`create-form-select ${errors.meetingSubType ? "create-form-select-error" : ""}`}>
                                    <span className={meetingSubType ? "" : "create-form-placeholder"}>{meetingSubType || "เลือกประเภท..."}</span>
                                    <ChevronDown size={18} />
                                </button>
                                {isOpen3 && (
                                    <motion.div className="create-form-dropdown" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}>
                                        {options3.map((opt) => (
                                            <button key={opt}
                                                onClick={() => { setMeetingSubType(opt); setIsOpen3(false); setErrors({ ...errors, meetingSubType: false }); }}
                                                className="create-form-dropdown-item">{opt}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 7. Meeting date */}
                    <div className="create-form-field">
                        <div className="create-form-field-header">
                            <label>วันที่ประชุม</label>
                            {errors.date && <span className="create-form-error"><AlertCircle size={12} /> จำเป็น</span>}
                        </div>
                        <div className="create-form-select-wrapper">
                            <button onClick={() => { closeAllDropdowns(); setShowCalendar(!showCalendar); }}
                                className={`create-form-select ${errors.date ? "create-form-select-error" : ""}`}>
                                <span className={meetingDate ? "" : "create-form-placeholder"}>{meetingDate || "กดเพื่อเลือกวันที่..."}</span>
                                <CalendarIcon size={18} />
                            </button>
                            {showCalendar && renderCalendarGrid(selectDate)}
                        </div>
                    </div>

                    {/* 8. Location */}
                    <div className="create-form-field">
                        <div className="create-form-field-header">
                            <label>สถานที่</label>
                            {errors.location && <span className="create-form-error"><AlertCircle size={12} /> จำเป็น</span>}
                        </div>
                        <input type="text" value={location} placeholder="ระบุสถานที่ประชุม..."
                            onChange={(e) => { setLocation(e.target.value); setErrors({ ...errors, location: false }); }}
                            className={`create-form-input ${errors.location ? "create-form-input-error" : ""}`} />
                    </div>

                    {/* 9. Agendas */}
                    <div className="create-form-field">
                        <div className="create-form-field-header"><label>วาระการประชุม</label></div>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 min-h-[60px]">
                            {role === "director" ? (
                                agendaText
                                    ? <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{agendaText}</p>
                                    : <span className="text-gray-400 text-sm">ไม่มีข้อมูลวาระ...</span>
                            ) : (
                                agendas.filter(Boolean).length > 0 ? (
                                    <ul className="list-decimal pl-5 text-sm space-y-1">
                                        {agendas.filter(Boolean).map((agenda, index) => (
                                            <li key={index} className="text-gray-700">{agenda}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <span className="text-gray-400 text-sm">ไม่มีข้อมูลวาระ...</span>
                                )
                            )}
                        </div>
                    </div>

                    <div className="create-form-divider" />

                    {/* 10. Signer */}
                    <div className="create-form-field">
                        <div className="create-form-field-header">
                            <label>ลงชื่อ</label>
                            {errors.signer && <span className="create-form-error"><AlertCircle size={12} /> จำเป็น</span>}
                        </div>
                        <input type="text" value={signerName} placeholder="ชื่อ-นามสกุล ของผู้ลงนาม..."
                            onChange={(e) => { setSignerName(e.target.value); setErrors({ ...errors, signer: false }); }}
                            className={`create-form-input ${errors.signer ? "create-form-input-error" : ""}`} />
                    </div>

                    {/* 11. Position */}
                    <div className="create-form-field">
                        <div className="create-form-field-header">
                            <label>ตำแหน่ง</label>
                            {errors.position && <span className="create-form-error"><AlertCircle size={12} /> จำเป็น</span>}
                        </div>
                        <input type="text" value={signerPosition} placeholder="เช่น กรรมการผู้มีอำนาจลงนาม..."
                            onChange={(e) => { setSignerPosition(e.target.value); setErrors({ ...errors, position: false }); }}
                            className={`create-form-input ${errors.position ? "create-form-input-error" : ""}`} />
                    </div>

                    {/* 12. Signature */}
                    <div className="create-form-field">
                        <div className="create-form-field-header">
                            <label className="create-form-label-with-icon"><PenTool size={16} />ลงลายมือชื่อ</label>
                            <button onClick={clearSignature} className="create-form-clear-sig"><RotateCcw size={12} />ล้างลายเส้น</button>
                        </div>
                        <div className={`create-form-signature ${errors.signature ? "create-form-signature-error" : ""}`}>
                            <SignatureCanvas ref={sigCanvas} penColor="black"
                                onBegin={() => { setIsSigned(true); setErrors({ ...errors, signature: false }); }}
                                canvasProps={{ className: "create-form-signature-canvas" }} />
                            {!isSigned && <div className="create-form-signature-placeholder">ใช้นิ้ววาดลายเซ็นที่นี่</div>}
                        </div>
                    </div>

                    {/* 13. Date sent */}
                    <div className="create-form-field">
                        <div className="create-form-field-header">
                            <label>วันที่ส่งนัดหมาย</label>
                            {errors.dateSent && <span className="create-form-error"><AlertCircle size={12} /> จำเป็น</span>}
                        </div>
                        <div className="create-form-select-wrapper">
                            <button onClick={() => { closeAllDropdowns(); setShowCalendarSent(!showCalendarSent); }}
                                className={`create-form-select ${errors.dateSent ? "create-form-select-error" : ""}`}>
                                <span className={meetingDateSent ? "" : "create-form-placeholder"}>{meetingDateSent || "เลือกวันที่ส่ง..."}</span>
                                <CalendarIcon size={18} />
                            </button>
                            <p className="create-form-hint">* ต้องส่งไม่น้อยกว่า 7 วัน ก่อนวันประชุม (ถ้ามติพิเศษ ไม่น้อยกว่า 14 วัน)</p>
                            {showCalendarSent && renderCalendarGrid(selectDateSent)}
                        </div>
                    </div>
                </div>

                <motion.button
                    onClick={handleSave}
                    className="create-form-submit"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.97 }}
                >
                    สร้างหนังสือเชิญประชุม
                </motion.button>
            </motion.div>
        </>
    );
}