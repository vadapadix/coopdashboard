export interface Student {
  id: string;
  fullName: string;
  email: string;
  group: string;
  attendanceState: "present" | "absent" | "late";
  lateMinutes?: number;
  lateReason?: string;
  monthAttendancePercent: number;
  averageGrade: number;
}

export interface LateNoticeItem {
  id: string;
  studentId: string;
  studentName: string;
  group: string;
  pair: string;
  subject: string;
  estimatedMinutes: number;
  reason: string;
  timestamp: string;
}

// Global in-memory state shared across Next.js API routes and pages
export const studentsStore: Student[] = [
  {
    id: "student-it31-01",
    fullName: "Трахтірібонькін Владислав",
    email: "v.traktiribonkin@rkepk.edu.ua",
    group: "IT-31",
    attendanceState: "absent",
    monthAttendancePercent: 75.0,
    averageGrade: 4.5,
  },
  {
    id: "student-it31-02",
    fullName: "Бойко Артем Андрійович",
    email: "a.boyko@rkepk.edu.ua",
    group: "IT-31",
    attendanceState: "present",
    monthAttendancePercent: 92.0,
    averageGrade: 4.8,
  },
  {
    id: "student-it31-03",
    fullName: "Ковальчук Дарина Сергіївна",
    email: "d.kovalchuk@rkepk.edu.ua",
    group: "IT-31",
    attendanceState: "present",
    monthAttendancePercent: 96.0,
    averageGrade: 5.0,
  },
  {
    id: "student-it31-04",
    fullName: "Мельник Максим Ігорович",
    email: "m.melnyk@rkepk.edu.ua",
    group: "IT-31",
    attendanceState: "present",
    monthAttendancePercent: 88.0,
    averageGrade: 4.2,
  },
  {
    id: "student-it31-05",
    fullName: "Шевченко Софія Олегівна",
    email: "s.shevchenko@rkepk.edu.ua",
    group: "IT-31",
    attendanceState: "late",
    lateMinutes: 10,
    lateReason: "Затримка транспорту",
    monthAttendancePercent: 84.0,
    averageGrade: 4.6,
  },
  {
    id: "student-it31-06",
    fullName: "Якимчук Богдан Васильович",
    email: "b.yakymchuk@rkepk.edu.ua",
    group: "IT-31",
    attendanceState: "present",
    monthAttendancePercent: 90.0,
    averageGrade: 4.4,
  }
];

export const lateNoticesStore: LateNoticeItem[] = [
  {
    id: "notice-1",
    studentId: "student-it31-05",
    studentName: "Шевченко Софія Олегівна",
    group: "IT-31",
    pair: "1 пара (9:00 - 10:20)",
    subject: "Алгоритми та структури даних",
    estimatedMinutes: 10,
    reason: "Затримка тролейбуса №7",
    timestamp: "08:55",
  }
];
