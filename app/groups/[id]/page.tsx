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
  Check 
} from "lucide-react";
import { Student } from "@/lib/data";

export default function GroupRollCallPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await fetch("/api/attendance?group=IT-31");
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateStatus = async (studentId: string, state: "present" | "absent" | "late") => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, attendanceState: state } : s))
    );

    try {
      await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, state })
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const markAllPresent = async () => {
    for (const student of students) {
      await updateStatus(student.id, "present");
    }
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
            <span>пїЅпїЅпїЅпїЅпїЅ пїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center space-x-3">
            <span>пїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅ: пїЅпїЅпїЅпїЅпїЅ IT-31</span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
              1 пїЅпїЅпїЅпїЅ (9:00 - 10:20)
            </span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ: <strong>пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅ</strong> пїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ: пїЅпїЅпїЅпїЅпїЅ пїЅ. пїЅ.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={markAllPresent}
            className="px-4 py-2 rounded-xl bg-[#232940] hover:bg-[#2C3452] text-slate-200 border border-[#3A456B] text-sm font-semibold transition-colors"
          >
            пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ
          </button>

          <button
            onClick={() => alert("ВіпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅ CSV/Excel")}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all shadow-md shadow-blue-600/20"
          >
            <Download className="w-4 h-4" />
            <span>пїЅпїЅпїЅпїЅпїЅпїЅпїЅ</span>
          </button>
        </div>
      </div>

      {/* Save Notification Pill */}
      {savedSuccess && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 px-4 py-3 rounded-xl bg-emerald-600 text-white font-medium shadow-2xl animate-fade-in">
          <Check className="w-4 h-4" />
          <span>пїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ!</span>
        </div>
      )}

      {/* Interactive Roll-Call Table */}
      <div className="bg-[#1C2033] border border-[#2E3550] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#2C324B] bg-[#171A29]/80 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">пїЅпїЅпїЅпїЅпїЅпїЅпїЅ</th>
                <th className="py-4 px-6">пїЅпїЅпїЅпїЅпїЅ @rkepk.edu.ua</th>
                <th className="py-4 px-6 text-center">пїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅ пїЅпїЅпїЅ</th>
                <th className="py-4 px-6 text-right">пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ</th>
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
                        <p className="text-xs text-slate-400">пїЅ{idx + 1} пїЅ пїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅ</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-6 text-slate-300 font-mono text-xs">
                    {student.email}
                  </td>

                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => updateStatus(student.id, "present")}
                        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          student.attendanceState === "present"
                            ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30"
                            : "bg-[#252A40] text-slate-400 hover:text-white hover:bg-[#2F3652]"
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ</span>
                      </button>

                      <button
                        onClick={() => updateStatus(student.id, "absent")}
                        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          student.attendanceState === "absent"
                            ? "bg-red-600 text-white shadow-md shadow-red-600/30 ring-2 ring-red-500/50"
                            : "bg-[#252A40] text-slate-400 hover:text-red-400 hover:bg-[#2F3652]"
                        }`}
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>ВіпїЅпїЅпїЅпїЅпїЅпїЅ</span>
                      </button>

                      <button
                        onClick={() => updateStatus(student.id, "late")}
                        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          student.attendanceState === "late"
                            ? "bg-amber-500 text-black shadow-md shadow-amber-500/30"
                            : "bg-[#252A40] text-slate-400 hover:text-amber-400 hover:bg-[#2F3652]"
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ</span>
                      </button>
                    </div>

                    {student.attendanceState === "late" && student.lateReason && (
                      <div className="mt-2 text-center text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 py-1 px-2 rounded-md">
                        +{student.lateMinutes || 15} пїЅпїЅ: пїЅ{student.lateReason}пїЅ
                      </div>
                    )}
                  </td>

                  <td className="py-4 px-6 text-right">
                    <p className="font-bold text-white">{student.monthAttendancePercent}%</p>
                    <p className="text-xs text-emerald-400">пїЅпїЅпїЅ: {student.averageGrade}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
