import { useState } from "react";
import { Alert, Box, Button, Typography } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import { PiDetails } from "../store/utils/types";
import { PiState, setPIdetails } from "../store/PiSlice";
import CodeMirror from '@uiw/react-codemirror';
import { json } from "@codemirror/lang-json";
import JsonEditor from "../components/JsonEditor";
import { isValidJson } from "../store/utils/helpers";
import { Save } from "@mui/icons-material";

function SchemaPage() {
    const details = useSelector((state: PiState) => state.details);
    const [localStore, setLocalStore] = useState({} as PiDetails);
    console.log('details = ', details);
    const [jsonValue, setJsonValue] = useState<string>(JSON.stringify(details));
    const [schemaError, setSchemaError] = useState<string>('');
    const [schemaSuccess, setSchemaSuccess] = useState<string>('');
    const dispatch = useDispatch();

    const handleJsonChange = (raw: string) => {
        if (!raw) {
            setJsonValue('');
            setLocalStore({} as PiDetails);
            setSchemaError('Invalid JSON schema');
        } else {
            const { isValid, parsed } = isValidJson(raw);
            setSchemaError(isValid ? '' : 'Invalid JSON schema');
            if (isValid && evaluateSchema(raw)) {
                setLocalStore(parsed);
                setSchemaError('');
                setSchemaSuccess('Success!');
                setJsonValue(JSON.stringify(parsed, null, 2)); // Format on valid input
            } else {
                setLocalStore({} as PiDetails);
                setSchemaError('Invalid PI schema');
            }
        }
    };

    const handleSave = () => {
        if (schemaSuccess === 'Success!' && localStore.teamName && localStore.PiStartDate) {
            dispatch(setPIdetails(localStore));
        }
    }

    const handleFormatClick = () => {
        try {
        const formatted = JSON.stringify(JSON.parse(jsonValue), null, 2);
        setJsonValue(formatted);
        setSchemaError('');
        } catch {
            setSchemaError('Invalid JSON or schema');
        }
    };

    const evaluateSchema = (editorValue: string): boolean => {
        try {
            const schema = JSON.parse(editorValue);
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
                return true;
            }
        }
        catch (error: any) {
            console.log('error parsing: ', error);
        }
        return false;
    }

    return (
        <Box sx={{ width: '90%', display: 'flex', justifyContent: 'center', flexDirection: 'column', margin: '10px' }}>
            <Typography>Paste the schema below.</Typography>
            {schemaError ? <Alert severity="error" variant="standard">{schemaError}</Alert>: null}
            {schemaSuccess && !schemaError ? <Alert severity="success" variant="standard">{schemaSuccess}</Alert> : null}
            <JsonEditor value={jsonValue} onChange={handleJsonChange} />
            <Box sx={{ display: 'flex', justifyContent: 'left', alignItems: 'center' }}>
                <Button variant="contained" onClick={handleFormatClick} style={{ margin: "10px", width: '200px' }}>
                    Format JSON
                </Button>
                <Button variant="contained" onClick={handleSave} style={{ margin: "10px", width: '200px' }} endIcon={<Save/>}>
                    Save
                </Button>
            </Box>
        </Box>
    );
}

export default SchemaPage;
