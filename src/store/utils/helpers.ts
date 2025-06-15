import { PickerValue } from "@mui/x-date-pickers/internals";
import { Story, TeamMember, TimeDuration } from "./types";
import dayjs, { Dayjs } from "dayjs";

export function getNoOfWeekendDays(startDate: Dayjs, endDate: Dayjs): number {
    let count = 0;
    for (let i = startDate; i.isBefore(endDate.add(1, 'day')); i = i.add(1, 'day')) {
        if (i.day() === 6 || i.day() === 0) {
            count++;
        } 
    }
    return count;
}

export function getTotalStoryPoints(stories: Story[], hoursPerDay: number): number {
    let count = 0;
    stories.forEach((story) => {
        count += parseFloat(story.estimatedDuration.days) + parseFloat(story.estimatedDuration.hours)/hoursPerDay;
    });
    return count;
}

export function getPossibleStoryPoints(startDate: Dayjs, endDate: Dayjs, holidays: Array<string>, members: TeamMember[]) {
    let possibleStoryPoints = 0;
    members.forEach((member) => {
        possibleStoryPoints += getNoOfWorkingDaysOfMember(startDate, endDate, member, holidays);
    });
    return possibleStoryPoints;
}

export function getNoOfWorkingDays(startDate: Dayjs, endDate: Dayjs, holidays: Array<string>): number {
    let count = 0;
    for (let i = startDate; i.isBefore(endDate.add(1, 'day')); i = i.add(1, 'day')) {
        if (!isHoliday(i.toISOString(), holidays) && !isWeekend(i)) {
            count++;
        }
    }
    return count;
}

export function getNumberOfLeaves(startDate: Dayjs, endDate: Dayjs, members: TeamMember[]): number {
    let leavesCount = 0;
    const leaves = members.flatMap((member) => member.plannedLeaves);
    for (let i = startDate; i.isBefore(endDate.add(1, 'day')); i = i.add(1, 'day')) {
        if (leaves.find((leave) => dayjs(leave).isSame(i))) {
            leavesCount++;
        }
    }
    return leavesCount;
}

export function getNumberOfHolidays(startDate: Dayjs, endDate: Dayjs, holidays: Array<string>): number {
    let holidaysCount = 0;
    const allHolidays = holidays;
    if (holidays?.length) {
        for (let i = startDate; i.isBefore(endDate.add(1, 'day')); i = i.add(1, 'day')) {
            if (allHolidays?.find((holiday) => dayjs(holiday).isSame(i))) {
                holidaysCount++;
            }
        }
    }
    return holidaysCount;
}

export function getNoOfWorkingDaysOfMember(startDate: Dayjs, endDate: Dayjs, member: TeamMember, holidays: Array<string>): number {
    let workingDays = 0;
    for (let i = startDate; i.isBefore(endDate.add(1, 'day')); i = i.add(1, 'day')) {
        if (!isPlannedLeave(member, i) && !isWeekend(i) && !isHoliday(i.toISOString(), holidays)) {
            workingDays++;
        }
    }
    return workingDays;

}

export function isHoliday(event: PickerValue | string, holidays: Array<string>):boolean {
    const result  = holidays?.filter((holiday) => dayjs(holiday).isSame(dayjs(event)));
    if (result?.length) {
        return true;
    } else {
        return false;
    }
}

export function isPlannedLeave(member: TeamMember, date: Dayjs): boolean {
    let result = false;
    const plannedLeaves = member.plannedLeaves.map((leave) => dayjs(leave));
    plannedLeaves.every((leave) => {
        if (leave.isSame(date)) {
            result = true;
            return false;
        }
        return true;
    });
    return result;
}

export function getWeekends(startDate: string, endDate: string): string[] {
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  const weekends = [];

  let current = start;

  while (current.isBefore(end) || current.isSame(end)) {
    if (current.day() === 6 || current.day() === 0) { // 6 represents Saturday
      weekends.push(current.toISOString());
    }
    current = current.add(1, 'day'); // Move to the next day
  }
  return weekends;
}

export function isWeekend(date: Dayjs): boolean {
    if (date.day() === 6 || date.day() === 0) {
        return true;
    } 
    return false;
}

export function getMemberEffortForStories(member: TeamMember, stories: Story[]): TimeDuration {
    const days = stories.map((story) => parseInt(story.estimatedDuration.days)).reduce((a, b) => a + b);
    const hours = stories.map((story) => parseInt(story.estimatedDuration.hours)).reduce((a, b) => a + b);
    return { days: days.toString(), hours: hours.toString() };
}

export function getMemberAvailableEffortInDays(startDate: Dayjs, endDate: Dayjs, member: TeamMember, holidays: Array<string>): number {
    let availableEffort = 0;
    for (let i = startDate; i.isSame(endDate); i = i.add(1, 'day')) {
        if (!isPlannedLeave(member, i) && !isHoliday(i, holidays) && !isWeekend(i)) {
            availableEffort++;
        }
    }
    return availableEffort;
}


