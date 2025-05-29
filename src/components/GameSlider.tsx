import { Swiper, SwiperSlide } from 'swiper/react';
import { Grid, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/pagination';
import { delay, motion, useAnimation } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router';

const GameSlider: React.FC = () => {
    const icons = Array.from({ length: 12 }, (_, i) => `/assets/image/game-icon-${i + 1}.png`);
    const sfxPlayed = useRef(false);
    const history = useHistory();
    
    useEffect(()=>{
        
    },[]);

    const playSfx = () => {
        if (!sfxPlayed.current) {
            const audio = new Audio('./assets/audio/sfx/pop.mp3'); // replace with your path
            audio.play();
            sfxPlayed.current = true;
        }
    };

    const playHoverSfx = ()=> {
        const audio = new Audio('./assets/audio/sfx/boing.mp3'); // replace with your path
        audio.volume = 0.2;
        audio.play();
    }

    const clickIcon = ()=> {
        history.push("/game");
    }

    return (
        <div className="slider-wrapper">
            <Swiper
                modules={[Grid, Pagination]}
                pagination={{ clickable: true }}
                spaceBetween={10}
                slidesPerGroup={6}
                grid={{ rows: 2, fill: 'row' }}
                breakpoints={{
                    0: {
                        slidesPerView: 2,
                        grid: { rows: 3 },
                        slidesPerGroup: 6,
                    },
                    600: {
                        slidesPerView: 3,
                        grid: { rows: 2 },
                        slidesPerGroup: 6,
                    },
                    1024: {
                        slidesPerView: 3,
                        grid: { rows: 2 },
                        slidesPerGroup: 6,
                    },
                }}
            >
                {icons.map((icon, index) => (
                    <SwiperSlide key={index}>
                        <motion.img 
                            src={icon} 
                            alt={`icon-${index}`} 
                            className="grid-icon" 
                            initial={{ scale: 0.5, opacity: 0, y:-100 }}
                            animate={{ scale: 1, opacity: 1, y:0 }}
                            whileHover={{ scale: 1.1, transition: { duration: 0.1, delay: 0 }, }}
                            whileTap={{ scale: 0.95, transition: { duration: 0.1, delay: 0 }, }}
                            onAnimationStart={playSfx}
                            transition={{
                                scale: { duration: 0.3, ease: 'easeOut' }, // quick scale
                                y: { type: 'spring', stiffness: 500, damping: 20, delay: index * 0.07 }, // spring only for y
                                opacity: { duration: 0.4, delay: index * 0.07 },
                            }}
                            onMouseEnter={playHoverSfx} 
                            onClick={clickIcon}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default GameSlider;
