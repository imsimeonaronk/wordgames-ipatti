import { useEffect, useState } from "react";
import Button from "./Button";
import Loginboard from "./Loginboard";
import Leaderboard from "./Leaderboard";
import { motion } from "framer-motion";
import MusicButton from "./MusicButton";
import { useUserLogin } from "../context/UserLogin";

const Header: React.FC = ()=> {
    const [openLB, setOpenLB] = useState(false);
    const [openLogin, setOpenLogin] = useState(false);
    const { user } = useUserLogin();

    /* Leaderboard User */
    const onClickLeaderboard = ()=> {
        setOpenLB(true);
    }

    const onLBDismiss = ()=> {
        setOpenLB(false);
    }

    /* Login User */
    const onClickUser = ()=> {
        setOpenLogin(true);
    }

    const onLoginDismiss = ()=> {
        setOpenLogin(false);
    }

    /* Music */
    const onClickMusic = ()=>{
        
    }

    useEffect(()=>{
        
    },[]);

    return(
        <div className="header">
            <div className="header-box">
                <div className="header-box-left">
                    <motion.img
                        src="/assets/image/page-logo.png"
                        className="page-logo"
                        initial={{ scale: 0.2, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.1}}
                    />
                </div>
                <div className="header-box-center"></div>
                <div className="header-box-right">
                    <MusicButton Src="" Click={onClickMusic} AnimDelay={1.0}/>
                    <Button Src="./assets/image/leaderboardbtn.png" Click={onClickLeaderboard} AnimDelay={0.6}/>
                    {
                        !user ? 
                        <>
                            <Button Src="./assets/image/usericonbtn.png" Click={onClickUser} AnimDelay={0.2}/>
                        </>
                        :
                        <>
                            <Button Src={user.photoURL!} Click={onClickUser} AnimDelay={0.2}/>
                        </>
                    }
                </div>
                <Loginboard isOpen={openLogin} onDismiss={onLoginDismiss}/>
                <Leaderboard isOpen={openLB} onDismiss={onLBDismiss}/>
            </div>
        </div>
    )
}

export default Header;