import { useEffect, useRef } from 'react';

const BackgroundMusic: React.FC = () => {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const audio = new Audio('/assets/audio/background-music.mp3');
        audio.loop = true;
        audio.volume = 0.4;
        audioRef.current = audio;

        const playMusic = () => {
            audio.play().catch(err => {
                console.log("Autoplay blocked, waiting for user interaction");
            });
        };
        playMusic();

        const handleInteraction = () => {
            if (audio.paused) audio.play();
            window.removeEventListener('click', handleInteraction);
        };
        window.addEventListener('click', handleInteraction);

        return () => {
            audio.pause();
            audioRef.current = null;
            window.removeEventListener('click', handleInteraction);
        };
    }, []);

    return null;
};

export default BackgroundMusic;
