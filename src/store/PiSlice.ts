import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { PiDetails, Sprint, Story, TeamMember } from "./utils/types";

export interface PiState {
    details: PiDetails
}

const initialState: PiState = {
    details: {
        teamName: '',
        piNumber: '',
        teamSize: '',
        holidays: [] as string[],
        teamMembers: [] as TeamMember[],
        sprints: [] as Sprint[],
        specialities: [] as string[],
        stories: [] as Story[],
    } as PiDetails
}

function removeHelper<T>(all: Array<T>, toBeRemoved: Array<T>) {
    console.log('all = ', all, 'toBeRemoved = ', toBeRemoved);
     toBeRemoved.forEach(element => {
            const index = all.indexOf(element);
            if (index !== -1) {
                all.splice(index, 1);
            }
        });
        return all;
    }

export const PiSlice = createSlice({
    name: 'PiPlan',
    initialState,
    reducers: {
        setTeamName: (state, action: PayloadAction<string>) => {
            state.details.teamName = action.payload;
        },
        setPiNumber: (state, action: PayloadAction<string>) => {
            state.details.piNumber = action.payload;
        },
        setTeamSize: (state, action: PayloadAction<string>) => {
            state.details.teamSize = action.payload;
        },
        setStartDate: (state, action: PayloadAction<string>) => {
            state.details.PiStartDate = action.payload;
        },
        setEndDate: (state, action: PayloadAction<string>) => {
            state.details.PiEndDate = action.payload;
        },
        setHoursPerDay: (state, action: PayloadAction<string>) => {
            state.details.hoursPerDay = action.payload;
        },
        addSpecialitiesToStore: (state, action: PayloadAction<string>) => {
             if (state.details.specialities?.length) {
                state.details.specialities.push(action.payload);
            } else {
                state.details.specialities = [action.payload];
            }
        },
        deleteSpecialityFromStore: (state, action: PayloadAction<string>) => {
            const toBeRemoved = action.payload;
            state.details.specialities = removeHelper(state.details.specialities, [toBeRemoved]);

        },
        addTeamMembers: (state, action: PayloadAction<TeamMember>) => {
            if (state.details.teamMembers?.length) {
                state.details.teamMembers.push(action.payload);
            } else {
                state.details.teamMembers = [action.payload];
            }
        },
        setTeamMembers: (state, action: PayloadAction<TeamMember[]>) => {
            state.details.teamMembers = action.payload;
        },
        removeTeamMember: (state, action: PayloadAction<string>) => {
            const toBeRemoved = action.payload;
            state.details.teamMembers.splice(state.details.teamMembers.indexOf(state.details.teamMembers.filter((member) => member.id === toBeRemoved)[0], 1));
        },
        setHolidays: (state, action: PayloadAction<string[]>) => {
            state.details.holidays = action.payload;
        },
        deleteHoliday: (state, action: PayloadAction<string>) => {
            const index = state.details.holidays.indexOf(action.payload);
            if (index >= 0) {
                state.details.holidays.splice(index, 1);
            }
        },
        addSprintToStore: (state, action: PayloadAction<Sprint>) => {
            state.details.sprints.push(action.payload);
        },
        setSprints: (state, action: PayloadAction<Sprint[]>) => {
            state.details.sprints = action.payload;
        },
        deleteSprint: (state, action: PayloadAction<string>) => {
            state.details.sprints.splice(state.details.sprints.indexOf(state.details.sprints.filter((sprint) => sprint.name === action.payload)[0]), 1)
        },
        removeSprintFromStore: (state, action: PayloadAction<Sprint>) => {
            const sprints = state.details.sprints;
            state.details.sprints = sprints.filter((sprint) => sprint.name !== action.payload.name);
        },
        addStoryToStore: (state, action: PayloadAction<Story>) => {
            state.details.stories.push(action.payload);
        },
        setStories: (state, action: PayloadAction<Story[]>) => {
            state.details.stories = action.payload;
        },
        setPIdetails: (state, action: PayloadAction<PiDetails>) => {
            state.details = action.payload;
        }
    }
});

export const {
    setTeamName,
    setPiNumber,
    setStartDate,
    setEndDate,
    setHoursPerDay,
    setHolidays,
    setTeamSize,
    addSpecialitiesToStore,
    deleteSpecialityFromStore,
    addTeamMembers,
    setTeamMembers,
    removeTeamMember,
    addSprintToStore,
    setSprints,
    deleteSprint,
    removeSprintFromStore,
    addStoryToStore,
    setStories,
    deleteHoliday,
    setPIdetails
} = PiSlice.actions;

export const getTeamDetails = (state: RootState) => state.details;

export default PiSlice;