const setAccessToken = (accessToken: string) => {
  localStorage.setItem("token", accessToken);
};

const removeAccessToken = () => {
  localStorage.removeItem("token");
};

const doLogout = () => {
  removeAccessToken();
  localStorage.clear();
};

const authService = {
  setAccessToken,
  doLogout,
};

export default authService;
