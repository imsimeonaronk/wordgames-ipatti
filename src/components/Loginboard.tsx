import { IonModal, IonButton, IonContent, IonHeader, IonTitle, IonToolbar } from "@ionic/react";
import LoginBoardType from "../interface/Loginboard";

const Loginboard: React.FC<LoginBoardType> = ({isOpen, onDismiss}) => {

    return (
        <IonModal isOpen={isOpen} onDidDismiss={onDismiss}>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Login</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <p>Log in to unlock more features!<br/><br/>We only use your username and email to save your progress and performance.<br/><br/></p>
                <IonButton className="spaced-button" expand="block" onClick={onDismiss} color={"danger"}>
                    Google
                </IonButton>
                <IonButton className="spaced-button" expand="block" onClick={onDismiss}>
                    Close
                </IonButton>
            </IonContent>
        </IonModal>
    );
};

export default Loginboard;
