import { Swiper, SwiperSlide } from 'swiper/react';
import { Grid, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/pagination';

const GameSlider: React.FC = () => {
    const icons = Array.from({ length: 12 }, (_, i) => `/assets/image/game-icon-${i + 1}.png`);

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
                        <img src={icon} alt={`icon-${index}`} className="grid-icon" />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default GameSlider;
