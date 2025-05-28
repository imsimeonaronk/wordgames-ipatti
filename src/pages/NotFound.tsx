import { IonContent, IonPage } from '@ionic/react';
import "./NotFound.css";

const NotFound: React.FC = () => {
    return (
        <IonPage>
            <IonContent fullscreen>
                <div className="not-found">
                    <img src="./assets/image/404.jpg" className="not-found-img"></img>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default NotFound;
