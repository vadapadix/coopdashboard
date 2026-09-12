'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  ArrowLeft, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  FileText, 
  AlertCircle, 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Save, 
  Layers 
} from 'lucide-react';

interface Task {
  id: string;
  courseId: string;
  courseName: string;
  title: string;
  dueDate: string;
  submitted: number;
  total: number;
  isUrgent: boolean;
  classroomLink: string;
}

export default function ClassroomPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [formData, setFormData] = useState({
    courseName: "Об'єктно-орієнтоване програмування",
    title: '',
    dueDate: 'Сьогодні, до 18:00',
    isUrgent: false,
    classroomLink: 'https://classroom.google.com',
    submitted: 0,
    total: 27
  });

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/tasks');
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const openCreateModal = () => {
    setEditingTask(null);
    setFormData({
      courseName: "Об'єктно-орієнтоване програмування",
      title: '',
      dueDate: 'Сьогодні, до 18:00',
      isUrgent: false,
      classroomLink: 'https://classroom.google.com',
      submitted: 0,
      total: 27
    });
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setFormData({
      courseName: task.courseName,
      title: task.title,
      dueDate: task.dueDate,
      isUrgent: task.isUrgent,
      classroomLink: task.classroomLink,
      submitted: task.submitted,
      total: task.total
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      if (editingTask) {
        const res = await fetch('/api/tasks', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingTask.id,
            ...formData
          })
        });
        if (res.ok) {
          await fetchTasks();
          setIsModalOpen(false);
        }
      } else {
        const res = await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (res.ok) {
          await fetchTasks();
          setIsModalOpen(false);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Ви впевнені, що бажаєте видалити це завдання?')) return;
    try {
      const res = await fetch(`/api/tasks?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchTasks();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const groupedCourses = tasks.reduce((acc: Record<string, Task[]>, task) => {
    const cName = task.courseName || 'Загальні завдання';
    if (!acc[cName]) acc[cName] = [];
    acc[cName].push(task);
    return acc;
  }, {});

  const totalTasks = tasks.length;
  const urgentCount = tasks.filter(t => t.isUrgent).length;
  const avgSubmittedPercent = totalTasks > 0
    ? Math.round(tasks.reduce((sum, t) => sum + (t.submitted / (t.total || 1)), 0) / totalTasks * 100)
    : 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Bar */}
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
            Курси та завдання групи <strong>IT-31</strong>, що транслюються в мобільний додаток <strong>myCOOP</strong>
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={openCreateModal}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-md shadow-blue-600/30"
          >
            <Plus className="w-4 h-4" />
            <span>Створити завдання</span>
          </button>

          <a
            href="https://classroom.google.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#23283E] hover:bg-[#2F3654] text-slate-200 border border-[#3A4266] font-medium text-sm transition-all"
          >
            <span>Google Classroom</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#1C2033] border border-[#2E3550] p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Всього завдань</p>
            <p className="text-2xl font-bold text-white mt-1">{totalTasks}</p>
          </div>
          <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#1C2033] border border-[#2E3550] p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Термінових робіт</p>
            <p className="text-2xl font-bold text-red-400 mt-1">{urgentCount}</p>
          </div>
          <div className="p-3 rounded-lg bg-red-500/10 text-red-400">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#1C2033] border border-[#2E3550] p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Середній % здачі</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">{avgSubmittedPercent}%</p>
          </div>
          <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Grouped Course Sections */}
      {loading ? (
        <div className="p-12 text-center text-slate-400">Завантаження завдань...</div>
      ) : Object.keys(groupedCourses).length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-[#1C2033] rounded-2xl border border-[#2E3550]">
          Завдань ще немає. Натисніть «Створити завдання», щоб додати першу роботу.
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedCourses).map(([courseName, courseTasks]) => (
            <div
              key={courseName}
              className="bg-[#1C2033] border border-[#2E3550] rounded-2xl p-6 shadow-xl space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2C334D] pb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{courseName}</h3>
                  <p className="text-xs text-slate-400">Група IT-31 • {courseTasks.length} робіт</p>
                </div>
                <a
                  href="https://classroom.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center space-x-1"
                >
                  <span>Перейти до курсу</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="space-y-3">
                {courseTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-xl bg-[#23283E] border border-[#313752] hover:border-[#3D4566] transition-all"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center space-x-2.5">
                        <span className="font-bold text-white text-base">{task.title}</span>
                        {task.isUrgent && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white tracking-wider animate-pulse">
                            Т Е Р М І Н О В О
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-slate-400">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>Дедлайн: {task.dueDate}</span>
                        </span>
                        <span>•</span>
                        <a
                          href={task.classroomLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-400 hover:underline flex items-center space-x-1"
                        >
                          <span>Посилання на Classroom</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      {/* Submitted Progress */}
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <span className="text-xs text-slate-400 block">Здано</span>
                          <span className="font-bold text-sm text-white">
                            {task.submitted} / {task.total}
                          </span>
                        </div>
                        <div className="w-24 bg-slate-700 h-2.5 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-400 h-full rounded-full"
                            style={{ width: `${Math.min(100, Math.round((task.submitted / (task.total || 1)) * 100))}%` }}
                          />
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center space-x-2 border-l border-slate-700/60 pl-4">
                        <button
                          onClick={() => openEditModal(task)}
                          className="p-2 rounded-lg bg-[#2D3450] hover:bg-[#384164] text-slate-200 transition-colors"
                          title="Редагувати завдання"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(task.id)}
                          className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                          title="Видалити завдання"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Create or Edit Task */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#1C2033] border border-[#343C5C] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#2C334D] pb-3">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <FileText className="w-5 h-5 text-blue-400" />
                <span>{editingTask ? 'Редагувати завдання' : 'Створити нове завдання'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Назва курсу / предмета</label>
                <select
                  value={formData.courseName}
                  onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#23283E] border border-[#353D5D] text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Об'єктно-орієнтоване програмування">Об'єктно-орієнтоване програмування</option>
                  <option value="Алгоритми та структури даних">Алгоритми та структури даних</option>
                  <option value="Бази даних">Бази даних</option>
                  <option value="Комп'ютерні мережі">Комп'ютерні мережі</option>
                  <option value="Операційні системи">Операційні системи</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Тема / Назва завдання</label>
                <input
                  type="text"
                  required
                  placeholder="напр., Практична робота №38: Шаблони Fluent Builder"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#23283E] border border-[#353D5D] text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Термін виконання (дедлайн)</label>
                <input
                  type="text"
                  required
                  placeholder="напр., Сьогодні, до 8:30 або 25.05.2026"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#23283E] border border-[#353D5D] text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Здано робіт</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.submitted}
                    onChange={(e) => setFormData({ ...formData, submitted: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#23283E] border border-[#353D5D] text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Всього студентів</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.total}
                    onChange={(e) => setFormData({ ...formData, total: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#23283E] border border-[#353D5D] text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Посилання в Google Classroom</label>
                <input
                  type="url"
                  value={formData.classroomLink}
                  onChange={(e) => setFormData({ ...formData, classroomLink: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#23283E] border border-[#353D5D] text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="isUrgentCheck"
                  checked={formData.isUrgent}
                  onChange={(e) => setFormData({ ...formData, isUrgent: e.target.checked })}
                  className="w-4 h-4 rounded text-red-600 bg-[#23283E] border-[#353D5D] focus:ring-red-500"
                />
                <label htmlFor="isUrgentCheck" className="text-sm text-red-300 font-medium cursor-pointer">
                  Позначити як ТЕРМІНОВО (червоний бейдж у студентському додатку)
                </label>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[#2C334D]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#2A314C] hover:bg-[#343D5E] text-slate-300 text-sm font-medium transition-colors"
                >
                  Скасувати
                </button>
                <button
                  type="submit"
                  className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all shadow-md shadow-blue-600/30"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingTask ? 'Зберегти зміни' : 'Створити завдання'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
