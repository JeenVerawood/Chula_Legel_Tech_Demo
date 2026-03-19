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
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CreateMeetingForm() {
    const options1 = ["บจก. (บริษัท จำกัด)", "บมจ. (บริษัท มหาชน จำกัด)"];
    const options2 = ["ประชุมสามัญผู้ถือหุ้น", "ประชุมวิสามัญผู้ถือหุ้น", "ประชุมคณะกรรมการ"];
    const options3 = ["สามัญ", "วิสามัญ"];

    const [role, setRole] = useState<"shareholder" | "director" | "">("");
    const [selected1, setSelected1] = useState("");
    const [selected2, setSelected2] = useState("");
    const [callerName, setCallerName] = useState("");
    const [subject, setSubject] = useState("");
    const [meetingNo, setMeetingNo] = useState("");
    const [meetingSubType, setMeetingSubType] = useState("");
    const [attendees, setAttendees] = useState("");
    const [location, setLocation] = useState("");
    const [meetingDate, setMeetingDate] = useState("");
    const [meetingDateSent, setMeetingDateSent] = useState("");
    const [agendas, setAgendas] = useState([""]);
    const [agendaText, setAgendaText] = useState(""); // director only
    const [signerName, setSignerName] = useState("");
    const [signerPosition, setSignerPosition] = useState("");

    const [isOpen1, setIsOpen1] = useState(false);
    const [isOpen2, setIsOpen2] = useState(false);
    const [isOpen3, setIsOpen3] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [showCalendarSent, setShowCalendarSent] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

    const sigCanvas = useRef<SignatureCanvas | null>(null);
    const [isSigned, setIsSigned] = useState(false);

    const daysInMonth = (year: number, month: number) =>
        new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) =>
        new Date(year, month, 1).getDay();
    useEffect(() => {
        const draft = localStorage.getItem("meeting_draft");
        if (!draft) return;
        const savedData = JSON.parse(draft);

        // บันทึก role
        if (savedData.role) setRole(savedData.role);

        if (savedData.role === "director") {
            // กรรมการ flow: d1 = ผู้เรียก, d2 = วาระ (text)
            if (savedData["d1"]) setCallerName(savedData["d1"]);
            if (savedData["d2"]) setAgendaText(savedData["d2"]);
            setSelected2("ประชุมคณะกรรมการ"); // ล็อคประเภทให้อัตโนมัติ
        } else {
            // ผู้ถือหุ้น flow: key 1, 2, 3 ตาม questions.ts
            if (savedData["1"]) setSelected2(savedData["1"]); // ประเภทประชุม
            if (savedData["2"]) setCallerName(savedData["2"]); // ชื่อผู้เรียก
            if (savedData["3"]) setAgendas(savedData["3"]);    // วาระ (array)
        }
    }, []);
    const changeMonth = (offset: number) => {
        setCurrentMonth(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1)
        );
    };

    const selectDate = (day: number) => {
        const selected = new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            day
        );
        setMeetingDate(
            selected.toLocaleDateString("th-TH", {
                year: "numeric",
                month: "long",
                day: "numeric",
            })
        );
        setShowCalendar(false);
        setErrors((prev) => ({ ...prev, date: false }));
    };

    const selectDateSent = (day: number) => {
        const selected = new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            day
        );
        setMeetingDateSent(
            selected.toLocaleDateString("th-TH", {
                year: "numeric",
                month: "long",
                day: "numeric",
            })
        );
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
        setIsOpen1(false);
        setIsOpen2(false);
        setIsOpen3(false);
        setShowCalendar(false);
        setShowCalendarSent(false);
    };

    const handleSave = () => {
        const isSigEmpty = sigCanvas.current ? sigCanvas.current.isEmpty() : true;
        const isDirector = role === "director";
        const newErrors: { [key: string]: boolean } = {
            companyType: !selected1,
            meetingType: isDirector ? false : !selected2,   // กรรมการ ไม่ต้องเลือกประเภท
            caller: !callerName.trim(),
            subject: !subject.trim(),
            meetingNo: !meetingNo.trim(),
            meetingSubType: !meetingSubType,
            attendees: !attendees.trim(),
            location: !location.trim(),
            date: !meetingDate,
            dateSent: !meetingDateSent,
            signer: !signerName.trim(),
            position: !signerPosition.trim(),
            agendas: isDirector ? !agendaText.trim() : agendas.some((a) => !a.trim()),
            signature: isSigEmpty,
        };
        setErrors(newErrors);
        const hasError = Object.values(newErrors).some((v) => v);
        if (hasError) return;

        // ============================================================
        // TODO [BACKEND]: Wire up meeting creation API here.
        //
        // 1. Build the payload:
        //    import { CreateMeetingPayload } from "../types";
        //    const payload: CreateMeetingPayload = {
        //      companyType: selected1 as CompanyType,
        //      meetingType: selected2 as MeetingType,
        //      meetingSubType: meetingSubType as MeetingSubType,
        //      callerName,
        //      subject,
        //      meetingNo,
        //      attendees,
        //      location,
        //      meetingDate,
        //      dateSent: meetingDateSent,
        //      agendas,
        //      signerName,
        //      signerPosition,
        //      signatureDataUrl: sigCanvas.current?.toDataURL("image/png") ?? "",
        //    };
        //
        // 2. POST to /api/meetings:
        //    const res = await fetch("/api/meetings", {
        //      method: "POST",
        //      headers: { "Content-Type": "application/json" },
        //      body: JSON.stringify(payload),
        //    });
        //    const result = await res.json();
        //
        // 3. Handle response:
        //    if (result.success) router.push(`/summary`);
        //    else setErrors({ ...errors, submit: true });
        //
        // See: HANDOFF.md § "API Routes to Implement"
        // See: app/types/meeting.ts for all type definitions
        // ============================================================
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
                    {currentMonth.toLocaleDateString("th-TH", {
                        month: "long",
                        year: "numeric",
                    })}
                </span>
                <button onClick={() => changeMonth(1)} className="create-form-calendar-nav">
                    <ChevronRight size={18} />
                </button>
            </div>
            <div className="create-form-calendar-grid">
                {["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"].map((d) => (
                    <span key={d} className="create-form-calendar-day-label">
                        {d}
                    </span>
                ))}
                {Array.from({
                    length: firstDayOfMonth(
                        currentMonth.getFullYear(),
                        currentMonth.getMonth()
                    ),
                }).map((_, i) => (
                    <div key={`e-${i}`} />
                ))}
                {Array.from({
                    length: daysInMonth(
                        currentMonth.getFullYear(),
                        currentMonth.getMonth()
                    ),
                }).map((_, i) => (
                    <button
                        key={i}
                        onClick={() => onSelectDay(i + 1)}
                        className="create-form-calendar-day"
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </motion.div>
    );

    return (
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
                {/* 1. Company type */}
                <div className="create-form-field">
                    <div className="create-form-field-header">
                        <label>ชื่อบริษัท</label>
                    </div>
                    <div className="create-form-select-wrapper">
                        <div className="create-form-select">
                              <h1>Legal Tech จำกัด.</h1>
                        </div>

                    </div>
                </div>

                {/* 2. Meeting type */}
                <div className="create-form-field">
                    <div className="create-form-field-header">
                        <label>ประเภทการประชุม</label>
                        {errors.meetingType && (
                            <span className="create-form-error">
                                <AlertCircle size={12} /> จำเป็น
                            </span>
                        )}
                    </div>
                    <div className="create-form-select-wrapper">
                        {role === "director" ? (
                            /* กรรมการ — ไม่มีประเภท แสดง dash */
                            <div className="create-form-input bg-gray-50 text-gray-400 pointer-events-none select-none">
                                -
                            </div>
                        ) : (
                            <button
                                onClick={() => { closeAllDropdowns(); setIsOpen2(!isOpen2); }}
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
                    <div className="create-form-field-header">
                        <label>ผู้เรียกประชุม</label>
                    </div>
                    <div className="create-form-input bg-gray-50 text-gray-700">
                        {callerName || <span className="text-gray-400">ไม่มีข้อมูลจากหน้า Quiz</span>}
                    </div>
                </div>  

                {/* 4. Subject */}
                <div className="create-form-field">
                    <div className="create-form-field-header">
                        <label>เรื่อง</label>
                        {errors.subject && (
                            <span className="create-form-error">
                                <AlertCircle size={12} /> จำเป็น
                            </span>
                        )}
                    </div>
                    <input
                        type="text"
                        value={subject}
                        placeholder="หนังสือนัดประชุม..."
                        onChange={(e) => {
                            setSubject(e.target.value);
                            setErrors({ ...errors, subject: false });
                        }}
                        className={`create-form-input ${errors.subject ? "create-form-input-error" : ""}`}
                    />
                </div>

                {/* 5. Attendees */}
                <div className="create-form-field">
                    <div className="create-form-field-header">
                        <label>เรียน</label>
                        {errors.attendees && (
                            <span className="create-form-error">
                                <AlertCircle size={12} /> จำเป็น
                            </span>
                        )}
                    </div>
                    <input
                        type="text"
                        value={attendees}
                        placeholder="ผู้ถือหุ้น..."
                        onChange={(e) => {
                            setAttendees(e.target.value);
                            setErrors({ ...errors, attendees: false });
                        }}
                        className={`create-form-input ${errors.attendees ? "create-form-input-error" : ""}`}
                    />
                </div>

                {/* 6. Meeting number + subtype */}
                <div className="create-form-field">
                    <div className="create-form-field-header">
                        <label>ครั้งที่</label>
                        {(errors.meetingNo || errors.meetingSubType) && (
                            <span className="create-form-error">
                                <AlertCircle size={12} /> จำเป็น
                            </span>
                        )}
                    </div>
                    <div className="create-form-row">
                        <input
                            type="text"
                            value={meetingNo}
                            placeholder="1/2569"
                            onChange={(e) => {
                                setMeetingNo(e.target.value);
                                setErrors({ ...errors, meetingNo: false });
                            }}
                            className={`create-form-input create-form-input-short ${errors.meetingNo ? "create-form-input-error" : ""}`}
                        />
                        <div className="create-form-select-wrapper create-form-flex-1">
                            <button
                                onClick={() => { closeAllDropdowns(); setIsOpen3(!isOpen3); }}
                                className={`create-form-select ${errors.meetingSubType ? "create-form-select-error" : ""}`}
                            >
                                <span className={meetingSubType ? "" : "create-form-placeholder"}>
                                    {meetingSubType || "เลือกประเภท..."}
                                </span>
                                <ChevronDown size={18} />
                            </button>
                            {isOpen3 && (
                                <motion.div
                                    className="create-form-dropdown"
                                    initial={{ opacity: 0, y: -4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    {options3.map((opt) => (
                                        <button
                                            key={opt}
                                            onClick={() => {
                                                setMeetingSubType(opt);
                                                setIsOpen3(false);
                                                setErrors({ ...errors, meetingSubType: false });
                                            }}
                                            className="create-form-dropdown-item"
                                        >
                                            {opt}
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
                        {errors.date && (
                            <span className="create-form-error">
                                <AlertCircle size={12} /> จำเป็น
                            </span>
                        )}
                    </div>
                    <div className="create-form-select-wrapper">
                        <button
                            onClick={() => { closeAllDropdowns(); setShowCalendar(!showCalendar); }}
                            className={`create-form-select ${errors.date ? "create-form-select-error" : ""}`}
                        >
                            <span className={meetingDate ? "" : "create-form-placeholder"}>
                                {meetingDate || "กดเพื่อเลือกวันที่..."}
                            </span>
                            <CalendarIcon size={18} />
                        </button>
                        {showCalendar && renderCalendarGrid(selectDate)}
                    </div>
                </div>

                {/* 8. Location */}
                <div className="create-form-field">
                    <div className="create-form-field-header">
                        <label>สถานที่</label>
                        {errors.location && (
                            <span className="create-form-error">
                                <AlertCircle size={12} /> จำเป็น
                            </span>
                        )}
                    </div>
                    <input
                        type="text"
                        value={location}
                        placeholder="ระบุสถานที่ประชุม..."
                        onChange={(e) => {
                            setLocation(e.target.value);
                            setErrors({ ...errors, location: false });
                        }}
                        className={`create-form-input ${errors.location ? "create-form-input-error" : ""}`}
                    />
                </div>

                {/* 9. Agendas */}
                <div className="create-form-field">
                    <div className="create-form-field-header">
                        <label>วาระการประชุม</label>
                    </div>
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
                        {errors.signer && (
                            <span className="create-form-error">
                                <AlertCircle size={12} /> จำเป็น
                            </span>
                        )}
                    </div>
                    <input
                        type="text"
                        value={signerName}
                        placeholder="ชื่อ-นามสกุล ของผู้ลงนาม..."
                        onChange={(e) => {
                            setSignerName(e.target.value);
                            setErrors({ ...errors, signer: false });
                        }}
                        className={`create-form-input ${errors.signer ? "create-form-input-error" : ""}`}
                    />
                </div>

                {/* 11. Position */}
                <div className="create-form-field">
                    <div className="create-form-field-header">
                        <label>ตำแหน่ง</label>
                        {errors.position && (
                            <span className="create-form-error">
                                <AlertCircle size={12} /> จำเป็น
                            </span>
                        )}
                    </div>
                    <input
                        type="text"
                        value={signerPosition}
                        placeholder="เช่น กรรมการผู้มีอำนาจลงนาม..."
                        onChange={(e) => {
                            setSignerPosition(e.target.value);
                            setErrors({ ...errors, position: false });
                        }}
                        className={`create-form-input ${errors.position ? "create-form-input-error" : ""}`}
                    />
                </div>

                {/* 12. Digital signature */}
                <div className="create-form-field">
                    <div className="create-form-field-header">
                        <label className="create-form-label-with-icon">
                            <PenTool size={16} />
                            ลงลายมือชื่อ
                        </label>
                        <button onClick={clearSignature} className="create-form-clear-sig">
                            <RotateCcw size={12} />
                            ล้างลายเส้น
                        </button>
                    </div>
                    <div
                        className={`create-form-signature ${errors.signature ? "create-form-signature-error" : ""}`}
                    >
                        <SignatureCanvas
                            ref={sigCanvas}
                            penColor="black"
                            onBegin={() => {
                                setIsSigned(true);
                                setErrors({ ...errors, signature: false });
                            }}
                            canvasProps={{ className: "create-form-signature-canvas" }}
                        />
                        {!isSigned && (
                            <div className="create-form-signature-placeholder">
                                ใช้นิ้ววาดลายเซ็นที่นี่
                            </div>
                        )}
                    </div>
                </div>

                {/* 13. Date sent */}
                <div className="create-form-field">
                    <div className="create-form-field-header">
                        <label>วันที่ส่งนัดหมาย</label>
                        {errors.dateSent && (
                            <span className="create-form-error">
                                <AlertCircle size={12} /> จำเป็น
                            </span>
                        )}
                    </div>
                    <div className="create-form-select-wrapper">
                        <button
                            onClick={() => { closeAllDropdowns(); setShowCalendarSent(!showCalendarSent); }}
                            className={`create-form-select ${errors.dateSent ? "create-form-select-error" : ""}`}
                        >
                            <span className={meetingDateSent ? "" : "create-form-placeholder"}>
                                {meetingDateSent || "เลือกวันที่ส่ง..."}
                            </span>
                            <CalendarIcon size={18} />
                        </button>
                        <p className="create-form-hint">
                            * ต้องส่งไม่น้อยกว่า 7 วัน ก่อนวันประชุม (ถ้ามติพิเศษ ไม่น้อยกว่า 14 วัน)
                        </p>
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
    );
}