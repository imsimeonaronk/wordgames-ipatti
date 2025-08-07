import { IonModal, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonIcon } from "@ionic/react";
import LeaderBoardType from "../interface/Leaderboard";
import { close } from "ionicons/icons";
import { useEffect, useState } from "react";
import { FireBase } from "../service/Firebase";

const Leaderboard: React.FC<LeaderBoardType> = ({ isOpen, onDismiss }) => {
    const [scores, setScores] = useState<{ username: string; score: number }[]>([]);

    useEffect(() => {
        async function fetchScores() {
            const topScores = await FireBase.getTopScores(10);
            setScores(topScores as any);
        }
        fetchScores();
    }, []);

    
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
                <ul>
                    {
                        scores.map((entry, index) => (
                            <li key={index}>
                                {index + 1}. {entry.username} - {entry.score}
                            </li>
                        ))
                    }
                </ul>
            </IonContent>
        </IonModal>
    )
}

export default Leaderboard;