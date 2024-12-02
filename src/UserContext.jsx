// UserContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser)); // Load user data from localStorage
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user)); // Store user data in localStorage
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = (userDetails, token) => {
    // Deconstruct user details (firstName, lastName, email, userId)
    const { firstName, lastName, email, userId } = userDetails;

    // Update state with user details
    setUser({ firstName, lastName, email, userId });

    // Store token separately in localStorage
    localStorage.setItem('token', token);

    // Store user details in localStorage
    localStorage.setItem('user', JSON.stringify({ firstName, lastName, email, userId }));
  };

  const logout = () => {
    // Clear user data and token
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
