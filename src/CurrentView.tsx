import LandingScreen from "./pages/LandingScreen";
import PiDetails from "./pages/PiDetails";
import PIView from "./pages/PIView";
import SchemaPage from "./pages/SchemaPage";
import SprintsView from "./pages/SprintsView";
import { useSelector } from "react-redux";
import { PiDetails as PIDetails } from "./store/utils/types";

function CurrentView({
    pathname,
    navigate,
}: {
    pathname: String,
    navigate: (path: string | URL) => void;
}) {
   const data = useSelector((state: { details: PIDetails }) => state.details);
    switch(pathname) {
        case '/':
            return <LandingScreen />;
        case '/addDetails/form':
            return <PiDetails />;
        case '/addDetails/schema':
            return <SchemaPage />
        case '/piView':
            if (data?.teamName && data?.PiStartDate && data?.PiEndDate && data?.sprints.length) {
                return <PIView />
            }
        case '/sprintsView':
            if (data?.teamName && data?.PiStartDate && data?.PiEndDate && data?.sprints.length) {
                return <SprintsView />
            }
        default:
            return <>404 or Invalid Schema</>
    }
}

export default CurrentView;