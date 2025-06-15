import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Chip, Grid, Tab, Tabs } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Collapse from '@mui/material/Collapse';
import { Add, ArrowDownward, Delete, Save } from '@mui/icons-material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { addSpecialitiesToStore, addSprintToStore, addStoryToStore, deleteHoliday, deleteSpecialityFromStore, deleteSprint, PiState, removeTeamMember, setEndDate, setHolidays, setHoursPerDay, setPiNumber, setStartDate, setTeamName, setTeamSize } from '../store/PiSlice';
import dayjs, { Dayjs } from "dayjs";
import { Sprint, TeamMember } from '../store/utils/types';
import { useDispatch, useSelector } from 'react-redux';
import { addTeamMembers } from '../store/PiSlice';
import { CustomTabPanel, a11yProps } from '../components/CustomTabPanel';
import { getNoOfWorkingDays, isHoliday, isWeekend } from '../store/utils/helpers';

function PiDetails() {
    const [member, setMember] = useState<TeamMember>();
    const [sprint, setSprint] = useState<Sprint>();
    const [holidaysState, setHolidaysState] = useState<string[]>([]);
    const [openMembers, setOpenMembers] = useState(false);
    const [openSprints, setOpenSprints] = useState(false);
    const [assignee, setAssignee] = useState<number>();
    const [addStory, setAddStory] = useState(false);
    const [addSprint, setAddSprint] = useState(false);
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
    const [sprintStartDate, setSprintStartDate] = useState<Dayjs>();
    const [sprintEndDate, setSprintEndDate] = useState<Dayjs>();
    const [storyDurationDays, setStoryDurationDays] = useState<string>('');
    const [storyDurationHours, setStoryDurationHours] = useState<string>('');
    const [storyDescription, setStoryDescription] = useState<string>();
    const [storySprints, setStorySprints] = useState<string[]>([]);
    const [storySpecialities, setStorySpecialities] = useState<string[]>([]);
    const [storyAssignee, setStoryAssignee] = useState<string>();
    const [storyDependencies, setStoryDependencies] = useState<Array<string>>([]);
    const [tabValue, setTabValue] = React.useState(0);
    const [holidaysError, setHolidaysError] = useState('');
    const [plannedLeavesError, setPlannedLeavesError] = useState('');
    const [sprintDateError, setSprintDateError] = useState('');

    const details = useSelector((state: PiState) => state.details);
    const holidays = useSelector((state: PiState) => state.details.holidays);
    const dispatch = useDispatch();
    console.log('details = ', details);
  
    const addNewMember = () => {
        console.log(memberName, memberSpecialities, plannedLeaves);
        if (memberName && memberSpecialities.length && plannedLeaves.length) {
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
        if (sprintName && sprintStartDate && sprintEndDate) {
            setSprint({ name: sprintName, start: sprintStartDate.toISOString(), end: sprintEndDate.toISOString()});
        }
        setOpenSprints(false);
    }

    const addNewStory = () => {
        console.log('storyId = ', storyId, 'storyDescription = ', storyDescription, 'storyAssignee = ', storyAssignee, 'storySpecialities = ', storySpecialities);
        console.log('storySprint = ', storySprints, 'storyDurationDays = ', storyDurationDays, 'storyDurationHours = ', storyDurationHours);
        if (storyId && storyDescription && storyAssignee && storySpecialities && storySprints && storyDurationDays && storyDurationHours) {
            dispatch(addStoryToStore({ storyId: storyId, title: storyTitle, description: storyDescription, priority: storyPriority, type: storyType, specialities: storySpecialities, sprints: storySprints, estimatedDuration: { days: storyDurationDays, hours: storyDurationHours }, Assignee: storyAssignee, dependencies: storyDependencies }))
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
        setStoryAssignee(details.teamMembers.find((member) => member.id === event.target.value)?.id);
    }

    const handleSprintChange = (event: SelectChangeEvent<string>) => {
        setStorySprints((prev) => prev.concat(event.target.value));
    }

    const handleDeleteSpeciality = (specialityName: string) => {
        dispatch(deleteSpecialityFromStore(specialityName))
    }

    const handleSpecialityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAddSpeciality(event.target.value);
    }

    const handleSaveSpeciality = () => {
        if (addSpeciality.length) {
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

    const handleDeleteStorySprint = (sprint: string) => {
        setStorySprints((prev) => prev.filter((s) => s !== sprint));
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
                <Grid size={10}>
                    <Typography>Team Size</Typography>
                    <TextField
                        id="team-size"
                        fullWidth
                        value={details.teamSize || ''}
                        type='number'
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            dispatch(setTeamSize(event.target.value));
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
                <Grid  size={10}>
                    <Typography>Holidays</Typography>
                    <DatePicker
                        format='DD/MM/YYYY'
                        value={details?.holidays?.length ? dayjs(holidays[holidays.length - 1]) : holidaysState?.length ? dayjs(holidaysState[holidaysState.length - 1]) : null}
                        onChange={(event) => {
                            setHolidaysError('');
                            if ((dayjs(event).set('hour', 5).set('minute', 30).set('second', 0).set('millisecond', 0).isSame(dayjs(details.PiStartDate)) ||
                                dayjs(event).set('hour', 5).set('minute', 30).set('second', 0).set('millisecond', 0).isAfter(dayjs(details.PiStartDate)) &&
                                (dayjs(event).set('hour', 5).set('minute', 30).set('second', 0).set('millisecond', 0).isSame(dayjs(details.PiEndDate)) ||
                                dayjs(event).set('hour', 5).set('minute', 30).set('second', 0).set('millisecond', 0).isBefore(dayjs(details.PiEndDate)))&&
                                !isWeekend(dayjs(event)))) {
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
                </Grid>
            </CustomTabPanel>
            <CustomTabPanel value={tabValue} index={1}>
                <Grid container spacing={1} direction="column" gap={5} width="25%">
                    <Grid  size={10} direction="column">
                        <>
                        <Typography>Add Team Members</Typography>
                        <Button startIcon={<AddIcon/>} onClick={() => setOpenMembers((prev) => !prev)}>Add Team member</Button>
                        <Collapse in={openMembers}>
                            <Typography>Member Name</Typography>
                            <TextField
                                id="member-name"
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
                                    value={memberSpecialities[memberSpecialities.length - 1]}
                                    label="Speciality"
                                    onChange={handleMemberSpecialityChange}
                                >
                                    {details.specialities?.map((speciality) => <MenuItem key={speciality} value={speciality}>{speciality}</MenuItem>)}
                                </Select>
                            </FormControl>
                            <Typography>Planned Leaves</Typography>
                            <DatePicker
                                format='DD/MM/YYYY'
                                value= {plannedLeaves.length ? dayjs(plannedLeaves[plannedLeaves.length - 1]) : null}
                                onChange={(event) => {
                                    if (!isHoliday(dayjs(event).set('hour', 5).set('minute', 30).set('second', 0).set('millisecond', 0), holidays) &&
                                        !isWeekend(dayjs(event).set('hour', 5).set('minute', 30).set('second', 0).set('millisecond', 0)) &&
                                        (dayjs(event).set('hour', 5).set('minute', 30).set('second', 0).set('millisecond', 0).isSame(dayjs(details.PiStartDate)) ||
                                        dayjs(event).set('hour', 5).set('minute', 30).set('second', 0).set('millisecond', 0).isAfter(dayjs(details.PiStartDate))) &&
                                        (dayjs(event).set('hour', 5).set('minute', 30).set('second', 0).set('millisecond', 0).isSame(dayjs(details.PiEndDate)) ||
                                        dayjs(event).set('hour', 5).set('minute', 30).set('second', 0).set('millisecond', 0).isBefore(dayjs(details.PiEndDate)))) {
                                            setPlannedLeaves((prev) => [...prev, event ? event.set('hour', 5).set('minute', 30).set('second', 0).set('millisecond', 0).toISOString() : '']);
                                        }
                                    if (isHoliday(event, holidays)) {
                                        setPlannedLeavesError('Leaves cannot be on holidays');
                                    } else if(isWeekend(dayjs(event).set('hour', 5).set('minute', 30).set('second', 0).set('millisecond', 0))) {
                                        setPlannedLeavesError('Leaves cannot be on weekends');
                                    } else if(!(dayjs(event).set('hour', 5).set('minute', 30).set('second', 0).set('millisecond', 0).isSame(dayjs(details.PiStartDate)) ||
                                        dayjs(event).set('hour', 5).set('minute', 30).set('second', 0).set('millisecond', 0).isAfter(dayjs(details.PiStartDate))) &&
                                        !(dayjs(event).set('hour', 5).set('minute', 30).set('second', 0).set('millisecond', 0).isSame(dayjs(details.PiEndDate)) ||
                                        dayjs(event).set('hour', 5).set('minute', 30).set('second', 0).set('millisecond', 0).isBefore(dayjs(details.PiEndDate)))) {
                                        setPlannedLeavesError('Leaves must be within the PI');
                                    }
                                }}
                            />
                            <Typography sx={{ color: 'red' }}>{plannedLeavesError}</Typography>
                            {plannedLeaves?.map((leave) => <Chip key={leave} label={dayjs(leave).format('DD/MM/YYYY')} onDelete={() => handleDeletePlannedLeave(leave)} />)}
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
                                    value={storyId}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                        setSprintName(event.target.value);
                                    }}
                                />
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
                                <FormControl fullWidth>
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
                                <FormControl fullWidth>
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
                                <FormControl fullWidth>
                                    <InputLabel id="select-sprint">Select Sprint</InputLabel>
                                    <Select
                                        labelId="select-sprint-label"
                                        id="select-sprint"
                                        value={storySprints[storySprints.length - 1] || ''}
                                        label="assignee"
                                        onChange={handleSprintChange}
                                    >
                                        {details.sprints?.map((sprint) => <MenuItem key={sprint?.name} value={sprint?.name}>{sprint?.name}</MenuItem>)}
                                    </Select>
                                </FormControl>
                                {storySprints.map((sprint) => <Chip label={sprint} onDelete={() => handleDeleteStorySprint(sprint)} />)}
                                <FormControl fullWidth>
                                    <InputLabel id="select-speciality">Select Speciality</InputLabel>
                                    <Select
                                        labelId="select-speciality"
                                        id="select-speciality"
                                        value={storySpecialities[storySpecialities.length - 1]}
                                        label="assignee"
                                        onChange={handleStorySpecialityChange}
                                    >
                                        {details.specialities?.map((speciality) => <MenuItem key={speciality} value={speciality}>{speciality}</MenuItem>)}
                                    </Select>
                                </FormControl>
                                <Typography>Duration in d and h</Typography>
                                <Box>
                                    <TextField
                                        id="story-duration-days"
                                        placeholder='Days'
                                        value={storyDurationDays}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                            setStoryDurationDays(event.target.value);
                                        }}
                                    />
                                    <TextField
                                        id="story-duration-hours"
                                        placeholder='Hours'
                                        value={storyDurationHours}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                            setStoryDurationHours(event.target.value);
                                        }}
                                    />
                                </Box>
                                <Button variant='contained' onClick={addNewStory} endIcon={<Save />}>Save</Button>
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
                                        <Typography>{story.sprints[0]}</Typography>
                                        <Typography>Dependencies</Typography>
                                        {story.dependencies?.map((dep) => <Chip label={dep}/> )}
                                        <Typography>{story.Assignee}</Typography>
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                            </Collapse>
                        </>
                    </Grid>
                </Grid>
            </CustomTabPanel>
        </Box>
    )
}

export default PiDetails;