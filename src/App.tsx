import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn/SignIn";
import AuthPageWrapper from "./components/AuthPageWrapper/AuthPageWrapper";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";

function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<Navigate to="/auth/signin" replace />} />
      <Route path="/auth" Component={AuthPageWrapper} >
        <Route path="signin" Component={SignIn} />
        <Route path="signup" Component={SignUp} />
        <Route path="forgot-password" Component={ForgotPassword} />
      </Route>
    </Routes>
  </Router>
  );
}

export default App
