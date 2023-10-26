"use client";

import React, { createContext, useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  // Hardcoded token for now
  // user token
  // const storedToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEwMSwidXNlclR5cGUiOiJ1c2VyIiwiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIiwiZXhwIjoxNjk2OTI5MDkzNzYwLCJpYXQiOjE2OTY4NDI2OTN9.S-2pEnG4C6ATmW5ySb6uJ5VIxeEIw2Hct3PJAv_xWsU";
  // admin token

  const [auth, setAuth] = useState(false);
  const [authToken, setAuthToken] = useState(window.localStorage.getItem('token'));
  const [userType, setUserType] = useState(''); // Store user type here

  useEffect(() => {
    if (authToken !== null) {
      try {
        setAuth(true);
        const decodedToken = jwtDecode(authToken);
        setUserType(decodedToken.userType);
        localStorage.setItem('userType', userType);
      } catch (error) {
        console.error('Failed to decode the token', error);
      }
    }
  }, [authToken]);

  useEffect(() => {
    console.log("Check userType")
    console.log(userType)// This will log the updated userType
  }, [userType]); // This effect runs every time userType changes

  useEffect(() => {
    console.log("Check authentication")
    console.log(authToken)
    console.log(auth)
    // This will log the updated userType
  }, [auth]); // This effect runs every time userType changes

  return (
    <AuthContext.Provider value={{ authToken, setAuthToken, userType, auth, setAuth, setUserType }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
