const getToken = () => {
  const token = sessionStorage.getItem("authToken");
  if (token) {
    return token;
  } else {
    return null;
  }
};

export default getToken;