import { NextRequest, NextResponse } from 'next/server';
import { studentsStore, Student } from '@/lib/data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const group = searchParams.get('group');
  const list = group ? studentsStore.filter(s => s.group === group) : studentsStore;
  return NextResponse.json(list);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, group } = body;

    if (!fullName || !email) {
      return NextResponse.json({ error: 'ПІБ та email обов\'язкові' }, { status: 400 });
    }

    const newStudent: Student = {
      id: 'student-' + Date.now(),
      fullName,
      email: email.toLowerCase(),
      group: group || 'IT-31',
      attendanceState: 'present',
      monthAttendancePercent: 100.0,
      averageGrade: 5.0,
    };

    studentsStore.push(newStudent);
    return NextResponse.json({ success: true, student: newStudent });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, fullName, email, group } = body;

    const idx = studentsStore.findIndex(s => s.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: 'Студента не знайдено' }, { status: 404 });
    }

    if (fullName) studentsStore[idx].fullName = fullName;
    if (email) studentsStore[idx].email = email.toLowerCase();
    if (group) studentsStore[idx].group = group;

    return NextResponse.json({ success: true, student: studentsStore[idx] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const idx = studentsStore.findIndex(s => s.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: 'Студента не знайдено' }, { status: 404 });
    }

    studentsStore.splice(idx, 1);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
