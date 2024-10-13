const setAccessToken = (accessToken: string) => {
  localStorage.setItem("token", accessToken);
}

const removeAccessToken = () => {
  localStorage.removeItem("token");
}

const doLogout = () => {
  removeAccessToken();
}

const authService = {
  setAccessToken,
  doLogout,
}

export default authService;