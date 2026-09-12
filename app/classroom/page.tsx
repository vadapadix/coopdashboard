"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  BookOpen, 
  ArrowLeft, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  FileText,
  AlertCircle
} from "lucide-react";

export default function ClassroomPage() {
  const courses = [
    {
      id: "course-1",
      title: "Алгоритми та структури даних",
      section: "Група IT-31 (2025/2026 н.р.)",
      classroomLink: "https://classroom.google.com",
      tasks: [
        {
          id: "t-1",
          title: "Лабораторна робота №5: Двійкові дерева пошуку",
          dueDate: "18.09.2026, 23:59",
          submitted: 19,
          total: 27,
          isUrgent: false
        },
        {
          id: "t-2",
          title: "Практична робота №4: Хеш-таблиці та колізії",
          dueDate: "11.09.2026",
          submitted: 26,
          total: 27,
          isUrgent: false
        }
      ]
    },
    {
      id: "course-2",
      title: "Об'єктно-орієнтоване програмування",
      section: "Група IT-31 (2025/2026 н.р.)",
      classroomLink: "https://classroom.google.com",
      tasks: [
        {
          id: "t-3",
          title: "Практична №37",
          dueDate: "Сьогодні, до 8:30",
          submitted: 14,
          total: 27,
          isUrgent: true
        },
        {
          id: "t-4",
          title: "Практична №36: Патерни проєктування",
          dueDate: "08.09.2026",
          submitted: 27,
          total: 27,
          isUrgent: false
        }
      ]
    },
    {
      id: "course-3",
      title: "Бази даних",
      section: "Група IT-31 (2025/2026 н.р.)",
      classroomLink: "https://classroom.google.com",
      tasks: [
        {
          id: "t-5",
          title: "Курсова робота",
          dueDate: "25.05.2026, до 8:30 • 4 місяці",
          submitted: 6,
          total: 27,
          isUrgent: false
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/"
            className="inline-flex items-center space-x-1.5 text-sm font-medium text-slate-400 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Назад до дашборду</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center space-x-3">
            <BookOpen className="w-7 h-7 text-emerald-400" />
            <span>Синхронізація Google Classroom</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Курси та завдання, які транслюються в мобільний додаток студентів <strong>myCOOP</strong>
          </p>
        </div>

        <a
          href="https://classroom.google.com"
          target="_blank"
          rel="noreferrer"
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all shadow-md shadow-emerald-600/20"
        >
          <span>Відкрити веб-Classroom</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      <div className="space-y-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-[#1C2033] border border-[#2E3550] rounded-2xl p-6 shadow-xl space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2C334D] pb-4">
              <div>
                <h3 className="text-xl font-bold text-white">{course.title}</h3>
                <p className="text-xs text-slate-400">{course.section}</p>
              </div>
              <a
                href={course.classroomLink}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center space-x-1"
              >
                <span>Перейти до курсу</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="space-y-3">
              {course.tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#23283E] border border-[#313752]"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white text-base">{task.title}</span>
                      {task.isUrgent && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white tracking-wider">
                          Т Е Р М І Н О В О
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-3 text-xs text-slate-400">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Дедлайн: {task.dueDate}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Здано робіт</span>
                      <span className="font-bold text-sm text-white">
                        {task.submitted} / {task.total}
                      </span>
                    </div>
                    <div className="w-20 bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-400 h-full rounded-full"
                        style={{ width: `${(task.submitted / task.total) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
