import { createContext, useContext, useEffect, useRef, useState } from 'react';

const MusicContext = createContext<any>(null);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(true);

    useEffect(() => {
        const audio = new Audio('/assets/audio/background-music.mp3');
        audio.loop = true;
        audio.volume = 0.4;
        audioRef.current = audio;

        const tryPlay = () => {
            audio.play().then(()=>setIsPlaying(true)).catch(() => console.log('Autoplay blocked'));
        };
        tryPlay();

        const resumeOnClick = () => {
            if (audio.paused) audio.play().then(()=>setIsPlaying(true));
            window.removeEventListener('click', resumeOnClick);
        };
        window.addEventListener('click', resumeOnClick);

        const pauseAudio = () => {
            if (!audio.paused) {
                audio.pause();
                setIsPlaying(false);
            }
        };

        const resumeAudio = () => {
            audio.play().then(()=>setIsPlaying(true)).catch(() => console.log('User interaction needed to resume audio'));
        };

        const handleVisibilityChange = () => {
            if (document.hidden) pauseAudio();
            else resumeAudio();
        };

        window.addEventListener('blur', pauseAudio);
        window.addEventListener('focus', resumeAudio);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            audio.pause();
            setIsPlaying(false);
            window.removeEventListener('click', resumeOnClick);
            window.removeEventListener('blur', pauseAudio);
            window.removeEventListener('focus', resumeAudio);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    const toggleMusic = () => {
        const audio = audioRef.current;
        if (audio!.paused) {
            audio!.play();
            setIsPlaying(true);
        } else {
            audio!.pause();
            setIsPlaying(false);
        }
    };

    return (
        <MusicContext.Provider value={{ isPlaying, toggleMusic }}>
            {children}
        </MusicContext.Provider>
    );
};

export const useMusic = () => useContext(MusicContext);