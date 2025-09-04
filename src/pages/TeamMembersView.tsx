import { useSelector } from "react-redux";
import { PiDetails } from "../store/utils/types";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { Gauge } from "@mui/x-charts";

function TeamMembersView() {
    const members = useSelector((state: PiDetails) => state?.teamMembers);
    return (
    // <Box sx={{ height: '100%', margin: '10px 0px 10px 10px', width: '98%' }}>
    //     <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', flexWrap: 'wrap' }}>
    //         <Card sx={{ height: '250px', width: '340px', display: 'block', padding: '10px', marginTop: '10px' }}>
    //             <Typography sx={{textAlign: 'center'}} variant="h6" gutterBottom>xx</Typography>
    //             <CardContent sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
    //             <Gauge
    //                 width={150}
    //                 height={150}
    //                 value={getTotalStoryPoints(storiesInSprint, parseFloat(hoursPerDay))}
    //                 valueMin={0}
    //                 valueMax={getPossibleStoryPoints(dayjs(selectedSprint.start), dayjs(selectedSprint.end), holidays, members)}
    //                 text={({ value, valueMax }) => `${value} / ${valueMax}`}
    //             />
    //             </CardContent>
    //         </Card>
    //     </Box>
    // </Box>
    <></>
    );
}

export default TeamMembersView;