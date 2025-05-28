import Button from "./Button";

const Header: React.FC = ()=> {

    const onClickLeaderboard = ()=> {

    }

    const onClickUser = ()=> {

    }

    return(
        <div className="header">
            <div className="header-box">
                <div className="header-box-left"></div>
                <div className="header-box-center"></div>
                <div className="header-box-right">
                    <Button Src="./assets/image/leaderboardbtn.png" Click={()=>onClickLeaderboard} AnimDelay={0.6}/>
                    <Button Src="./assets/image/usericonbtn.png" Click={()=>onClickUser} AnimDelay={0.2}/>
                </div>
            </div>
        </div>
    )
}

export default Header;