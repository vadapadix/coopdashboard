import { NextRequest, NextResponse } from 'next/server';
import { studentsStore, lateNoticesStore } from '@/lib/data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  const group = searchParams.get('group');

  if (email) {
    const student = studentsStore.find(
      (s) => s.email.toLowerCase() === email.toLowerCase()
    );

    if (student) {
      return NextResponse.json({
        isMarkedAbsent: student.attendanceState === 'absent',
        currentSubject: 'Алгоритми та структури даних',
        currentPair: '1 пара',
        monthAttendancePercent: student.monthAttendancePercent,
        topRankPercent: 80,
        averageGrade: student.averageGrade,
        state: student.attendanceState,
        lateReason: student.lateReason || null,
        lateMinutes: student.lateMinutes || null,
        lastUpdated: new Date().toISOString()
      });
    }

    return NextResponse.json({
      isMarkedAbsent: true,
      currentSubject: 'Алгоритми та структури даних',
      currentPair: '1 пара',
      monthAttendancePercent: 75.0,
      topRankPercent: 80,
      averageGrade: 4.5,
      state: 'absent',
      lastUpdated: new Date().toISOString()
    });
  }

  const list = group ? studentsStore.filter(s => s.group === group) : studentsStore;
  return NextResponse.json(list);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, email, state, reason, minutes } = body;

    const student = studentsStore.find(
      (s) => (studentId && s.id === studentId) || (email && s.email.toLowerCase() === email.toLowerCase())
    );

    if (student) {
      student.attendanceState = state;

      if (state === 'present' || state === 'absent') {
        student.lateReason = undefined;
        student.lateMinutes = undefined;

        // Remove any existing late notice for this student
        const noticeIdx = lateNoticesStore.findIndex(
          (n) => n.studentId === student.id || n.studentName === student.fullName
        );
        if (noticeIdx !== -1) {
          lateNoticesStore.splice(noticeIdx, 1);
        }
      } else if (state === 'late') {
        student.lateReason = reason || student.lateReason || 'Запізнення';
        student.lateMinutes = minutes !== undefined ? Number(minutes) : (student.lateMinutes || 15);

        const lateReason = student.lateReason || 'Запізнення';
        const lateMinutes = student.lateMinutes || 15;

        // Upsert notice in lateNoticesStore
        const existingNotice = lateNoticesStore.find(
          (n) => n.studentId === student.id || n.studentName === student.fullName
        );
        if (existingNotice) {
          existingNotice.reason = lateReason;
          existingNotice.estimatedMinutes = lateMinutes;
        } else {
          lateNoticesStore.unshift({
            id: 'notice-' + Date.now(),
            studentId: student.id,
            studentName: student.fullName,
            group: student.group,
            pair: '1 пара (9:00 - 10:20)',
            subject: 'Алгоритми та структури даних',
            estimatedMinutes: lateMinutes,
            reason: lateReason,
            timestamp: new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })
          });
        }
      }

      return NextResponse.json({ success: true, student });
    }

    return NextResponse.json({ error: 'Студента не знайдено' }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
