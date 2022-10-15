import { Course, Day, Lesson, Schedule } from "@prisma/client";
import moment from "moment";

export const getPrevOrNextWeekId = (currentDate?: string) => {
  const startOfWeek = moment(currentDate).startOf("week");
  const prevWeekId = startOfWeek.add(-1, "week").format("yyyyMMDD");
  const nextWeekId = startOfWeek.add(1, "week").format("yyyyMMDD");

  return { prevWeekId, nextWeekId };
};

export const getWeekDates = (currentDate?: string) => {
  const firstWeekDay = moment(currentDate).startOf("week");
  return [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ].map((day, idx) => ({
    date: firstWeekDay.clone().add(idx, "day").format("yyyyMMDD"),
    day: day as Day,
  }));
};

export const filterActiveWeekLessons = (
  courses: (Course & {
    weekly_schedule: Schedule[];
  })[],
  currentDate?: string
) => {
  const weekObj = getWeekDates(currentDate);

  const activeCourses: (Course & {
    weekly_schedule: Schedule[];
  })[] = [];
  for (const course of courses) {
    const courseStartDate = moment(course.start_date.toString());
    const courseEndDate = course.end_date
      ? moment(course.end_date.toString())
      : undefined;

    const isActiveOnTheDay = (currentDate?: string) => {
      if (!currentDate) {
        return false;
      }
      const current = moment(currentDate);
      return (
        current.isSameOrAfter(courseStartDate) &&
        (courseEndDate ? current.isSameOrBefore(courseEndDate) : true)
      );
    };

    activeCourses.push({
      ...course,
      weekly_schedule: course.weekly_schedule.filter((schedule) => {
        const dayIndex = weekObj.findIndex(
          (dayObj) => dayObj.day === schedule.day
        );
        return isActiveOnTheDay(weekObj[dayIndex]?.date);
      }),
    });
  }
  return activeCourses;
};

export type LessonCard = {
  day: Day;
  schedule_id: string;
  course_id: string;
  lesson_id?: string;
  name: string;
  color: string;
  start_time: string;
  end_time: string;
  unit?: string;
  tags?: string[];
};

export const massageIntoWeeklyScheduleCards = (
  courses: (Course & {
    weekly_schedule: Schedule[];
  })[],
  lessons: Lesson[]
) => {
  const sortByTime = (daySchedules: LessonCard[]) =>
    daySchedules.sort(
      (a, b) => Number(moment(a.start_time)) - Number(moment(b.start_time))
    );

  let lessonsArray: LessonCard[] = [];
  courses.forEach((course) => {
    lessonsArray = [
      ...lessonsArray,
      ...course.weekly_schedule.map((schedule) => ({
        day: schedule.day,
        schedule_id: schedule.id,
        course_id: course.id,
        lesson_id: lessons.find((lesson) => lesson.scheduleId === schedule.id)
          ?.id,
        name: course.name,
        color: course.color,
        start_time: schedule.start_time,
        end_time: schedule.end_time,
        unit: lessons.find((lesson) => lesson.scheduleId === schedule.id)?.unit,
        tags: lessons.find((lesson) => lesson.scheduleId === schedule.id)?.tags,
      })),
    ];
  });

  const arrangeByDay = (lessonCards: LessonCard[], day: Day) => {
    return lessonCards.filter((card) => card.day === day);
  };
  return {
    monday: sortByTime(arrangeByDay(lessonsArray, "monday")),
    tuesday: sortByTime(arrangeByDay(lessonsArray, "tuesday")),
    wednesday: sortByTime(arrangeByDay(lessonsArray, "wednesday")),
    thursday: sortByTime(arrangeByDay(lessonsArray, "thursday")),
    friday: sortByTime(arrangeByDay(lessonsArray, "friday")),
  };
};
