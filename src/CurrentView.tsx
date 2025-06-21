import LandingScreen from "./pages/LandingScreen";
import PiDetails from "./pages/PiDetails";
import PIView from "./pages/PIView";
import SchemaPage from "./pages/SchemaPage";
import SprintsView from "./pages/SprintsView";

function CurrentView({
    pathname,
    navigate,
}: {
    pathname: String,
    navigate: (path: string | URL) => void;
}) {
    switch(pathname) {
        case '/':
            return <LandingScreen />;
        case '/addDetails/form':
            return <PiDetails />;
        case '/addDetails/schema':
            return <SchemaPage />
        case '/piView':
            return <PIView />
        case '/sprintsView':
            return <SprintsView />
        default:
            return <>404 Page not found</>
    }
}

export default CurrentView;