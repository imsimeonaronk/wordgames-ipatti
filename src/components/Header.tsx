import { useState } from "react";
import Button from "./Button";
import Loginboard from "./Loginboard";
import Leaderboard from "./Leaderboard";

const Header: React.FC = ()=> {
    const [openLB, setOpenLB] = useState(false);
    const [openLogin, setOpenLogin] = useState(false);

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

    return(
        <div className="header">
            <div className="header-box">
                <div className="header-box-left"></div>
                <div className="header-box-center"></div>
                <div className="header-box-right">
                    <Button Src="./assets/image/leaderboardbtn.png" Click={onClickLeaderboard} AnimDelay={0.6}/>
                    <Button Src="./assets/image/usericonbtn.png" Click={onClickUser} AnimDelay={0.2}/>
                </div>
                <Loginboard isOpen={openLogin} onDismiss={onLoginDismiss}/>
                <Leaderboard isOpen={openLB} onDismiss={onLBDismiss}/>
            </div>
        </div>
    )
}

export default Header;