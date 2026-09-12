import { NextRequest, NextResponse } from "next/server";
import { lateNoticesStore, studentsStore } from "@/lib/data";

export async function GET() {
  return NextResponse.json(lateNoticesStore);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, studentName, group, estimatedMinutes, reason } = body;

    const newNotice = {
      id: "notice-" + Date.now(),
      studentId: studentId || "unknown",
      studentName: studentName || "Студент",
      group: group || "IT-31",
      pair: "1 пара (9:00 - 10:20)",
      subject: "Алгоритми та структури даних",
      estimatedMinutes: Number(estimatedMinutes) || 15,
      reason: reason || "Затримка",
      timestamp: new Date().toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" })
    };

    lateNoticesStore.unshift(newNotice);

    // Update student state in store
    const student = studentsStore.find(
      (s) => (studentId && s.id === studentId) || (studentName && s.fullName.includes(studentName))
    );
    if (student) {
      student.attendanceState = "late";
      student.lateReason = reason;
      student.lateMinutes = Number(estimatedMinutes) || 15;
    }

    return NextResponse.json({ success: true, notice: newNotice });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const idx = lateNoticesStore.findIndex((n) => n.id === id);
      if (idx !== -1) {
        const notice = lateNoticesStore[idx];

        // Find matching student and reset late state to present
        const student = studentsStore.find(
          (s) => (notice.studentId && s.id === notice.studentId) || (notice.studentName && s.fullName === notice.studentName)
        );
        if (student && student.attendanceState === "late") {
          student.attendanceState = "present";
          student.lateReason = undefined;
          student.lateMinutes = undefined;
        }

        lateNoticesStore.splice(idx, 1);
        return NextResponse.json({ success: true });
      }
      return NextResponse.json({ error: "Повідомлення не знайдено" }, { status: 404 });
    }

    // Clear all: reset all late students to present
    for (const notice of lateNoticesStore) {
      const student = studentsStore.find(
        (s) => (notice.studentId && s.id === notice.studentId) || (notice.studentName && s.fullName === notice.studentName)
      );
      if (student && student.attendanceState === "late") {
        student.attendanceState = "present";
        student.lateReason = undefined;
        student.lateMinutes = undefined;
      }
    }
    lateNoticesStore.length = 0;
    return NextResponse.json({ success: true, message: "Всі повідомлення очищено" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
