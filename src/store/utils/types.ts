export type TimeDuration = {
    days: string;
    hours: string;
}

export type SprintAllocation = {
    name: string;
    allocation: TimeDuration;
}

export type Story = {
    storyId: string;
    priority: string;
    type: 'BUG' | 'IMPROVEMENT' | 'FEATURE' | 'MAINTENANCE';
    title: string;
    description: string;
    estimatedDuration: TimeDuration;
    sprints: SprintAllocation[];
    specialities: string[];
    Assignee: string;
    dependencies?: string[];
}

export type TeamMember = {
    id: string;
    name: string;
    specialities: string[];
    plannedLeaves: string[];
}

export type SprintType = 'REGULAR' | 'STRETCH';

export type Sprint = {
    name: string;
    start: string;
    end: string;
    supportMembers: string[],
    type: SprintType;
}

export type PiDetails = {
    teamName: string;
    piNumber: string;
    PiStartDate: string;
    PiEndDate: string;
    hoursPerDay: string;
    specialities: string[];
    teamMembers: TeamMember[];
    holidays: string[];
    sprints: Sprint[];
    stories: Story[];
}

export type FixedLengthArray<T, L extends number> = [T, ...T[]] & { length: L };

export type BrickUnit = {
    id: string;
    storyId?: string;
    description: string;
    title: string;
}
