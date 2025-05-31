import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearAuthData, getUserData } from "../utils/auth";

const Navbar = () => {
  const navigate = useNavigate();
  const userData = getUserData();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      clearAuthData();
      setIsLoggingOut(false);
      navigate("/");
    }, 500);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-indigo-600 to-purple-700 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-2xl font-bold">Technical Test</div>
        <div className="flex items-center space-x-4">
          {userData && (
            <span className="text-white text-md font-medium">
              Halo, {userData.email}!
            </span>
          )}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center justify-center bg-white text-indigo-700 hover:bg-gray-100 px-4 py-2 rounded-full text-sm font-semibold transition duration-200 ease-in-out shadow disabled:opacity-75"
          >
            {isLoggingOut ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="black"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="black"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Logging out...</span>
              </>
            ) : (
              "Logout"
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
