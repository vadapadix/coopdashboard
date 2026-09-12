"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Users, 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Download, 
  UserPlus, 
  Trash2, 
  Edit3, 
  Check, 
  AlertCircle,
  X
} from "lucide-react";
import { Student } from "@/lib/data";

export default function GroupRollCallPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);
  
  // Add/Edit Student modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [studentNameInput, setStudentNameInput] = useState("");
  const [studentEmailInput, setStudentEmailInput] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("IT-31");

  // Late reason modal state
  const [lateModalStudent, setLateModalStudent] = useState<Student | null>(null);
  const [lateMinutesInput, setLateMinutesInput] = useState(15);
  const [lateReasonInput, setLateReasonInput] = useState("Затримка транспорту");

  useEffect(() => {
    fetchStudents();
    const interval = setInterval(() => {
      fetch(`/api/attendance?group=${selectedGroup}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) setStudents(data);
        })
        .catch(() => {});
    }, 3000);
    return () => clearInterval(interval);
  }, [selectedGroup]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/attendance?group=${selectedGroup}`);
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (studentId: string, state: "present" | "absent" | "late", minutes?: number, reason?: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { 
        ...s, 
        attendanceState: state,
        lateMinutes: state === "late" ? (minutes !== undefined ? minutes : s.lateMinutes) : undefined,
        lateReason: state === "late" ? (reason !== undefined ? reason : s.lateReason) : undefined
      } : s))
    );

    try {
      await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          studentId, 
          state,
          minutes: state === "late" ? (minutes || null) : null,
          reason: state === "late" ? (reason || null) : null
        })
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2200);
    } catch (e) {
      console.error(e);
    }
  };

  const markAllPresent = async () => {
    for (const student of students) {
      await updateStatus(student.id, "present");
    }
  };

  const handleSaveStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentNameInput.trim() || !studentEmailInput.trim()) return;

    if (editingStudent) {
      try {
        const res = await fetch("/api/students", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingStudent.id,
            fullName: studentNameInput.trim(),
            email: studentEmailInput.trim(),
            group: selectedGroup
          })
        });
        if (res.ok) {
          fetchStudents();
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      try {
        const res = await fetch("/api/students", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: studentNameInput.trim(),
            email: studentEmailInput.trim(),
            group: selectedGroup
          })
        });
        if (res.ok) {
          fetchStudents();
        }
      } catch (e) {
        console.error(e);
      }
    }

    setIsAddModalOpen(false);
    setEditingStudent(null);
    setStudentNameInput("");
    setStudentEmailInput("");
  };

  const handleDeleteStudent = async (id: string, name: string) => {
    if (!confirm(`Ви дійсно бажаєте видалити студента ${name} зі списку групи?`)) return;
    try {
      const res = await fetch(`/api/students?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setStudents((prev) => prev.filter(s => s.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleExportCSV = () => {
    const headers = ["ПІБ", "Email", "Група", "Статус на парі", "Хвилин запізнення", "Причина", "Відвідуваність", "Середній бал"];
    const rows = students.map(s => [
      `"${s.fullName}"`,
      `"${s.email}"`,
      `"${s.group}"`,
      s.attendanceState === "present" ? "Присутній" : s.attendanceState === "absent" ? "Відсутній" : "Запізнився",
      s.lateMinutes || 0,
      `"${s.lateReason || "-"}"`,
      `${s.monthAttendancePercent}%`,
      s.averageGrade
    ]);

    const csvContent = "\uFEFF" + [headers.join(";"), ...rows.map(r => r.join(";"))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `vidomist_${selectedGroup}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/"
            className="inline-flex items-center space-x-1.5 text-sm font-medium text-slate-400 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Назад до розкладу</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center space-x-3">
            <span>Журнал пари: Група {selectedGroup}</span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
              1 пара (9:00 - 10:20)
            </span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Дисципліна: <strong>Алгоритми та структури даних</strong> • Викладач: Мопан Олександр Дмитрович
          </p>
        </div>

        {/* Group Selector & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#232940] text-slate-200 border border-[#3A456B] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="IT-31">Група IT-31</option>
            <option value="IT-32">Група IT-32</option>
            <option value="EK-21">Група EK-21</option>
            <option value="PH-11">Група PH-11</option>
          </select>

          <button
            onClick={() => {
              setEditingStudent(null);
              setStudentNameInput("");
              setStudentEmailInput("");
              setIsAddModalOpen(true);
            }}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/40 text-sm font-semibold transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>Додати студента</span>
          </button>

          <button
            onClick={markAllPresent}
            className="px-3.5 py-2 rounded-xl bg-[#232940] hover:bg-[#2C3452] text-slate-200 border border-[#3A456B] text-sm font-semibold transition-colors"
          >
            Всі присутні
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all shadow-md shadow-blue-600/20"
          >
            <Download className="w-4 h-4" />
            <span>Експорт CSV</span>
          </button>
        </div>
      </div>

      {/* Save Notification Pill */}
      {savedSuccess && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 px-4 py-3 rounded-xl bg-emerald-600 text-white font-medium shadow-2xl animate-fade-in">
          <Check className="w-4 h-4" />
          <span>Статус синхронізовано з мобільним додатком студента!</span>
        </div>
      )}

      {/* Interactive Roll-Call Table */}
      <div className="bg-[#1C2033] border border-[#2E3550] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#2C324B] bg-[#171A29]/80 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">Студент</th>
                <th className="py-4 px-6">Корпоративна пошта</th>
                <th className="py-4 px-6 text-center">Позначка відвідуваності</th>
                <th className="py-4 px-6 text-right">Відвідуваність / Бал</th>
                <th className="py-4 px-4 text-center">Дії</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262C44] text-sm">
              {students.map((student, idx) => (
                <tr
                  key={student.id}
                  className={`hover:bg-[#23283E]/60 transition-colors ${
                    student.attendanceState === "absent" ? "bg-red-950/20" : ""
                  }`}
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-700 to-slate-800 border border-slate-600 flex items-center justify-center font-bold text-xs text-white">
                        {student.fullName.split(" ").map(n => n[0]).slice(0, 2).join("")}
                      </div>
                      <div>
                        <p className="font-bold text-white">{student.fullName}</p>
                        <p className="text-xs text-slate-400">№{idx + 1} у списку групи {student.group}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-6 text-slate-300 font-mono text-xs">
                    {student.email}
                  </td>

                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center space-x-2">
                      
                      {/* Присутній */}
                      <button
                        onClick={() => updateStatus(student.id, "present")}
                        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          student.attendanceState === "present"
                            ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30 ring-1 ring-emerald-400"
                            : "bg-[#252A40] text-slate-400 hover:text-white hover:bg-[#2F3652]"
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Присутній</span>
                      </button>

                      {/* Відсутній */}
                      <button
                        onClick={() => updateStatus(student.id, "absent")}
                        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          student.attendanceState === "absent"
                            ? "bg-red-600 text-white shadow-md shadow-red-600/30 ring-2 ring-red-500/60"
                            : "bg-[#252A40] text-slate-400 hover:text-red-400 hover:bg-[#2F3652]"
                        }`}
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Відсутній</span>
                      </button>

                      {/* Запізнився */}
                      <button
                        onClick={() => {
                          setLateModalStudent(student);
                          setLateMinutesInput(student.lateMinutes || 15);
                          setLateReasonInput(student.lateReason || "Затримка транспорту");
                        }}
                        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          student.attendanceState === "late"
                            ? "bg-amber-500 text-black shadow-md shadow-amber-500/30 font-bold"
                            : "bg-[#252A40] text-slate-400 hover:text-amber-400 hover:bg-[#2F3652]"
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>Запізнився</span>
                      </button>

                    </div>

                    {student.attendanceState === "late" && student.lateReason && (
                      <div className="mt-2 text-center text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 py-1 px-2.5 rounded-md">
                        +{student.lateMinutes || 15} хв: «{student.lateReason}»
                      </div>
                    )}
                  </td>

                  <td className="py-4 px-6 text-right">
                    <p className="font-bold text-white">{student.monthAttendancePercent}%</p>
                    <p className="text-xs text-emerald-400">Бал: {student.averageGrade}</p>
                  </td>

                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <button
                        onClick={() => {
                          setEditingStudent(student);
                          setStudentNameInput(student.fullName);
                          setStudentEmailInput(student.email);
                          setIsAddModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50"
                        title="Редагувати"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(student.id, student.fullName)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-900/30"
                        title="Видалити"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Додати / Редагувати студента */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1C2033] border border-[#303855] rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#2C334D]">
              <h3 className="text-lg font-bold text-white">
                {editingStudent ? "Редагувати студента" : "Додати студента до групи"}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Прізвище, Ім'я, По батькові
                </label>
                <input
                  type="text"
                  required
                  placeholder="Трахтірібонькін Владислав"
                  value={studentNameInput}
                  onChange={(e) => setStudentNameInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#232940] border border-[#353E5C] text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Корпоративна пошта (@rkepk.edu.ua)
                </label>
                <input
                  type="email"
                  required
                  placeholder="v.traktiribonkin@rkepk.edu.ua"
                  value={studentEmailInput}
                  onChange={(e) => setStudentEmailInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#232940] border border-[#353E5C] text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#252C46] text-slate-300 text-sm font-semibold hover:bg-[#2F3858]"
                >
                  Скасувати
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-md shadow-blue-600/30"
                >
                  Зберегти
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Вказати запізнення студента */}
      {lateModalStudent && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1C2033] border border-[#303855] rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#2C334D]">
              <h3 className="text-lg font-bold text-white">
                Запізнення: {lateModalStudent.fullName}
              </h3>
              <button
                onClick={() => setLateModalStudent(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Час запізнення (хв)
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[5, 10, 15, 20, 30].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setLateMinutesInput(m)}
                      className={`py-2 rounded-lg text-xs font-bold transition-all ${
                        lateMinutesInput === m
                          ? "bg-amber-500 text-black shadow-md shadow-amber-500/30"
                          : "bg-[#252C46] text-slate-300 hover:bg-[#2F3858]"
                      }`}
                    >
                      {m} хв
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Причина запізнення
                </label>
                <input
                  type="text"
                  value={lateReasonInput}
                  onChange={(e) => setLateReasonInput(e.target.value)}
                  placeholder="Затримка маршрутного таксі / тривога"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#232940] border border-[#353E5C] text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setLateModalStudent(null)}
                  className="px-4 py-2 rounded-xl bg-[#252C46] text-slate-300 text-sm font-semibold hover:bg-[#2F3858]"
                >
                  Скасувати
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateStatus(lateModalStudent.id, "late", lateMinutesInput, lateReasonInput);
                    setLateModalStudent(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-sm font-bold shadow-md shadow-amber-500/30"
                >
                  Позначити запізнення
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
