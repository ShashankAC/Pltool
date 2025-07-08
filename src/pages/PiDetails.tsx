import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Chip, Grid, Tab, Tabs } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Collapse from '@mui/material/Collapse';
import { Add, ArrowDownward, ArrowRight, Delete, Save } from '@mui/icons-material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { addSpecialitiesToStore, addSprintToStore, addStoryToStore, deleteHoliday, deleteSpecialityFromStore, deleteSprint, PiState, removeTeamMember, setEndDate, setHolidays, setHoursPerDay, setPiNumber, setStartDate, setTeamName } from '../store/PiSlice';
import dayjs, { Dayjs } from "dayjs";
import { Sprint, SprintAllocation, SprintType, TeamMember } from '../store/utils/types';
import { useDispatch, useSelector } from 'react-redux';
import { addTeamMembers } from '../store/PiSlice';
import { CustomTabPanel, a11yProps } from '../components/CustomTabPanel';
import { getMemberNameFromId, getNoOfWorkingDays, isHoliday, isWeekend } from '../store/utils/helpers';

function PiDetails() {
    const [member, setMember] = useState<TeamMember>();
    const [sprint, setSprint] = useState<Sprint>();
    const [holidaysState, setHolidaysState] = useState<string[]>([]);
    const [openMembers, setOpenMembers] = useState(false);
    const [openSprints, setOpenSprints] = useState(false);
    const [addStory, setAddStory] = useState(false);
    const [sprintAllocationDays, setSprintAllocationDays] = useState<string>('');
    const [sprintAllocationHours, setSprintAllocationHours] = useState<string>('');
    const [memberName, setMemberName] = useState<string>('');
    const [addSpeciality, setAddSpeciality] = useState<string>('');
    const [memberSpecialities, setMemberSpecialities] = useState<string[]>([]);
    const [addTeamMembersError, setAddTeamMembersError] = useState('');
    const [plannedLeaves, setPlannedLeaves] = useState<string[]>([]);
    const [storyId, setStoryId] = useState<string>();
    const [storyType, setStoryType] = useState<'BUG' | 'IMPROVEMENT' | 'FEATURE'>('FEATURE');
    const [storyPriority, setStoryPriority] = useState<string>('');
    const [storyTitle, setStoryTitle] = useState<string>('');
    const [sprintName, setSprintName] = useState<string>('');
    const [sprintType, setSprintType] = useState<SprintType>('REGULAR');
    const [sprintSupportMembers, setSprintSupportMembers] = useState<string[]>([]);
    const [sprintStartDate, setSprintStartDate] = useState<Dayjs>();
    const [sprintEndDate, setSprintEndDate] = useState<Dayjs>();
    const [storyDurationDays, setStoryDurationDays] = useState<string>('');
    const [storyDurationHours, setStoryDurationHours] = useState<string>('');
    const [storyDescription, setStoryDescription] = useState<string>();
    const [sprintAllocations, setSprintAllocations] = useState<SprintAllocation[]>([] as SprintAllocation[]);
    const [storySpecialities, setStorySpecialities] = useState<string[]>([]);
    const [storyAssignee, setStoryAssignee] = useState<string>('');
    const [storyDependencies, setStoryDependencies] = useState<Array<string>>([]);
    const [tabValue, setTabValue] = React.useState(0);
    const [holidaysError, setHolidaysError] = useState('');
    const [plannedLeavesError, setPlannedLeavesError] = useState('');
    const [sprintDateError, setSprintDateError] = useState('');

    const details = useSelector((state: PiState) => state.details);
    const teamMembers = useSelector((state: PiState) => state.details.teamMembers);
    const holidays = useSelector((state: PiState) => state.details.holidays);
    const hoursPerDay = useSelector((state: PiState) => state.details.hoursPerDay);
    const dispatch = useDispatch();
  
    const addNewMember = () => {
        setAddTeamMembersError('');
        if (memberName && memberSpecialities?.length) {
            setMember({ id: `${Math.floor(1000 + Math.random() * 9000)}`, name: memberName, specialities: memberSpecialities, plannedLeaves: plannedLeaves});
        } else {
            setAddTeamMembersError('Add all details');
        }
        setOpenMembers(false);
        setMemberName('');
        setMemberSpecialities([]);
        setPlannedLeaves([]);
    }

    const addNewSprint = () => {
        if (sprintName && sprintStartDate && sprintEndDate && sprintSupportMembers?.length) {
            setSprint({ name: sprintName, start: sprintStartDate.toISOString(), end: sprintEndDate.toISOString(), supportMembers: sprintSupportMembers, type: sprintType});
        }
        setSprintName('');
        setSprintStartDate(undefined);
        setSprintEndDate(undefined);
        setOpenSprints(false);
        setSprintSupportMembers([]);
    }

    const validateStoryDuration = () => {
        if (storyDurationDays && storyDurationHours && sprintAllocationDays && sprintAllocationHours) {
            let totalSprintAllocation = 0;
            sprintAllocations.forEach((a) => {
                totalSprintAllocation = parseFloat(a.allocation.days) + parseFloat(a.allocation.hours)/parseFloat(hoursPerDay);
            })
            if (parseFloat(storyDurationDays) + parseFloat(storyDurationHours)/parseFloat(hoursPerDay) < totalSprintAllocation) {
                // setSprintAllocationError("You have allocated more time in the sprints than the story's estimated duration.");
            }
        }
    }

    const addNewStory = () => {
        validateStoryDuration();
        if (storyId && storyDescription && storySpecialities && sprintAllocations?.length && storyDurationDays && storyDurationHours) {
            dispatch(addStoryToStore({ storyId: storyId, title: storyTitle, description: storyDescription, priority: storyPriority, type: storyType, specialities: storySpecialities, sprints: sprintAllocations, estimatedDuration: { days: storyDurationDays, hours: storyDurationHours }, Assignee: storyAssignee, dependencies: storyDependencies }));
            setAddStory((prev) => !prev);
        }
    }
  
    useEffect(() => {
    if (member?.id) {
        dispatch(addTeamMembers(member));
        setMember({} as TeamMember);
    }
    }, [member]);

    useEffect(() => {
        if (sprint?.name) {
            dispatch(addSprintToStore(sprint));
            setSprint({} as Sprint);
        }
    }, [sprint])

    const handleDeleteHolidays = (holiday: string) => {
        if (holidays.includes(holiday)) {
            dispatch(deleteHoliday(holiday));
        } else {
            const holidays = [...holidaysState];
            holidays.splice(holidaysState.indexOf(holiday), 1);
            setHolidaysState(holidays);
        }
    }

    const handleDeletePlannedLeave = (plannedLeave: string) => {
        if (plannedLeaves.includes(plannedLeave)) {
            const leaves = [...plannedLeaves];
            leaves.splice(plannedLeaves.indexOf(plannedLeave), 1);
            setPlannedLeaves(leaves);
        }
    }

    const handleAddHolidays = () => {
        dispatch(setHolidays(holidaysState));
        setTabValue(1);
    }

    const handleStoryTypeChange = (event: SelectChangeEvent<'BUG' | 'IMPROVEMENT' | 'FEATURE'>) => {
        setStoryType(event.target.value as 'BUG' | 'IMPROVEMENT' | 'FEATURE');
    }

    useEffect(() => {
        setHolidaysState(holidays);
    }, [holidays]);

    const handleAssigneeChange = (event: SelectChangeEvent<string>) => {
        setStoryAssignee(teamMembers.find((member) => member.id === event.target.value)?.id  || '');
    }

    const handleSprintChange = (event: SelectChangeEvent<string>) => {
        setSprintAllocations((prev) => [...prev, { name: event.target.value, allocation: { days: "0", hours: "0"}}]);
    }

    const addSprintAllocation = () => {
        if (sprintAllocationDays && sprintAllocationHours) {
            const currentSprintAllocation = sprintAllocations[sprintAllocations?.length - 1];
            const currentAllocations = [...sprintAllocations];
            currentAllocations.map((spAl) => {
            if (spAl.name === currentSprintAllocation.name) {
                spAl.allocation.days = sprintAllocationDays;
                spAl.allocation.hours = sprintAllocationHours;
            }
            });
            setSprintAllocations(currentAllocations);
            setSprintAllocationDays('');
            setSprintAllocationHours('');
        } else {
            // setSprintAllocationError('Need to estimate duration of the story in the sprint.');
        }
    }

    const handleDeleteSpeciality = (specialityName: string) => {
        dispatch(deleteSpecialityFromStore(specialityName))
    }

    const handleSpecialityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAddSpeciality(event.target.value);
    }

    const handleSaveSpeciality = () => {
        if (addSpeciality?.length) {
            dispatch(addSpecialitiesToStore(addSpeciality));
        }
    }

    const handleMemberSpecialityChange = (event: SelectChangeEvent<string>) => {
        setMemberSpecialities((prev) => [...prev, event.target.value]);
    }

    const handleStorySpecialityChange = (event: SelectChangeEvent<string>) => {
        setStorySpecialities((prev) => [...prev, event.target.value]);
    }

    const handleDeleteMember = (memberId: string) => {
        dispatch(removeTeamMember(memberId));
    }

    const handleDeleteSprint = (sprintName: string) => {
        dispatch(deleteSprint(sprintName));
    }

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleDeleteStorySprint = (sprint: SprintAllocation) => {
        setSprintAllocations((prev) => prev.filter((s) => s !== sprint));
    }

    const handleSupportMemberChange = (event: SelectChangeEvent<string>) => {
        setSprintSupportMembers([...sprintSupportMembers, event.target.value])
    }

    const handleDeleteSupportMember = (member: string) => {
        setSprintSupportMembers((prev) => prev.filter((m) => m !== member));
    }

    const handleSprintTypeChange = (event: SelectChangeEvent<string>) => {
        setSprintType(event.target.value as SprintType);
    }

    return (
        <Box  sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="basic tabs example">
                    <Tab label="PI details" {...a11yProps(0)} />
                    {details?.holidays?.length ? <Tab label="Team Members" {...a11yProps(1)} /> : null}
                    {details?.teamMembers?.length ? <Tab label="Sprints" {...a11yProps(2)} /> : null}
                    {details?.sprints?.length ? <Tab label="Stories" {...a11yProps(3)} /> : null}
                </Tabs>
            </Box>
            <CustomTabPanel value={tabValue} index={0}>
                <Grid container spacing={1} direction="column" width="25%">
                <Grid size={10}>
                    <Typography>Team Name</Typography>
                    <TextField
                        id="team-name"
                        fullWidth
                        value={details.teamName}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            dispatch(setTeamName(event.target.value));
                        }}
                    />
                </Grid>
                <Grid size={10}>
                    <Typography>PI Number</Typography>
                    <TextField
                        id="pi-number"
                        fullWidth
                        value={details.piNumber}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            dispatch(setPiNumber(event.target.value));
                        }}
                    />
                </Grid>
                <Grid  size={10}>
                    <Typography>PI Start Date</Typography>
                    <DatePicker
                        format='DD/MM/YYYY'
                        slotProps={{
                            textField: {
                                fullWidth: true
                            }
                        }}
                        value={details.PiStartDate ? dayjs(details.PiStartDate) : null}
                        onChange={(event) => {
                            dispatch(setStartDate(event ? event.set('hour', 5).set('minute', 30).set('second', 0).set('millisecond', 0).toISOString() : ''));
                        }}
                    />
                </Grid>
                <Grid  size={10}>
                    <Typography>PI End Date</Typography>
                    <DatePicker
                        format='DD/MM/YYYY'
                        minDate={dayjs(details.PiStartDate).add(1, 'day') || null}
                        slotProps={{
                            textField: {
                                fullWidth: true
                            }
                        }}
                        value={details.PiEndDate ? dayjs(details.PiEndDate) : null}
                        onError={(error => console.log(error))}
                        onChange={(event) => {
                            dispatch(setEndDate(event ? event.set('hour', 5).set('minute', 30).set('second', 0).set('millisecond', 0).toISOString() : ''));
                        }}
                    />
                </Grid>
                <Grid  size={10}>
                    <Typography>Specialities</Typography>
                    <TextField
                        id="specialities"
                        fullWidth
                        value={addSpeciality}
                        type='text'
                        onChange={handleSpecialityChange}
                    />
                    <Box sx={{ display: 'flex' }}>
                        {details.specialities?.map((speciality) => (
                            <Chip key={speciality} label={speciality} onDelete={() => handleDeleteSpeciality(speciality)} />
                        ))}
                    </Box>
                    <Button sx={{ margin: '5px' }} variant='contained' onClick={handleSaveSpeciality} endIcon={<AddIcon />}>Add</Button>
                </Grid>
                <Grid  size={10}>
                    <Typography>Hours per day</Typography>
                    <TextField
                        id="hours-per-day"
                        value={details.hoursPerDay || ''}
                        type='number'
                        slotProps={{ htmlInput: { step: 0.1, min: 0 }}}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            dispatch(setHoursPerDay(event.target.value));
                        }}
                    />
                </Grid>
                <Grid size={10}>
                    <Typography>Holidays</Typography>
                    <DatePicker
                        format='DD/MM/YYYY'
                        value={details?.holidays?.length ? dayjs(holidays[holidays?.length - 1]) : holidaysState?.length ? dayjs(holidaysState[holidaysState?.length - 1]) : null}
                        onChange={(event) => {
                            setHolidaysError('');
                            if (isWeekend(dayjs(event).set('hour', 5).set('minute', 30).set('second', 0).set('millisecond', 0))) {
                                setHolidaysError('Holiday cannot be on weekends.');
                            } else if ((dayjs(event).set('hour', 5).set('minute', 30).set('second', 0).set('millisecond', 0).isSame(dayjs(details.PiStartDate)) ||
                                dayjs(event).set('hour', 5).set('minute', 30).set('second', 0).set('millisecond', 0).isAfter(dayjs(details.PiStartDate)) &&
                                (dayjs(event).set('hour', 5).set('minute', 30).set('second', 0).set('millisecond', 0).isSame(dayjs(details.PiEndDate)) ||
                                dayjs(event).set('hour', 5).set('minute', 30).set('second', 0).set('millisecond', 0).isBefore(dayjs(details.PiEndDate))))) {
                                setHolidaysState((prev) => [...prev, event ? event.set('hour', 5).set('minute', 30).set('second', 0).set('millisecond', 0).toISOString(): '']);
                            } else {
                                setHolidaysError('Holiday should be within the PI');
                            }
                        }}
                    />
                    <Typography sx={{ color: 'red' }}>{holidaysError}</Typography>
                    <Box sx={{ display: 'flex' }}>
                        {holidaysState?.map((holiday) => 
                            <Chip key={holiday} label={dayjs(holiday).format('DD/MM/YYYY')} onDelete={() => handleDeleteHolidays(holiday)} />
                        )}
                    </Box>
                    <Button sx={{ margin: '5px' }} variant='contained' onClick={handleAddHolidays} endIcon={<AddIcon />}>Add</Button>
                </Grid>
                <Grid size={10}>
                    <Button sx={{ margin: '5px' }} variant='contained' onClick={() => setTabValue(1)} endIcon={<ArrowRight />}>Next</Button>
                </Grid>
                </Grid>
            </CustomTabPanel>
            <CustomTabPanel value={tabValue} index={1}>
                <Grid container spacing={1} direction="column" gap={5} width="25%">
                    <Grid  size={10} direction="column">
                        <>
                        <Button startIcon={<AddIcon/>} onClick={() => setOpenMembers((prev) => !prev)}>Add Team member</Button>
                        <Collapse in={openMembers}>
                            <TextField
                                id="member-name"
                                margin='normal'
                                label={<Typography>Member Name</Typography>}
                                value={memberName}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    setMemberName(event.target.value);
                                }}
                            />
                            <FormControl fullWidth>
                                <InputLabel id="select-speciality">Select Speciality</InputLabel>
                                <Select
                                    labelId="select-speciality"
                                    id="select-speciality"
                                    value={memberSpecialities[memberSpecialities?.length - 1]}
                                    label="Speciality"
                                    onChange={handleMemberSpecialityChange}
                                >
                                    {details.specialities?.map((speciality) => <MenuItem key={speciality} value={speciality}>{speciality}</MenuItem>)}
                                </Select>
                            </FormControl>
                            <Typography>Planned Leaves</Typography>
                            <DatePicker
                                format='DD/MM/YYYY'
                                value= {plannedLeaves?.length ? dayjs(plannedLeaves[plannedLeaves?.length - 1]) : null}
                                onChange={(event) => {
                                    setPlannedLeavesError('');
                                    if (isHoliday(dayjs(event).set('hour', 5).set('minute', 30).set('second', 0).set('millisecond', 0), holidays)) {
                                        setPlannedLeavesError('Leaves cannot be on holidays.');
                                    } else if (isWeekend(dayjs(event).set('hour', 5).set('minute', 30).set('second', 0).set('millisecond', 0))) {
                                        setPlannedLeavesError('Leaves cannot be on weekends.');
                                    } else if(!dayjs(event).set('hour', 5).set('minute', 30).set('second', 0).set('millisecond', 0).isSame(dayjs(details.PiStartDate)) &&
                                        dayjs(event).set('hour', 5).set('minute', 30).set('second', 0).set('millisecond', 0).isBefore(dayjs(details.PiStartDate))) {
                                        setPlannedLeavesError('Leaves cannot be before the PI.');
                                    } else if (!dayjs(event).set('hour', 5).set('minute', 30).set('second', 0).set('millisecond', 0).isSame(dayjs(details.PiEndDate)) &&
                                        dayjs(event).set('hour', 5).set('minute', 30).set('second', 0).set('millisecond', 0).isAfter(dayjs(details.PiEndDate))) {
                                        setPlannedLeavesError('Leaves cannot be after the PI.');
                                    } else {
                                        setPlannedLeaves((prev) => [...prev, event ? dayjs(event).set('hour', 5).set('minute', 30).set('second', 0).set('millisecond', 0).toISOString() : '']);
                                    }
                                }}
                            />
                            <Typography sx={{ color: 'red' }}>{plannedLeavesError}</Typography>
                            <Box sx={{ display: 'flex' }}>
                                {plannedLeaves?.map((leave) => <Chip key={leave} label={dayjs(leave).format('DD/MM/YYYY')} onDelete={() => handleDeletePlannedLeave(leave)} />)}
                            </Box>
                            <Button sx={{ margin: '5px' }} variant='contained' onClick={addNewMember}  endIcon={<AddIcon />}>Add Team Member</Button>
                        </Collapse>
                        <Typography color='red'>{addTeamMembersError}</Typography>
                        </>
                    </Grid>
                    <Grid  size={10}>
                        <Box sx={{ display: 'block' }}>
                            {details.teamMembers?.map((member) => (
                                <Accordion
                                    key={member.id}
                                >
                                    <AccordionSummary
                                        expandIcon={<ArrowDownward />}
                                        aria-controls="panel1-content"
                                        key={member?.id}
                                    >
                                    <Typography component="span">{member?.name}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography>Specialities: </Typography>
                                        {member.specialities?.map((speciality) => <Typography>{speciality}</Typography>)}
                                        <Button onClick={() => handleDeleteMember(member.id)} endIcon={<Delete />} >Delete</Button>
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                        </Box>
                    </Grid>
                </Grid>
            </CustomTabPanel>
             <CustomTabPanel value={tabValue} index={2}>
                <Grid container spacing={1} direction="column" width="25%">
                    <Grid  size={10}>
                        <>
                            <Typography>Sprints</Typography>
                            <Button startIcon={<AddIcon/>} onClick={() => setOpenSprints((prev) => !prev)}>Add Sprint</Button>
                            <Collapse in={openSprints}>
                                <Typography>Sprint Name</Typography>
                                <TextField
                                    id="sprint-number"
                                    margin='normal'
                                    value={storyId}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                        setSprintName(event.target.value);
                                    }}
                                />
                                <FormControl sx={{ marginTop: '10px' }} fullWidth>
                                    <InputLabel id="select-speciality">Select Sprint Type</InputLabel>
                                    <Select
                                        labelId="select-sprint"
                                        id="select-sprint"
                                        value={sprintType}
                                        label="Sprint"
                                        onChange={handleSprintTypeChange}
                                    >
                                        <MenuItem key={1} value={'REGULAR'}>REGULAR</MenuItem>
                                        <MenuItem key={2} value={'STRETCH'}>STRETCH</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl sx={{ marginTop: '10px' }} fullWidth>
                                    <InputLabel id="select-speciality">Select Support Members</InputLabel>
                                    <Select
                                        labelId="select-speciality"
                                        id="select-speciality"
                                        value={sprintSupportMembers[sprintSupportMembers?.length - 1]}
                                        label="Speciality"
                                        onChange={handleSupportMemberChange}
                                    >
                                        {details.teamMembers?.map((member) => <MenuItem key={member.id} value={member.id}>{member.name}</MenuItem>)}
                                    </Select>
                                    {sprintSupportMembers.map((member) => <Chip label={getMemberNameFromId(member, teamMembers)} onDelete={handleDeleteSupportMember}/>)}
                                </FormControl>
                                <Typography>Start Date</Typography>
                                <DatePicker
                                    format='DD/MM/YYYY'
                                    value={sprintStartDate ? dayjs(sprintStartDate) : null}
                                    onError={(error => console.log(error))}
                                    onChange={(event) => {
                                        if (dayjs(event).add(1, 'day').isAfter(dayjs(details.PiStartDate))) {
                                            setSprintDateError('');
                                            setSprintStartDate(dayjs(event).set('hour', 5).set('minute', 30).set('second', 0).set('millisecond', 0));
                                        } else {
                                            setSprintDateError('Sprint dates should be within the PI');
                                        }
                                    }}
                                />
                                <Typography>End Date</Typography>
                                <DatePicker
                                    format='DD/MM/YYYY'
                                    minDate={dayjs(sprintStartDate).add(1, 'day') || null}
                                    value={sprintEndDate ? dayjs(sprintEndDate) : null}
                                    onError={(error => console.log(error))}
                                    onChange={(event) => {
                                        if (dayjs(event).subtract(1, 'day').isBefore(dayjs(details.PiEndDate))) {
                                            setSprintDateError('');
                                            setSprintEndDate(dayjs(event).set('hour', 5).set('minute', 30).set('second', 0).set('millisecond', 0));
                                        } else {
                                            setSprintDateError('Sprint dates should be within the PI');
                                        }
                                    }}
                                />
                                <Typography sx={{ color: 'red' }}>{sprintDateError}</Typography>
                                <Button variant='contained' onClick={addNewSprint} endIcon={<Add />}>Add</Button>
                            </Collapse>
                                {details?.sprints?.map((sprint) => (
                                    <Accordion
                                    key={sprint?.name}
                                    >
                                        <AccordionSummary
                                            expandIcon={<ArrowDownward />}
                                            aria-controls="panel1-content"
                                            key={sprint?.name}
                                        >
                                        <Typography component="span">{sprint?.name}</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                        <Typography>Start Date: {dayjs(sprint.start).format('DD/MM/YYYY')}</Typography>
                                        <Typography>End Date: {dayjs(sprint.end).format('DD/MM/YYYY')}</Typography>
                                        <Typography>No of working days: {getNoOfWorkingDays(dayjs(sprint.start), dayjs(sprint.end), holidays)}</Typography>
                                        <Button onClick={() => handleDeleteSprint(sprint?.name)} endIcon={<Delete />} >Delete</Button>
                                        </AccordionDetails>
                                    </Accordion>
                                ))}
                        </>
                    </Grid>
                </Grid>
            </CustomTabPanel>
            <CustomTabPanel value={tabValue} index={3}>
                <Grid container spacing={1} direction="column" width="25%">
                    <Grid  size={10}>
                        <>
                            <Typography>Add Story</Typography>
                            <Button startIcon={<AddIcon/>} onClick={() => setAddStory((prev) => !prev)}>Add Story</Button>
                            <Collapse in={addStory}>
                                <TextField
                                    id="story-id"
                                    placeholder='Story ID'
                                    value={storyId}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                        setStoryId(event.target.value);
                                    }}
                                />
                                <TextField
                                    id="story-title"
                                    placeholder='Story Title'
                                    value={storyTitle}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                        setStoryTitle(event.target.value);
                                    }}
                                />
                                <TextField
                                    id="story-description"
                                    placeholder='Description'
                                    value={storyDescription}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                        setStoryDescription(event.target.value);
                                    }}
                                />
                                <TextField
                                    id="story-priority"
                                    placeholder='Priority'
                                    type='number'
                                    value={storyPriority}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                        setStoryPriority(event.target.value);
                                    }}
                                />
                                <FormControl sx={{ margin: '10px' }} fullWidth>
                                    <InputLabel id="select-type">Select Type</InputLabel>
                                    <Select
                                        labelId="select-story-type-label"
                                        id="select-story-type"
                                        value={storyType}
                                        label="assignee"
                                        onChange={handleStoryTypeChange}
                                    >
                                        {['BUG', 'IMPROVEMENT', 'FEATURE', 'MAINTENANCE'].map((type) => <MenuItem key={type} value={type}>{type}</MenuItem>)}
                                    </Select>
                                </FormControl>
                                <FormControl sx={{ margin: '10px' }} fullWidth>
                                    <InputLabel id="select-assignee">Select Assignee</InputLabel>
                                    <Select
                                        labelId="select-assignee-label"
                                        id="select-member-assignee"
                                        value={storyAssignee}
                                        label="assignee"
                                        onChange={handleAssigneeChange}
                                    >
                                        {details.teamMembers?.map((member) => <MenuItem key={member.id} value={member.id}>{member?.name}</MenuItem>)}
                                    </Select>
                                </FormControl>
                                <FormControl sx={{ margin: '10px' }} fullWidth>
                                    <InputLabel id="select-sprint">Select Sprints</InputLabel>
                                    <Select
                                        labelId="select-sprint-label"
                                        id="select-sprint"
                                        value={sprintAllocations[sprintAllocations?.length - 1]?.name || ''}
                                        label="assignee"
                                        onChange={handleSprintChange}
                                    >
                                        {details.sprints?.map((sprint) => <MenuItem key={sprint?.name} value={sprint?.name}>{sprint?.name}</MenuItem>)}
                                    </Select>
                                    <Box display="flex" margin="10px" justifyContent="space-evenly">
                                        <TextField
                                            id="sprint-allocation-days"
                                            placeholder='Days'
                                            value={sprintAllocationDays}
                                            type='number'
                                            required
                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                setSprintAllocationDays(event.target.value);
                                            }}
                                        />
                                        <TextField
                                            id="sprint-allocation-hours"
                                            placeholder='Hours'
                                            value={sprintAllocationHours}
                                            type='number'
                                            required
                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                setSprintAllocationHours(event.target.value);
                                            }}
                                        />
                                    </Box>
                                    <Button endIcon={<AddIcon/>} onClick={addSprintAllocation}>Add</Button>
                                </FormControl>
                                {sprintAllocations.map((sprint) => <Chip label={`${sprint.name} ${sprint.allocation.days}d` + ` ${sprint.allocation.hours ? `${sprint.allocation.hours}h` : ''}`} onDelete={() => handleDeleteStorySprint(sprint)} />)}
                                <FormControl sx={{ margin: '10px' }} fullWidth>
                                    <InputLabel id="select-speciality">Select Speciality</InputLabel>
                                    <Select
                                        labelId="select-speciality"
                                        id="select-speciality"
                                        value={storySpecialities[storySpecialities?.length - 1]}
                                        label="assignee"
                                        onChange={handleStorySpecialityChange}
                                    >
                                        {details.specialities?.map((speciality) => <MenuItem key={speciality} value={speciality}>{speciality}</MenuItem>)}
                                    </Select>
                                </FormControl>
                                <Box sx={{ margin: '10px' }}>
                                    <TextField
                                        id="story-duration-days"
                                        label={<Typography>Total duration in days and hours</Typography>}
                                        margin='normal'
                                        placeholder='Days'
                                        type='number'
                                        value={storyDurationDays}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                            setStoryDurationDays(event.target.value);
                                        }}
                                    />
                                    <TextField
                                        id="story-duration-hours"
                                        margin='normal'
                                        placeholder='Hours'
                                        type='number'
                                        value={storyDurationHours}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                            setStoryDurationHours(event.target.value);
                                        }}
                                    />
                                </Box>
                                <Button variant='contained' onClick={addNewStory} endIcon={<Save />}>Save</Button>
                            </Collapse>
                            {details?.stories?.map((story) => (
                                <Accordion
                                    key={story.storyId}
                                >
                                    <AccordionSummary
                                        expandIcon={<ArrowDownward />}
                                        aria-controls="panel1-content"
                                        key={story.title}
                                    >
                                        <Typography component="span">{story.storyId}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        {story.estimatedDuration.days ? (
                                            <>
                                                <Typography>Duration in Days</Typography>
                                                <Typography>{story.estimatedDuration.days}</Typography>
                                            </>
                                        ) : null}
                                        {story.estimatedDuration.hours ? (
                                            <>
                                                <Typography>Duration in Hours</Typography>
                                                <Typography>{story.estimatedDuration.hours}</Typography>
                                            </>
                                        ): null}
                                        <Typography>Starting Sprint</Typography>
                                        <Typography>{story.sprints.map((sprint) => sprint.name).join(',')}</Typography>
                                        <Typography>Dependencies</Typography>
                                        {story.dependencies?.map((dep) => <Chip label={dep}/> )}
                                        <Typography>{story.Assignee}</Typography>
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                        </>
                    </Grid>
                </Grid>
            </CustomTabPanel>
        </Box>
    )
}

export default PiDetails;