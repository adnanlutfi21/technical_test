
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";
import AuthForm from "../components/auth/AuthForm";
import { saveUserData, saveUserToken } from "../utils/auth";
const AuthPage = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await apiClient.post("/login", { email, password });
      console.log("Login successful:", response.data);
      saveUserToken(response.data.token);

      saveUserData({ email: email });
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage(
        error.response?.data?.error ||
          "Login gagal. Periksa email dan password Anda."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (email, password) => {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const response = await apiClient.post("/register", { email, password });
      console.log("Register successful:", response.data);

      setSuccessMessage("Registrasi berhasil! Silakan login dengan akun Anda.");
      setActiveTab("login");
    } catch (error) {
      console.error("Register error:", error);
      setErrorMessage(
        error.response?.data?.error || "Registrasi gagal. Coba lagi."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex mb-6">
          <button
            className={`flex-1 py-3 px-4 text-sm font-semibold text-center focus:outline-none transition-all duration-300 ease-in-out
              ${
                activeTab === "login"
                  ? "text-purple-600 border-b-4 border-purple-600"
                  : "text-gray-500 hover:text-purple-500 border-b-4 border-transparent hover:border-purple-200"
              }`}
            onClick={() => {
              setActiveTab("login");
              setErrorMessage("");
            }}
          >
            Login
          </button>

          <button
            className={`flex-1 py-3 px-4 text-sm font-semibold text-center focus:outline-none transition-all duration-300 ease-in-out
              ${
                activeTab === "register"
                  ? "text-purple-600 border-b-4 border-purple-600"
                  : "text-gray-500 hover:text-purple-500 border-b-4 border-transparent hover:border-purple-200"
              }`}
            onClick={() => {
              setActiveTab("register");
              setErrorMessage("");
            }}
          >
            Register
          </button>
        </div>

        {successMessage && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">{successMessage}</span>
          </div>
        )}

        {activeTab === "login" ? (
          <AuthForm
            type="login"
            onSubmit={handleLogin}
            isLoading={isLoading}
            errorMessage={errorMessage}
          />
        ) : (
          <AuthForm
            type="register"
            onSubmit={handleRegister}
            isLoading={isLoading}
            errorMessage={errorMessage}
          />
        )}
      </div>
    </div>
  );
};

export default AuthPage;
