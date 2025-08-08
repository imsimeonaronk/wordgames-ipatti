import { IonModal, IonButton, IonContent, IonHeader, IonTitle, IonToolbar } from "@ionic/react";
import LoginBoardType from "../interface/Loginboard";
import { FireBase } from "../service/Firebase";
import { useUserLogin } from "../context/UserLogin";
import { Gvar } from "../game/utils/Gvar";

const Loginboard: React.FC<LoginBoardType> = ({isOpen, onDismiss}) => {
    const { user, login, logout } = useUserLogin();

    const signIn = ()=>{
        FireBase.logIn((success, user)=>{
            if(success){
                //Login Hook
                login({
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                });
                // Update value to the Gvar
                Gvar.LoggedUser.name = user.displayName;
                Gvar.LoggedUser.email = user.email;
                //Dismiss panel
                onDismiss();
            }
        });
    }

    const signOut = ()=>{
        FireBase.logOut(()=>{
            //Logout Hook
            logout();
            //Dismiss panel
            onDismiss();
        });
    }

    return (
        <IonModal isOpen={isOpen} onDidDismiss={onDismiss}>
            <IonHeader>
                <IonToolbar>
                    {
                        !user ?
                        <>
                            <IonTitle>Login</IonTitle>
                        </>
                        :
                        <>
                            <IonTitle>Logout</IonTitle>
                        </>
                    }
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                {
                    !user ?
                    <>
                        <p>Log in to unlock more features!<br/><br/>We only use your username and email to save your progress and performance.<br/><br/></p>
                        <IonButton className="spaced-button" expand="block" onClick={signIn} color={"danger"}>
                            Google
                        </IonButton>
                        <IonButton className="spaced-button" expand="block" onClick={onDismiss}>
                            Close
                        </IonButton>
                    </>
                    :
                    <>
                        <p>You’re now logged out.<br/><br/>Log back in anytime to continue saving your progress and enjoying all features."<br/><br/></p>
                        <IonButton className="spaced-button" expand="block" onClick={signOut} color={"danger"}>
                            Logout
                        </IonButton>
                    </>
                }
            </IonContent>
        </IonModal>
    );
};

export default Loginboard;
