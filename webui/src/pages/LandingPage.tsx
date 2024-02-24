import { useAuth } from "../components/AuthContext";
import LoggedInLanding from "../components/LoggedInLanding";
import NotLoggedInLanding from "../components/NotLoggedInLanding";

const LandingPage: React.FC = () => {
  const { isLoggedIn } = useAuth();
  return <>{isLoggedIn ? <LoggedInLanding /> : <NotLoggedInLanding />}</>;
};

export default LandingPage;
