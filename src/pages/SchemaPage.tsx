import { useEffect, useState } from "react";
import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import { PiDetails } from "../store/utils/types";
import { PiState, setEndDate, setHolidays, setPIdetails, setPiNumber, setSprints, setStartDate, setStories, setTeamMembers, setTeamName, setTeamSize } from "../store/PiSlice";

function SchemaPage() {
    const details = useSelector((state: PiState) => state.details);
    console.log('details = ', details);
    const [schemaString, setSchemaString] = useState<string>(JSON.stringify(details));
    const [schemaError, setSchemaError] = useState<string>('');
    const [schemaSuccess, setSchemaSuccess] = useState<string>('');
    const [schemaObj, setSchemaObject] = useState<PiDetails>(details);
    const dispatch = useDispatch();

    const evaluateSchema = (schemaString: string): boolean => {
        try {
            const schema = JSON.parse(schemaString);
            if (schema?.teamName.length &&
                schema?.piNumber.length &&
                schema?.teamSize.length &&
                typeof schema?.holidays === 'object' &&
                schema?.teamMembers.length &&
                schema.sprints.length &&
                schema?.specialities.length &&
                schema?.stories.length &&
                schema?.PiStartDate &&
                schema?.PiEndDate &&
                schema?.hoursPerDay.length
            ) {
                setSchemaError('')
                setSchemaObject(schema);
                return true;
            }
        }
        catch (error: any) {
            console.log('error parsing: ', error);
            setPIdetails({} as PiDetails);
            setSchemaError('Invalid schema');
            return false;
        }
        return false;
    }

    useEffect(() => {
        if (evaluateSchema(schemaString)) {
           dispatch(setPIdetails(schemaObj));
        }
    }, [schemaString]);

    useEffect(() => {
        if (!schemaObj.teamName) {
            setSchemaError('Invalid schema');
        } else if (Object.keys(schemaObj).length) {
            setSchemaSuccess('Success!');
        }
    }, [schemaString])

    return (
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
            <Typography>Paste the schema below.</Typography>
            {schemaError ? <Alert severity="error" variant="standard">{schemaError}</Alert>: null}
            {schemaSuccess && !schemaError ? <Alert severity="success" variant="standard">{schemaSuccess}</Alert> : null}
            <textarea
                name="Outlined"
                value={schemaString}
                onChange={(event) => setSchemaString(event.target.value)}
            />
        </Box>
    );
}

export default SchemaPage;
