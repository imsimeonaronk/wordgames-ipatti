import { FirebaseApp, initializeApp } from 'firebase/app';
import { getAnalytics, isSupported, logEvent } from 'firebase/analytics';
import {
    getAuth, signInWithPopup, signOut, GoogleAuthProvider,
    signInWithRedirect,
    Auth,
    getRedirectResult,
    onAuthStateChanged,
    FacebookAuthProvider,
    fetchSignInMethodsForEmail,
    linkWithCredential,
    signInWithEmailAndPassword,
    User
} from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import firebaseConfig from '../config/FireBase';

class FireBaseService {
    private static instance: FireBaseService;
    private app!: FirebaseApp;
    private provider!: GoogleAuthProvider;
    private auth!: Auth;
    public db: Firestore | undefined;
    private analytics: ReturnType<typeof getAnalytics> | null = null;

    // Constructor of FireBaseService
    private constructor() {

    }

    // Singleton pattern: only one instance of FireBaseService
    public static getInstance(): FireBaseService {
        if (!FireBaseService.instance) {
            FireBaseService.instance = new FireBaseService();
        }
        return FireBaseService.instance;
    }

    private initializeAppIfNeeded() {
        if (!this.app) {
            this.app = initializeApp(firebaseConfig);
            this.auth = getAuth(this.app);
            this.db = getFirestore(this.app);
            //Check analytics support
            isSupported().then((yes) => {
                if (yes) {
                    this.analytics = getAnalytics(this.app);
                }
            });
        }
    }

    public Init(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                this.initializeAppIfNeeded();
                this.checkStorageAccess();
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    private async checkStorageAccess() {
        if (document.hasStorageAccess && !document.hasStorageAccess()) {
            try {
                await document.requestStorageAccess();
                console.log("Third-party storage access granted");
            } catch (error) {
                console.error("Third-party storage access blocked", error);
            }
        } else {
            console.log("Third-party storage access either available or unsupported");
        }
    }

    public async logIn(listener: (success: boolean, user: any) => void) {
        this.provider = new GoogleAuthProvider();
        this.provider.setCustomParameters({
            //client_id: window.googleConfig.google.clientId
        });
        signInWithPopup(this.auth, this.provider)
            .then((result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential?.accessToken;
                const user = result.user;
                listener(true, user);
            })
            .catch(async (error) => {
                console.log("// LogIn Error //");
                console.log(error.code)
                if (error.code === 'auth/popup-blocked' ||
                    error.code === "auth/network-request-failed") {
                    try {
                        await signInWithRedirect(this.auth, this.provider);
                    } catch (reerror) {
                        console.error("Sign-in error:", reerror);
                        listener(false, null);
                    }
                } else {
                    console.log(error);
                    listener(false, null);
                }
            });
    }

    public async logInFB(listener: (success: boolean, user: any) => void) {
        const provider = new FacebookAuthProvider();
        await signInWithPopup(this.auth, provider).then((result) => {
            const credential = FacebookAuthProvider.credentialFromResult(result);
            const token = credential?.accessToken;
            const user = result.user;
            listener(true, user);
        })
            .catch(async (error) => {
                if (error.code === "auth/account-exists-with-different-credential") {
                    const pendingCred = FacebookAuthProvider.credentialFromError(error);
                    const email = error.customData?.email;
                    if (email && pendingCred) {
                        try {
                            const methods = await fetchSignInMethodsForEmail(this.auth, email);
                            console.log("Fetched sign-in methods:", methods);
                            if (methods.includes("password")) {
                                const password = prompt("Account exists with email/password. Please enter your password to link your Facebook account:");
                                if (password) {
                                    const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
                                    await linkWithCredential(userCredential.user, pendingCred);
                                    console.log("Facebook account linked successfully.");
                                    listener(true, userCredential.user);
                                } else {
                                    console.warn("Password was not entered by the user.");
                                    listener(false, null);
                                }
                            } else if (methods.includes("google.com")) {
                                alert("Account exists with Google. Please sign in using Google to link Facebook.");
                                listener(false, null);
                            } else if (methods.length > 0) {
                                alert(`Please sign in using one of the following methods: ${methods.join(", ")}`);
                                listener(false, null);
                            } else {
                                // No method associated with the email
                                alert("This email is not linked to any sign-in method.");
                                listener(false, null);
                            }
                        } catch (fetchError) {
                            console.error("Error fetching sign-in methods:", fetchError);
                            listener(false, null);
                        }
                    } else {
                        console.error("Missing email or pending credential.");
                        listener(false, null);
                    }
                } else {
                    console.error("Facebook login failed:", error);
                    listener(false, null);
                }
            });
    }

    public logOut(listener: () => void) {
        signOut(this.auth)
            .then(() => {
                listener();
            })
            .catch((error) => {
                console.log("// LogOut Error //");
                console.log(error);
            });
    }

    public async handleRedirectResult() {
        try {
            const result = await getRedirectResult(this.auth);
            if (result && result.user) {
                console.log("User from redirect result:", result.user);
                return result.user;
            } else {
                console.log("No redirect result available. Checking auth state...");
                return null;
            }
        } catch (error) {
            console.error("Error handling redirect result:", error);
            return null;
        }
    }

    public async getUserLogged(): Promise<User | null> {
        const auth = getAuth();
        return new Promise((resolve) => {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                unsubscribe(); // stop listening after first event
                resolve(user); // user may be null or User
            });
        });
    }

    // Analytics
    public logPageView(pageName: string){
        if (this.analytics) {
            logEvent(this.analytics, 'screen_view', {
                firebase_screen: pageName,
                firebase_screen_class: pageName,
            });
        }
    };

    public logCustomEvent(eventName: string, eventParams:any){
        if (this.analytics) {
            logEvent(this.analytics, eventName, eventParams);
        }
    };

}

// Use this instance across your app
export const FireBase = FireBaseService.getInstance();