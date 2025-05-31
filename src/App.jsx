import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import NavBar from "./components/NavBar";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import { getUserToken } from "./utils/auth";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = getUserToken();
  return isAuthenticated ? children : <Navigate to="/" />;
};

const App = () => {
  const isAuthenticated = getUserToken();

  return (
    <Router>
      {isAuthenticated && <NavBar />}
      <Routes>
        <Route path="/" element={<AuthPage />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />

        <Route
          path="*"
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/" />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
