import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { UserLoginProvider } from './context/UserLogin';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
    <React.StrictMode>
        <UserLoginProvider>
            <App />
        </UserLoginProvider>
    </React.StrictMode>
);