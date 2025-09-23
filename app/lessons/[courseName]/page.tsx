"use client";

import { useParams } from "next/navigation";
import LessonHub from "@/components/LessonHub";

export default function LessonsPage() {
  const params = useParams();
  const courseName = params.courseName as string;

  return <LessonHub courseName={courseName} />;
}