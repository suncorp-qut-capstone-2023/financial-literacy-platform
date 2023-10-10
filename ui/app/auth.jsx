import React, { createContext, useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  // Hardcoded token for now
  // user token
  // const storedToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEwMSwidXNlclR5cGUiOiJ1c2VyIiwiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIiwiZXhwIjoxNjk2OTI5MDkzNzYwLCJpYXQiOjE2OTY4NDI2OTN9.S-2pEnG4C6ATmW5ySb6uJ5VIxeEIw2Hct3PJAv_xWsU";
  // admin token
  const storedToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEwMiwidXNlclR5cGUiOiJhZG1pbiIsImVtYWlsIjoidXNlcmFAZXhhbXBsZS5jb20iLCJleHAiOjE2OTcwMTU3ODUxNjMsImlhdCI6MTY5NjkyOTM4NX0.JcirHCs8Qky2hda6ou9aMGOGVkj9GtF4YUcIAUUmu_g";
  
  localStorage.setItem('token', storedToken);
  
  const [authToken, setAuthToken] = useState(storedToken);
  const [userType, setUserType] = useState(null); // Store user type here

  useEffect(() => {
    if (authToken) {
      try {
        const decodedToken = jwtDecode(authToken);
        setUserType(decodedToken.userType);
        console.log(userType)
      } catch (error) {
        console.error('Failed to decode the token', error);
      }
    }
  }, [authToken]);

  useEffect(() => {
    console.log(userType); // This will log the updated userType
}, [userType]); // This effect runs every time userType changes

  return (
    <AuthContext.Provider value={{ authToken, setAuthToken, userType }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
