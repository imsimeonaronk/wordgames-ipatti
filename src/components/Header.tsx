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
                    <Button Src="./assets/image/leaderboardbtn.png" Click={()=>onClickLeaderboard} />
                    <Button Src="./assets/image/usericonbtn.png" Click={()=>onClickUser} />
                </div>
            </div>
        </div>
    )
}

export default Header;