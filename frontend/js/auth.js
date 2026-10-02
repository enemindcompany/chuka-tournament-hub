import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

import {
    initializeApp,
    getApps
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";

import {
    FIREBASE_CONFIG
} from "./config.js";


/*
 * =========================================
 * FIREBASE
 * =========================================
 */

const firebaseApp =
    getApps().length > 0
        ? getApps()[0]
        : initializeApp(FIREBASE_CONFIG);

const auth = getAuth(firebaseApp);

const googleProvider =
    new GoogleAuthProvider();

googleProvider.setCustomParameters({
    prompt: "select_account"
});


/*
 * =========================================
 * GOOGLE SIGN-IN
 * =========================================
 */

export async function signInWithGoogle() {

    const result =
        await signInWithPopup(
            auth,
            googleProvider
        );

    return result.user;
}


/*
 * =========================================
 * SIGN OUT
 * =========================================
 */

export async function logout() {

    await signOut(auth);
}


/*
 * =========================================
 * AUTH STATE
 * =========================================
 */

export function watchAuthState(callback) {

    return onAuthStateChanged(
        auth,
        callback
    );
}


/*
 * =========================================
 * FIREBASE ID TOKEN
 * =========================================
 */

export async function getFirebaseIdToken() {

    const user = auth.currentUser;

    if (!user) {
        throw new Error(
            "No authenticated Chuka user."
        );
    }

    return await user.getIdToken();
}