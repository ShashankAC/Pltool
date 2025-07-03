import { Box } from "@mui/material";
import Brick from "./Brick";
import React, { useEffect, useState } from 'react';
import { generateColors } from "../store/utils/helpers";
import { BrickUnit } from "../store/utils/types";

interface GlowBricksProps {
  targets: BrickUnit[];
  sources: BrickUnit[];
  brickMinWidth: string;
  brickHeight: string;
  brickWidth: string;
  backgroundColor?: string;
  brickBorderColor: string;
}

const GlowBricks: React.FC<GlowBricksProps> = ({
  targets,
  sources,
  brickMinWidth,
  brickHeight,
  brickWidth,
  brickBorderColor
}) => {
  const [brickColors, setBrickColors] = useState<Array<string>>([]);
  useEffect(() => {
    setBrickColors(generateColors(sources.length));
  }, []);

  const mapSourceColorToTarget = (targetId: string): string => {
    const source  = sources.find((source) => source.id === targetId) || {} as BrickUnit
    return brickColors[sources.indexOf(source)]
  }

  return (
    <Box 
        sx={{
            width: '95%',
            height: '500px',
            padding: "10px",
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between'
        }}
        >
        <Box sx={{ width: '25%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {sources.map((source, i) =>  <Brick
                                      key={source.id}
                                      label={source.title}
                                      backgroundColor={brickColors[i]}
                                      borderColor={brickBorderColor}
                                      height={brickHeight}
                                      width={brickWidth}
                                      minWidth={brickMinWidth}
                                    />
            )}
        </Box>
        <Box sx={{ width: '45%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {targets.map((target) =>  <Brick
                                        key={target.id}
                                        label={target.title}
                                        borderColor="blue"
                                        backgroundColor={mapSourceColorToTarget(target.id)}
                                        height={brickHeight}
                                        width={brickWidth}
                                        minWidth={brickMinWidth}
                                      />
            )}
        </Box>
    </Box>
  );
};

export default GlowBricks;