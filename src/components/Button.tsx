import { motion } from "framer-motion";


const Button: React.FC<ButtonType> = ({Src, AnimDelay, Click})=> {
    return(
        <motion.img
            src={Src}
            onClick={Click}
            className="header-button"
            initial={{ scale: 0.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeInOut', delay: AnimDelay}}
        />
    )
}

export default Button;