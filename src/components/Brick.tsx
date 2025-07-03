import { Box, Button } from "@mui/material";

interface BrickProps {
  label: string;
  height: string;
  width: string;
  backgroundColor: string;
  borderColor: string;
  minWidth: string;
}

const Brick: React.FC<BrickProps> = ({ label, height, width, backgroundColor, borderColor, minWidth }) => {
  return (
    <Box sx={{
        height: height,
        width: width,
        minWidth: minWidth,
        backgroundColor: backgroundColor,
        border: `2px solid ${borderColor}`,
      }}
    >
      {label}
    </Box>
  );
};

export default Brick;