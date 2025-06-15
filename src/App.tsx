import React from 'react';
import { Box } from '@mui/material';
import { createTheme, styled } from '@mui/material/styles';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DescriptionIcon from '@mui/icons-material/Description';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import GroupsIcon from '@mui/icons-material/Groups';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import ScheduleIcon from '@mui/icons-material/Schedule';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import SchemaIcon from '@mui/icons-material/Schema';
import { AppProvider, Navigation, Router } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import CurrentView from './CurrentView';

const NAVIGATION: Navigation = [
  {
    segment: 'addDetails',
    title: 'Add Details',
    icon: <DescriptionIcon />,
    children: [
      {
        segment: 'form',
        title: 'Form',
        icon: <LibraryAddIcon />,
      },
      {
        segment: 'schema',
        title: 'Schema',
        icon: <SchemaIcon/>
      }
    ]
  },
  {
    kind: 'divider',
  },
  {
    segment: 'piView',
    title: 'PI View',
    icon: <LightbulbIcon />,
  },
  {
    segment: 'sprints',
    title: 'Sprints',
    icon: <DirectionsRunIcon />,
  },
  {
    segment: 'stories',
    title: 'Stories',
    icon: <AssignmentIcon />,
  },
  {
    segment: 'estimations',
    title: 'Estimations',
    icon: <ScheduleIcon />,
  },
  {
    segment: 'teamMembers',
    title: 'Team Members',
    icon: <GroupsIcon />,
  },
];

function useDemoRouter(initialPath: string): Router {
  const [pathname, setPathname] = React.useState(initialPath);

  const router = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path: string | URL) => setPathname(String(path)),
    };
  }, [pathname]);

  return router;
}

const Skeleton = styled('div')<{ height: number }>(({ theme, height }) => ({
  backgroundColor: theme.palette.action.hover,
  borderRadius: theme.shape.borderRadius,
  height,
  content: '" "',
}));

function App(): React.JSX.Element {
  const router = useDemoRouter('/');

  const demoTheme = createTheme({
  colorSchemes: { light: true, dark: true },
  cssVariables: {
    colorSchemeSelector: 'class',
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

  return(
    <Box sx={{ minHeight: '100vh'}}>
      <AppProvider
        navigation={NAVIGATION}
        router={router}
        theme={demoTheme}
      >
      <DashboardLayout>
        <CurrentView pathname={router.pathname} navigate={router.navigate} />
      </DashboardLayout>
    </AppProvider>
    </Box>
  )
};

export default App;
