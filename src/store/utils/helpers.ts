import { PickerValue } from "@mui/x-date-pickers/internals";
import { Sprint, Story, TeamMember, TimeDuration } from "./types";
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

export function getStoriesInSprint(stories: Story[], sprint: Sprint): Story[] {
    return stories.filter((story) => story.sprints.some((s) => s.name === sprint.name));
}

function uniqueStringsArray(array: Array<string>): string[] {
    const result: string[] = [];
    array.forEach((item) => {
        if (result.indexOf(item) === -1) {
            result.push(item);
        }
    })
    return result;
} 

export function getMemberCountInSprint(stories: Story[], sprint: Sprint): number {
    let memberIds: string[] = [];
    stories.forEach((story) => {
        memberIds.push(story.Assignee);
    });
    memberIds = memberIds.concat(sprint.supportMembers);
    
    return uniqueStringsArray(memberIds).length;
}

export function getNumberOfWorkingDays(startDate: Dayjs, endDate: Dayjs, holidays: Array<string>): number {
    let result = 0;
    for (let i = Object.assign(startDate); i.isBefore(endDate.add(1, 'day')); i = i.add(1, 'day')) {
        if (!isHoliday(i.toISOString(), holidays) && !isWeekend(i)) {
            result++;
        }
    }
    return result;
}

export function getMembersInSprint(storiesInTheSprint: Story[], members: TeamMember[]): TeamMember[] {
    const memberIds: string[] = [];
    let teamMembers: TeamMember[] = [];
    storiesInTheSprint.forEach((story) => {
        memberIds.push(story.Assignee);   
    });
    teamMembers = members.filter((member) => memberIds.includes(member.id));
    return teamMembers;
}

export function getStoryPointsOfStory(story: Story, hoursPerDay: number): number {
    return parseFloat(story.estimatedDuration.days) + parseFloat(story.estimatedDuration.hours)/hoursPerDay;
}

export function getMemberNameFromId(id: string, members: TeamMember[]): string {
    return members.find((member) => member.id === id)?.name || 'Not a member';
}

export function getStoryPointsOfMembersInSprint(storiesInSprint: Story[], membersInSprint: TeamMember[], hoursPerDay: number) {
    let result: { member: string, storyPoints: number }[] = [];
    membersInSprint.forEach((member) => {
        result.push({member: member.id, storyPoints: 0 });
    });
    storiesInSprint.forEach((story) => {
        if (result.filter((r) => r.member === story.Assignee).length) {
            result[result.indexOf(result.filter((r) => r.member === story.Assignee)[0])].storyPoints += getStoryPointsOfStory(story, hoursPerDay)
        }
    })
    result.forEach((r) => r.member = getMemberNameFromId(r.member, membersInSprint));
    return result;
}

import { blue, red, green, amber, indigo, teal, deepPurple, orange } from '@mui/material/colors';



export function generateColors(n: number): string[] {
  const muiColors = [blue, red, green, amber, indigo, teal, deepPurple, orange];
  const shades = ['300', '400', '500', '600', '700', '800', '900', 'A100', 'A200', 'A400', 'A700'];
  const colors: string[] = [];

  for (let i = 0; i < n; i++) {
    const palette = muiColors[i % muiColors.length];
    const shade = shades[i % shades.length];
    const color = palette[shade as keyof typeof palette];

    // Fallback in case the shade is missing
    colors.push(color || palette[500]);
  }
  return colors;
}

import Ajv from "ajv";

const ajv = new Ajv();

export const isValidJson = (jsonStr: string) => {
  try {
    const parsed = JSON.parse(jsonStr);
    const validate = ajv.compile({ type: "object" }); // Basic shape
    const isValid = validate(parsed);
    return { isValid, parsed };
  } catch {
    return { isValid: false };
  }
};

export const formatJson = (input: string) => {
  try {
    return JSON.stringify(JSON.parse(input), null, 2); // Pretty-print
  } catch {
    return input;
  }
};

export const getPrioritiesInSprint = (stories: Story[]) => {
    let priorities: Array<string> = [];
    stories.forEach((story) => {
        priorities.push(story.priority);
    });
    return uniqueStringsArray(priorities);
}

function countPriorities(priorities: Array<string>): Array<number> {
    let count = 1;
    const counts = [];
    console.log('priorities = ', priorities);
    for (let i = 0; i < priorities.length; i++) {
        if ( i > 0 && priorities[i] !== priorities[i-1]) {
            counts.push(count);
            count = 1;
        } else if (i > 0) {
            count++;
        }
    }
    counts.push(count);
    return counts;
}

export const getPrioritiesCount = (stories: Story[]): Array<number> => {
    let allPriorities: Array<string> = [];
    stories.forEach((story) => {
        allPriorities.push(story.priority);
    });
    console.log('check = ', countPriorities(allPriorities));
    return countPriorities(allPriorities);
}
