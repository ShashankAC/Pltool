import { Box, Card, CardContent, colors, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { PiDetails, Sprint } from "../store/utils/types";
import { useEffect, useState } from "react";
import Chip from '@mui/material/Chip';
import dayjs from "dayjs";
import { getMemberCountInSprint, getNumberOfHolidays, getNumberOfWorkingDays, getPossibleStoryPoints, getStoriesInSprint, getTotalStoryPoints } from "../store/utils/helpers";
import { BarChart } from '@mui/x-charts';
import { Gauge } from '@mui/x-charts/Gauge';

function SprintsView() {
    const sprints = useSelector((state: {details: PiDetails}) => state?.details?.sprints);
    const stories = useSelector((state: {details: PiDetails}) => state?.details?.stories);
    const holidays = useSelector((state: { details: PiDetails}) => state?.details?.holidays);
    const members = useSelector((state: { details: PiDetails}) => state?.details?.teamMembers);
    const hoursPerDay = useSelector((state: {details: PiDetails}) => state?.details?.hoursPerDay);
    const [selectedSprintName, setSelectedSprintName] = useState<string>(sprints?.[0]?.name || '');
    const [selectedSprint, setSelectedSprint] = useState<Sprint>(sprints[0]);
    const handleSprintChange = (event: SelectChangeEvent) => {
        setSelectedSprintName(event.target.value);
    }

    useEffect(() => {
        if (sprints.length && selectedSprintName) {
            setSelectedSprint(sprints.find((sprint) => sprint.name === selectedSprintName) || sprints[0])
        }
    }, [selectedSprintName]);

    const getStoriesVsStoryPointsData = () => {
        const result: { story: string, storyPoints: number }[] = [];
        getStoriesInSprint(stories, selectedSprint).forEach((story) => {
            let storyPoints = 0;
            story.sprints.filter((sprint) => sprint.name === selectedSprint.name).forEach((sprint) => {
                storyPoints += parseFloat(sprint.allocation.days) + parseFloat(sprint.allocation.hours)/parseFloat(hoursPerDay);
            })
            const obj = { story: story.storyId, storyPoints }
            result.push(obj);
        });
        return result;
    }

    return (
    <Box sx={{ margin: '10px', width: '100%' }}>
        <Typography variant="h4" gutterBottom>Sprints</Typography>
        <Box sx={{ marginTop: '10px', width: '30%' }}>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Select Sprint</InputLabel>
                 <Select
                    labelId="select-sprint"
                    id="sprint-select"
                    value={selectedSprintName}
                    label="Select Sprint"
                    fullWidth
                    onChange={handleSprintChange}
                >
                {sprints.map((sprint) => <MenuItem value={sprint.name}>{sprint.name}</MenuItem>)}
            </Select>
            </FormControl>
        </Box>
        <Typography
            variant="h5"
            display="flex"
            flexDirection="row"
            alignItems="center"
        >
            Sprint: {selectedSprint?.name}</Typography>
        <Chip sx={{ margin: '10px'}} label={`Start Date: ${dayjs(selectedSprint.start).format('DD/MM/YYYY')}`} />
        <Chip sx={{ margin: '10px'}} label={`End Date: ${dayjs(selectedSprint.end).format('DD/MM/YYYY')}`} />
        <Chip sx={{ margin: '10px'}} label={`Number of stories: ${getStoriesInSprint(stories, selectedSprint).length}`} />
        <Chip sx={{ margin: '10px'}} label={`Number of working days: ${getNumberOfWorkingDays(dayjs(selectedSprint.start), dayjs(selectedSprint.end), holidays)}`} />
        <Chip sx={{ margin: '10px'}} label={`Number of holidays: ${getNumberOfHolidays(dayjs(selectedSprint.start), dayjs(selectedSprint.end), holidays)}`} />
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
            <Card sx={{ maxHeight: '250px', minWidth: '340px', display: 'block', padding: '10px' }}>
                <Typography sx={{textAlign: 'center'}} variant="h6" gutterBottom>Story points utilization</Typography>
                <CardContent sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <Gauge
                    width={150}
                    height={150}
                    value={getTotalStoryPoints(getStoriesInSprint(stories, selectedSprint), parseFloat(hoursPerDay))}
                    valueMin={0}
                    valueMax={getPossibleStoryPoints(dayjs(selectedSprint.start), dayjs(selectedSprint.end), holidays, members)}
                    text={({ value, valueMax }) => `${value} / ${valueMax}`}
                />
                </CardContent>
            </Card>
            <Card sx={{ maxHeight: '250px', minWidth: '340px', display: 'block', padding: '10px' }}>
                <Typography sx={{textAlign: 'center'}} variant="h6" gutterBottom>Members utilization</Typography>
                <CardContent sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <Gauge
                    width={150}
                    height={150}
                    value={getMemberCountInSprint(getStoriesInSprint(stories, selectedSprint), members)}
                    valueMin={0}
                    valueMax={members.length}
                    text={({ value, valueMax }) => `${value} / ${valueMax}`}
                />
                </CardContent>
            </Card>
        </Box>
        <Typography variant="h5" gutterBottom>Stories</Typography>
        <BarChart
            sx={{
                width: '80% !important',
                overflow: 'visible !important',
            }}
            dataset={getStoriesVsStoryPointsData()}
            layout="horizontal"
            yAxis={[{ data: getStoriesInSprint(stories, selectedSprint).map((story) => story.storyId), label: 'Stories', width: 140 }]}
            xAxis={[{ label: 'Story points' }]}
            series={[{ dataKey: 'storyPoints', label: 'Story points' }]}
            height={400}
            width={800}
        />        
    </Box>
    )
}

export default SprintsView;