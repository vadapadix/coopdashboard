"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Users, 
  Calendar, 
  Clock, 
  Video, 
  BookOpen, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  Sparkles,
  RefreshCw
} from "lucide-react";
import { studentsStore, lateNoticesStore } from "@/lib/data";

export default function DashboardPage() {
  const [students, setStudents] = useState(studentsStore);
  const [notices, setNotices] = useState(lateNoticesStore);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      const res1 = await fetch("/api/attendance");
      if (res1.ok) {
        const data = await res1.json();
        setStudents(data);
      }
      const res2 = await fetch("/api/late-notice");
      if (res2.ok) {
        const data2 = await res2.json();
        setNotices(data2);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 2500);
    return () => clearInterval(interval);
  }, []);

  const presentCount = students.filter(s => s.attendanceState === "present").length;
  const absentCount = students.filter(s => s.attendanceState === "absent").length;
  const lateCount = students.filter(s => s.attendanceState === "late").length;
  const attendanceRate = Math.round((presentCount / (students.length || 1)) * 100);

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#1C2136] via-[#1E2540] to-[#171A29] p-6 rounded-2xl border border-[#303855] shadow-xl">
        <div>
          <div className="flex items-center space-x-2 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Панель викладача • РКЕПФК</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Доброго ранку, Олександре Дмитровичу!</h1>
          <p className="text-slate-400 text-sm mt-1">
            Сьогодні: <strong>Понеділок</strong> • Чисельник • 3 пари за розкладом
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={refreshData}
            disabled={isRefreshing}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#252C46] hover:bg-[#2F3858] text-slate-200 border border-[#38436B] transition-colors text-sm font-medium"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-blue-400" : ""}`} />
            <span>Оновити дані</span>
          </button>
          
          <Link
            href="/groups/it-31"
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-lg shadow-blue-600/30 text-sm"
          >
            <Users className="w-4 h-4" />
            <span>Перекличка IT-31</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Live Late Student Alert Box */}
      {notices.length > 0 && (
        <div className="bg-[#351C26] border border-[#6B2A3E] p-5 rounded-2xl shadow-lg">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-xl bg-red-500/20 text-red-400 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Отримано сповіщення «Я запізнюсь» з мобільного додатку myCOOP
                </h3>
                <div className="mt-2 space-y-2">
                  {notices.map((n) => (
                    <div key={n.id} className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-200 bg-[#2C151F] p-2 rounded-lg border border-[#52212F]">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-white">{n.studentName} ({n.group}):</span>
                        <span className="px-2 py-0.5 rounded-md bg-red-950 text-red-300 font-medium text-xs border border-red-800/40">
                          +{n.estimatedMinutes} хв
                        </span>
                        <span className="text-slate-300">«{n.reason}»</span>
                        <span className="text-xs text-slate-400">({n.timestamp})</span>
                      </div>
                      <button
                        onClick={async () => {
                          setNotices(prev => prev.filter(item => item.id !== n.id));
                          setStudents(prev => prev.map(s => (s.id === n.studentId || s.fullName === n.studentName) ? {
                            ...s,
                            attendanceState: 'present',
                            lateReason: undefined,
                            lateMinutes: undefined
                          } : s));
                          await fetch(`/api/late-notice?id=${n.id}`, { method: "DELETE" });
                          await refreshData();
                        }}
                        className="text-slate-400 hover:text-red-300 text-xs px-2 py-0.5 rounded bg-red-950/40 hover:bg-red-900/50 transition-colors"
                        title="Позначити прочитаним"
                      >
                        ✕ Прочитано
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={async () => {
                  setNotices([]);
                  setStudents(prev => prev.map(s => s.attendanceState === 'late' ? {
                    ...s,
                    attendanceState: 'present',
                    lateReason: undefined,
                    lateMinutes: undefined
                  } : s));
                  await fetch("/api/late-notice", { method: "DELETE" });
                  await refreshData();
                }}
                className="text-xs text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg border border-[#6B2A3E] bg-[#2C151F] hover:bg-[#3D1D2B] transition-colors"
              >
                Очистити всі
              </button>
              <Link
                href="/groups/it-31"
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-900/40 hover:bg-red-900/60 text-red-200 border border-red-700/40 transition-colors"
              >
                Перейти в журнал
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Active Lesson & Attendance Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Lesson Card (2 cols) */}
        <div className="lg:col-span-2 bg-[#1C2033] border border-[#2E3550] rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between pb-4 border-b border-[#2A314A]">
            <div className="flex items-center space-x-2.5">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-ping" />
                Триває зараз
              </span>
              <span className="text-sm font-semibold text-slate-300">1 пара • 9:00 - 10:20</span>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-[#272D45] text-blue-300 border border-blue-500/20">
              30 аудиторія
            </span>
          </div>

          <div className="py-6">
            <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Дисципліна</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              Алгоритми та структури даних
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Група: <strong className="text-slate-200">IT-31</strong> • Спеціальність: 121 Інженерія програмного забезпечення
            </p>
          </div>

          {/* Quick Class Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <a
              href="https://meet.google.com/new"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-[#204E9A] hover:bg-[#285DB4] text-white font-semibold text-sm transition-all shadow-md shadow-blue-900/30"
            >
              <Video className="w-4 h-4" />
              <span>Google Meet</span>
            </a>

            <a
              href="https://classroom.google.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-[#283049] hover:bg-[#323C5B] text-slate-100 font-semibold text-sm border border-[#3A4568] transition-all"
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Classroom</span>
            </a>

            <Link
              href="/groups/it-31"
              className="flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-md shadow-blue-600/20"
            >
              <Users className="w-4 h-4" />
              <span>Відкрити перекличку</span>
            </Link>
          </div>
        </div>

        {/* Attendance Summary Widget (1 col) */}
        <div className="bg-[#1C2033] border border-[#2E3550] rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center justify-between">
              <span>Відвідуваність групи IT-31</span>
              <span className="text-xs font-semibold text-slate-400">Сьогодні</span>
            </h3>

            {/* Main Percentage */}
            <div className="mt-6 flex items-baseline space-x-2">
              <span className="text-5xl font-black text-white">{attendanceRate}%</span>
              <span className="text-sm font-medium text-emerald-400">присутніх</span>
            </div>

            {/* Status Breakdown */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between text-sm py-2 px-3 rounded-lg bg-[#242A42]">
                <span className="flex items-center space-x-2 text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Присутні</span>
                </span>
                <span className="font-bold text-white">{presentCount}</span>
              </div>

              <div className="flex items-center justify-between text-sm py-2 px-3 rounded-lg bg-[#242A42]">
                <span className="flex items-center space-x-2 text-slate-200">
                  <XCircle className="w-4 h-4 text-red-400" />
                  <span>Відсутні</span>
                </span>
                <span className="font-bold text-red-400">{absentCount}</span>
              </div>

              <div className="flex items-center justify-between text-sm py-2 px-3 rounded-lg bg-[#242A42]">
                <span className="flex items-center space-x-2 text-slate-200">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Запізнюються</span>
                </span>
                <span className="font-bold text-amber-400">{lateCount}</span>
              </div>
            </div>
          </div>

          <Link
            href="/groups/it-31"
            className="w-full mt-6 py-2.5 text-center text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors block border-t border-slate-700/50 pt-4"
          >
            Детальний список студентів →
          </Link>
        </div>
      </div>

      {/* Schedule for the Day */}
      <div className="bg-[#1C2033] border border-[#2E3550] rounded-2xl p-6 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-blue-400" />
          <span>Розклад пар викладача на сьогодні</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-blue-600/10 border border-blue-500/30">
            <span className="text-xs font-bold text-blue-400">1 пара • 9:00 - 10:20 (Зараз)</span>
            <h4 className="font-bold text-white mt-1">Алгоритми та структури даних</h4>
            <p className="text-xs text-slate-400 mt-1">Група IT-31 • 30 аудиторія</p>
          </div>

          <div className="p-4 rounded-xl bg-[#23283E] border border-[#323955]">
            <span className="text-xs font-bold text-slate-400">2 пара • 10:10 - 11:50</span>
            <h4 className="font-bold text-white mt-1">Об'єктно-орієнтоване програмування</h4>
            <p className="text-xs text-slate-400 mt-1">Група IT-31 • 30 аудиторія</p>
          </div>

          <div className="p-4 rounded-xl bg-[#23283E] border border-[#323955]">
            <span className="text-xs font-bold text-slate-400">3 пара • 12:10 - 13:30</span>
            <h4 className="font-bold text-white mt-1">Консультації до курсових</h4>
            <p className="text-xs text-slate-400 mt-1">Група IT-41 • 30 аудиторія</p>
          </div>
        </div>
      </div>

    </div>
  );
}
