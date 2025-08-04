import { motion } from "framer-motion";
import { useMusic } from "../context/BackgroundMusic";


const MusicButton: React.FC<ButtonType> = ({ Src, AnimDelay, Click }) => {
    const { isPlaying, toggleMusic } = useMusic();
    return (
        <motion.img
            src={isPlaying ? "/assets/image/musiconbtn.png" : "/assets/image/musicoffbtn.png"}
            onClick={() => {
                toggleMusic();
                Click();
            }}
            className="header-button"
            initial={{ scale: 0.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeInOut', delay: AnimDelay }}
        />
    )
}

export default MusicButton;