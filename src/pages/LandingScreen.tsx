import { Box, Typography } from "@mui/material";
function LandingScreen(): React.JSX.Element {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center', height: '100vh' }}>
            <Typography>PI Planning Tool</Typography>
        </Box>
    )
}

export default LandingScreen;