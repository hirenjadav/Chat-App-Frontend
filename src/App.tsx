import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SignUp from "./components/SignUp";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import HomePage from "./pages/HomePage/HomePage";
import Login from "./components/Login/Login";
import ChatHomePage from "./pages/ChatHomePage/ChatHomePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/auth/login" replace />} />
        <Route path="/auth" Component={HomePage}>
          <Route path="login" Component={Login} />
          <Route path="signup" Component={SignUp} />
          <Route path="forgot-password" Component={ForgotPassword} />
        </Route>
        <Route path="/chat" Component={ChatHomePage}></Route>
        <Route path="/chat/:id" Component={ChatHomePage}></Route>
      </Routes>
    </Router>
  );
}

export default App;
