

const Button: React.FC<ButtonType> = ({Src, Click})=> {
    return(
        <img src={Src} onClick={Click} className="header-button"/>
    )
}

export default Button;