"use client";

export default function CoursePage({params}) {

  console.log("Course Page is being accessed!");

  return (
    <div>
      This is course page with ID: {params.courseId}
    </div>
  );
}