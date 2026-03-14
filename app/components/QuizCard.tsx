export default function QuizCard({ question, onSelect, onInputChange, onToggleAgenda, selectedAgendas, inputValue }: any) {
    return (
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold mb-6">{question.title}</h2>
            
            {/* 1. กรณีเป็น Input */}
            {question.type === "input" && (
                <div className="space-y-4">
                    <input 
                        className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-gray-400"
                        placeholder={question.placeholder}
                        value={inputValue || ""}
                        onChange={(e) => onInputChange(e.target.value)}
                    />
                    <button onClick={() => onSelect(inputValue)} className="w-full p-4 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition-all">
                        ตกลง
                    </button>
                </div>
            )}

            {/* 2. กรณีเป็น Options */}
            {question.type === "options" && (
                <div className="grid grid-cols-1 gap-4">
                    {question.options?.map((opt: string) => (
                        <button key={opt} onClick={() => onSelect(opt)} className="p-4 border rounded-xl hover:bg-gray-100 text-left transition-all">
                            {opt}
                        </button>
                    ))}
                </div>
            )}

            {/* 3. กรณีเป็น Agenda */}
            {question.type === "agenda" && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {["regularAgendas", "specialAgendas"].map((type) => (
                            <div key={type}>
                                <h3 className="font-bold mb-3">{type === "regularAgendas" ? "มติธรรมดา" : "มติพิเศษ"}</h3>
                                {question[type]?.map((item: string) => (
                                    <label key={item} className="flex items-center gap-3 py-2 cursor-pointer hover:text-blue-600">
                                        <input type="checkbox" className="w-5 h-5" onChange={() => onToggleAgenda(item)} checked={selectedAgendas?.includes(item)} />
                                        {item}
                                    </label>
                                ))}
                            </div>
                        ))}
                    </div>
                    <button onClick={() => onSelect(selectedAgendas)} className="w-full p-4 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition-all">
                        ยืนยันวาระการประชุม
                    </button>
                </div>
            )}
        </div>
    );
}