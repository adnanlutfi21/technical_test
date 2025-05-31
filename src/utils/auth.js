export const saveUserToken = (token) => {
  localStorage.setItem("userToken", token);
};

export const getUserToken = () => {
  return localStorage.getItem("userToken");
};

export const removeUserToken = () => {
  localStorage.removeItem("userToken");
};

export const saveUserData = (userData) => {
  localStorage.setItem("userData", JSON.stringify(userData));
};

export const getUserData = () => {
  const userData = localStorage.getItem("userData");
  return userData ? JSON.parse(userData) : null;
};

export const clearAuthData = () => {
  localStorage.removeItem("userToken");
  localStorage.removeItem("userData");
};
