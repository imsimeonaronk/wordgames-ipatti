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
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Rank</th>
                            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Username</th>
                            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {scores.map((entry, index) => (
                            <tr key={index}>
                                <td style={{ border: "1px solid #ccc", padding: "8px", textAlign: "center" }}>
                                    {index + 1}
                                </td>
                                <td style={{ border: "1px solid #ccc", padding: "8px", textAlign: "center" }}>
                                    {entry.username}
                                </td>
                                <td style={{ border: "1px solid #ccc", padding: "8px", textAlign: "center" }}>
                                    {entry.score}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </IonContent>

        </IonModal>
    )
}

export default Leaderboard;