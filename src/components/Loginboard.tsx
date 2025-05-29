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
                <p>Please do login to access full features.</p>
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
