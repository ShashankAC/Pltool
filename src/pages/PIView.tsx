import { Alert, Box, Typography } from "@mui/material";
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { useSelector } from "react-redux";
import Chip from '@mui/material/Chip';
import { PiDetails, Sprint, Story, TeamMember } from "../store/utils/types";
import dayjs from "dayjs";
import { getNoOfWorkingDays, getNumberOfHolidays, getPossibleStoryPoints, getTotalStoryPoints } from "../store/utils/helpers";
import { useEffect, useState } from "react";
import { STORYTYPES } from "../store/utils/constants";

function PIView() {
    const teamMembers: TeamMember[] = useSelector((state: {details : PiDetails}) => state?.details?.teamMembers);
    const startDate = useSelector((state: {details : PiDetails}) => state?.details?.PiStartDate);
    const endDate = useSelector((state: {details : PiDetails}) => state?.details?.PiEndDate);
    const sprints = useSelector((state: {details : PiDetails}) =>state?.details?.sprints);
    const stories = useSelector((state: {details : PiDetails}) =>state?.details?.stories);
    const hoursPerDay = useSelector((state: {details : PiDetails}) => state?.details?.hoursPerDay);
    const holidays = useSelector((state: {details : PiDetails}) => state?.details?.holidays);
    const [storiesBreakUp, setStoriesBreakup] = useState<any[]>([]);
    const [totalStoryPoints, setTotalStoryPoints] = useState<number>(0);
    const [possibleStoryPoints, setPossibleStoryPoints] = useState<number>(0);

    useEffect(() => {
        let storiesBreakUpList: Array<any> = [
            {
                id: 0,
                value: 0,
                label: 'BUG'
            },
            {
                id: 1,
                value: 0,
                label: 'FEATURE'
            },
            {
                id: 2,
                value: 0,
                label: 'IMPROVEMENT'
            },
            {
                id: 3,
                value: 0,
                label: 'MAINTENANCE'
            },

        ];
        if (stories.length) {
            for (let i = 0; i < stories.length; i++) {
                if (stories[i].type === STORYTYPES.BUG) {
                    storiesBreakUpList[0].value += 1;
                } else if (stories[i].type === STORYTYPES.FEATURE) {
                    storiesBreakUpList[1].value += 1;
                } else if (stories[i].type === STORYTYPES.IMPROVEMENT) {
                    storiesBreakUpList[2].value += 1;
                } else if (stories[i].type === STORYTYPES.MAINTENANCE) {
                    storiesBreakUpList[3].value += 1;
                }
            }
        }
        setStoriesBreakup(storiesBreakUpList);
    }, [stories]);

    useEffect(() => {
        setPossibleStoryPoints(getPossibleStoryPoints(dayjs(startDate), dayjs(endDate), holidays, teamMembers));
    }, [startDate, endDate, holidays, teamMembers]);

    useEffect(() => {
        setTotalStoryPoints(getTotalStoryPoints(stories, parseFloat(hoursPerDay)))
    }, [stories, hoursPerDay])

    const prepareSprintwiseStorytypeBreakup = (stories: Story[], sprints: Sprint[]) => {
        const result: {data: Array<number>, datakey: string, label: string}[] = [];
        for (let i = 0; i < sprints.length; i++) {
            result.push({data: [], datakey: '', label: ''});
        }
        result.forEach((r) => {
            for (let i = 0; i < Object.keys(STORYTYPES).length; i++) {
                r.data.push(0);
            }
        });
        for (let i = 0; i < sprints.length; i++) {
            for (let j = 0; j < stories.length; j++) {
                for (let k = 0; k < Object.keys(STORYTYPES).length; k++) {
                    if (stories[j].type === Object.keys(STORYTYPES)[k] && stories[j].sprints.find((spr) => spr.name === sprints[i].name)) {
                        result[k].data[i] +=1;
                        result[k] = {...result[k], datakey: Object.keys(STORYTYPES)[k], label: Object.keys(STORYTYPES)[k]}
                    }
                }
            }
        }
        for (let k = 0; k < Object.keys(STORYTYPES).length; k++) {

        }
        return result;
    }

    return (
        <Box sx={{ margin: '10px 0px 10px 10px', width: '98%' }}>
            <Typography variant="h4" gutterBottom>
                PI Overview
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
                <Chip sx={{ margin: '10px'}} label={`Start date: ${dayjs(startDate).format('DD/MM/YYYY')}`} />
                <Chip sx={{ margin: '10px'}} label={`End date: ${dayjs(endDate).format('DD/MM/YYYY')}`} />
                <Chip sx={{ margin: '10px'}} label={`Team size: ${teamMembers?.length || 0}`} />
                <Chip sx={{ margin: '10px'}} label={`Number of stories: ${stories?.length || 0}`} />
                <Chip sx={{ margin: '10px'}} label={`Working hours per day: ${hoursPerDay || 0}`} />
                <Chip sx={{ margin: '10px'}} label={`Number of working days: ${getNoOfWorkingDays(dayjs(startDate), dayjs(endDate), holidays)}`} />
                <Chip sx={{ margin: '10px'}} label={`Number of holidays: ${getNumberOfHolidays(dayjs(startDate), dayjs(endDate), holidays)}`} />
                <Chip sx={{ margin: '10px'}} label={`Story points required: ${totalStoryPoints}`} />
                <Chip sx={{ margin: '10px'}} label={`Story points capacity: ${possibleStoryPoints}`}/>
            </Box>
            {totalStoryPoints > possibleStoryPoints ? (
                <Alert severity="warning" variant="filled"> Story points capacity exceeded. One or more team members maybe overloaded.</Alert>
            ): null}
            <Typography variant="h5">PI Stories per Sprint</Typography>
                 <BarChart
                    xAxis={[{ data: sprints.map((sprint) => sprint.name) }]}
                    yAxis={[{ label: 'No of stories' }]}
                    series={prepareSprintwiseStorytypeBreakup(stories, sprints)}
                    height={300}
                    
                />

            <Typography variant="h5">PI Breakup By Story Type</Typography>
            <PieChart
                title="Breakup By Story Type"
                series={[
                    {
                        data: storiesBreakUp,
                    },
                ]}
                width={200}
                height={200}
            />
        </Box>
    )
}

export default PIView;