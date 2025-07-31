import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Page */
import NotFound from './pages/NotFound';
import Game from './pages/Game';

/* Component */
import useFontLoader from './hooks/fontLoader';

/* Theme variables */
import './theme/variables.css';
import './theme/fonts.css';
import { useEffect } from 'react';
import { FireBase } from './service/Firebase';

setupIonicReact();

const App: React.FC = () => {
    const fontsLoaded = useFontLoader();

    useEffect(()=>{
        
        // Initialize Firebase & Google
        const initializeFirebase = async () => {
            try {
                await FireBase.Init().then(() => {
                    console.log("Firebase initialized");
                }).catch((error) => {
                    console.log("Error initializing Firebase:", error);
                });
            } catch (error) {
                console.error('Fetch initializing Firebase:', error);
            }
        };
        initializeFirebase();

    });
    
    //Font load check
    if (!fontsLoaded) {
        return <div className="loading-overlay">Loading...</div>;
    }

    return(
        <IonApp>
            <IonReactRouter>
                <IonRouterOutlet>
                    <Route exact path="/*">
                        <NotFound />
                    </Route>
                    <Route exact path="/">
                        <Home />
                    </Route>
                    <Route exact path="/game">
                        <Game />
                    </Route>
                </IonRouterOutlet>
            </IonReactRouter>
        </IonApp>
    )
};

export default App;
