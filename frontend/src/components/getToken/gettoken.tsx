const getToken = () => {
  const token = sessionStorage.getItem("token");
  if (token) {
    return token;
  } else {
    return null;
  }
};

export default getToken;