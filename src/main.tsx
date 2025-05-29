import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { UserLoginProvider } from './context/UserLogin';
import { MusicProvider } from './context/BackgroundMusic';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
    <React.StrictMode>
        <UserLoginProvider>
            <MusicProvider>
                <App />
            </MusicProvider>
        </UserLoginProvider>
    </React.StrictMode>
);