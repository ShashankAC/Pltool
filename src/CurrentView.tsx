import LandingScreen from "./pages/LandingScreen";
import PiDetails from "./pages/PiDetails";
import PIView from "./pages/PIView";
import SchemaPage from "./pages/SchemaPage";

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
        default:
            return <>404 Page not found</>
    }
}

export default CurrentView;