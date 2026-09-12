import { NextRequest, NextResponse } from 'next/server';
import { tasksStore, ClassroomCourseTask } from '@/lib/data';

export async function GET() {
  return NextResponse.json(tasksStore);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { courseName, title, dueDate, isUrgent, classroomLink } = body;

    const newTask: ClassroomCourseTask = {
      id: 't-' + Date.now(),
      courseId: 'c-' + Date.now(),
      courseName: courseName || 'Об\'єктно-орієнтоване програмування',
      title: title || 'Нова робота',
      dueDate: dueDate || 'Завтра, до 23:59',
      submitted: 0,
      total: 27,
      isUrgent: Boolean(isUrgent),
      classroomLink: classroomLink || 'https://classroom.google.com'
    };

    tasksStore.unshift(newTask);
    return NextResponse.json({ success: true, task: newTask });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const idx = tasksStore.findIndex(t => t.id === id);
  if (idx !== -1) {
    tasksStore.splice(idx, 1);
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ error: 'Завдання не знайдено' }, { status: 404 });
}
