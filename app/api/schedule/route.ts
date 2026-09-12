import { NextResponse } from "next/server";

export async function GET() {
  const schedule = [
    {
      pair: 1,
      time: "9:00 - 10:20",
      subject: "Алгоритми та структури даних",
      group: "IT-31",
      room: "30 аудиторія",
      meetUrl: "https://meet.google.com/qwe-rtyu-iop",
      classroomUrl: "https://classroom.google.com"
    },
    {
      pair: 2,
      time: "10:10 - 11:50",
      subject: "Об'єктно-орієнтоване програмування",
      group: "IT-31",
      room: "30 аудиторія",
      meetUrl: "https://meet.google.com/asd-fghj-klz",
      classroomUrl: "https://classroom.google.com"
    },
    {
      pair: 3,
      time: "12:10 - 13:30",
      subject: "Консультації до дипломних проєктів",
      group: "IT-41",
      room: "30 аудиторія",
      meetUrl: "https://meet.google.com/new",
      classroomUrl: "https://classroom.google.com"
    }
  ];

  return NextResponse.json(schedule);
}
