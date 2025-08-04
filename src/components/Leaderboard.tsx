import { IonModal, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonIcon } from "@ionic/react";
import LeaderBoardType from "../interface/Leaderboard";
import { close } from "ionicons/icons";

const Leaderboard: React.FC<LeaderBoardType> = ({ isOpen, onDismiss }) => {
    return (
        <IonModal isOpen={isOpen} onDidDismiss={onDismiss}>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>LeaderBoard</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={onDismiss}>
                            <IonIcon icon={close} />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">

            </IonContent>
        </IonModal>
    )
}

export default Leaderboard;