import React, { createContext, useContext, useState, ReactNode } from 'react';
import User from '../interface/User';
import UserLoginContextType from '../interface/UserLogin';

// Create the context
const UserLoginContext = createContext<UserLoginContextType | undefined>(undefined);

// Create the provider
export const UserLoginProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    const login = (userData: User) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <UserLoginContext.Provider value={{ user, login, logout }}>
            {children}
        </UserLoginContext.Provider>
    );
};

// Custom hook to use context
export const useUserLogin = () => {
    const context = useContext(UserLoginContext);
    if (!context) {
        throw new Error('useUserLogin must be used within a UserLoginProvider');
    }
    return context;
};
