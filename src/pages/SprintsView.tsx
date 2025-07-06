import { Box, Card, CardContent, colors, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";
import { PieChart } from '@mui/x-charts/PieChart';
import { useSelector } from "react-redux";
import { PiDetails, Sprint } from "../store/utils/types";
import { useEffect, useState } from "react";
import Chip from '@mui/material/Chip';
import dayjs from "dayjs";
import { getMemberCountInSprint, getMembersInSprint, getNumberOfHolidays, getNumberOfWorkingDays, getPossibleStoryPoints, getPrioritiesCount, getPrioritiesInSprint, getStoriesInSprint, getStoryPointsOfMembersInSprint, getTotalStoryPoints } from "../store/utils/helpers";
import { BarChart } from '@mui/x-charts';
import { Gauge } from '@mui/x-charts/Gauge';
import { STORYTYPES } from "../store/utils/constants";
import GlowBricks from "../components/GlowBricks";

function SprintsView() {
    const sprints = useSelector((state: {details: PiDetails}) => state?.details?.sprints);
    const stories = useSelector((state: {details: PiDetails}) => state?.details?.stories);
    const holidays = useSelector((state: { details: PiDetails}) => state?.details?.holidays);
    const members = useSelector((state: { details: PiDetails}) => state?.details?.teamMembers);
    const hoursPerDay = useSelector((state: {details: PiDetails}) => state?.details?.hoursPerDay);
    const [storiesBreakUp, setStoriesBreakup] = useState<any[]>([]);
    const [selectedSprintName, setSelectedSprintName] = useState<string>(sprints?.[0]?.name || '');
    const [selectedSprint, setSelectedSprint] = useState<Sprint>(sprints[0]);
    const [storiesInSprint, setStoriesInSprint] = useState(getStoriesInSprint(stories, selectedSprint));
    const [membersInSprint, setMembersInSprint] = useState(getMembersInSprint(storiesInSprint, members));

    useEffect(() => {
        setStoriesInSprint(getStoriesInSprint(stories, selectedSprint));
    }, [selectedSprint]);

    useEffect(() => {
        setMembersInSprint(getMembersInSprint(storiesInSprint, members));
    }, [storiesInSprint])

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
            if (storiesInSprint.length) {
                for (let i = 0; i < storiesInSprint.length; i++) {
                    if (storiesInSprint[i].type === STORYTYPES.BUG) {
                        storiesBreakUpList[0].value += 1;
                    } else if (storiesInSprint[i].type === STORYTYPES.FEATURE) {
                        storiesBreakUpList[1].value += 1;
                    } else if (storiesInSprint[i].type === STORYTYPES.IMPROVEMENT) {
                        storiesBreakUpList[2].value += 1;
                    } else if (storiesInSprint[i].type === STORYTYPES.MAINTENANCE) {
                        storiesBreakUpList[3].value += 1;
                    }
                }
            }
        setStoriesBreakup(storiesBreakUpList);
    }, [storiesInSprint]);

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
        storiesInSprint.forEach((story) => {
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
    <Box sx={{ margin: '10px', width: '90%' }}>
        <Typography variant="h4" gutterBottom>Sprints</Typography>
        <Box sx={{ marginTop: '10px', width: '30%', margin: '5px' }}>
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
            Sprint: {selectedSprint?.name}
        </Typography>
        <Chip sx={{ margin: '10px'}} label={`Start Date: ${dayjs(selectedSprint.start).format('DD/MM/YYYY')}`} />
        <Chip sx={{ margin: '10px'}} label={`End Date: ${dayjs(selectedSprint.end).format('DD/MM/YYYY')}`} />
        <Chip sx={{ margin: '10px'}} label={`Number of stories: ${storiesInSprint.length}`} />
        <Chip sx={{ margin: '10px'}} label={`Number of working days: ${getNumberOfWorkingDays(dayjs(selectedSprint.start), dayjs(selectedSprint.end), holidays)}`} />
        <Chip sx={{ margin: '10px'}} label={`Number of holidays: ${getNumberOfHolidays(dayjs(selectedSprint.start), dayjs(selectedSprint.end), holidays)}`} />
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
            <Card sx={{ maxHeight: '250px', minWidth: '340px', display: 'block', padding: '10px' }}>
                <Typography sx={{textAlign: 'center'}} variant="h6" gutterBottom>Story points utilization</Typography>
                <CardContent sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <Gauge
                    width={150}
                    height={150}
                    value={getTotalStoryPoints(storiesInSprint, parseFloat(hoursPerDay))}
                    valueMin={0}
                    valueMax={getPossibleStoryPoints(dayjs(selectedSprint.start), dayjs(selectedSprint.end), holidays, members)}
                    text={({ value, valueMax }) => `${value} / ${valueMax}`}
                />
                </CardContent>
            </Card>
            <Card sx={{ minHeight: '250px', maxWidth: '340px', display: 'block', padding: '10px' }}>
                <Typography sx={{textAlign: 'center'}} variant="h6" gutterBottom>Stories Type breakup</Typography>
                <CardContent sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                    <PieChart
                        series={[
                            {
                                data: storiesBreakUp,
                                innerRadius: 20,
                                outerRadius: 40,
                                paddingAngle: 3,
                                cornerRadius: 3,
                                startAngle: 0,
                                endAngle: 360,
                                cx: '50%',
                                cy: '50%',
                            }
                        ]}
                    />
                </CardContent>
            </Card>
            <Card sx={{ minHeight: '250px', maxWidth: '340px', display: 'block', padding: '10px' }}>
                <Typography sx={{textAlign: 'center'}} variant="h6" gutterBottom>Stories Priority breakup</Typography>
                <CardContent sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                        <BarChart
                            sx={{
                                width: '40% !important',
                                overflow: 'visible !important',
                            }}
                            xAxis={[
                                {
                                id: 'barCategories',
                                data: getPrioritiesInSprint(storiesInSprint),
                                scaleType: 'band',
                                },
                            ]}
                            series={[
                                {
                                data: getPrioritiesCount(storiesInSprint),
                                },
                            ]}
                            height={150}
                            width={320}
                        />
                </CardContent>
            </Card>
            <Card sx={{ maxHeight: '250px', minWidth: '340px', display: 'block', padding: '10px' }}>
                <Typography sx={{textAlign: 'center'}} variant="h6" gutterBottom>Members utilization</Typography>
                <CardContent sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <Gauge
                    width={150}
                    height={150}
                    value={getMemberCountInSprint(storiesInSprint, selectedSprint)}
                    valueMin={0}
                    valueMax={members.length}
                    text={({ value, valueMax }) => `${value} / ${valueMax}`}
                />
                </CardContent>
            </Card>
        </Box>
        <Typography variant="h5" gutterBottom>Stories</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'left' }}>
            <BarChart
                sx={{
                    width: '40% !important',
                    overflow: 'visible !important',
                }}
                dataset={getStoriesVsStoryPointsData()}
                layout="horizontal"
                yAxis={[{ data: storiesInSprint.map((story) => story.storyId), label: 'Stories', width: 140 }]}
                xAxis={[{ label: 'Story points' }]}
                series={[{ dataKey: 'storyPoints', label: 'Story points' }]}
                height={400}
                width={600}
            />
            <BarChart
                sx={{
                    width: '40% !important',
                    overflow: 'visible !important',
                }}
                dataset={getStoryPointsOfMembersInSprint(storiesInSprint, membersInSprint, parseFloat(hoursPerDay))}
                layout="horizontal"
                yAxis={[{ data: membersInSprint.map((member) => member.name), label: 'Members', width: 140 }]}
                xAxis={[{ label: 'Story points' }]}
                series={[{ dataKey: 'storyPoints', label: 'Story points' }]}
                height={400}
                width={600}
            />
        </Box>
        <Typography>Story-Member Relations</Typography>
        <GlowBricks
            sources={membersInSprint.map((member) => {
                return {
                    id: member.id,
                    title: member.name,
                    description: member.name
                }
            })}
            targets={storiesInSprint.map((story) => {
                return {
                    id: story.Assignee,
                    storyId: story.storyId,
                    title: story.title,
                    description: story.description
                }
            })}
            brickMinWidth="150px"
            brickHeight="30px"
            brickWidth="fit-content"
            brickBorderColor="blue" 
        />
    </Box>
    )
}

export default SprintsView;