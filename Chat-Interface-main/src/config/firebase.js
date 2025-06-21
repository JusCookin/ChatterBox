import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { getFirestore, setDoc, doc } from 'firebase/firestore'
import { toast } from "react-toastify";

const firebaseConfig = {
    apiKey: "AIzaSyCCY2VP2HX0Hq0W2rho9qbdM6O5EYmL3Ik",
    authDomain: "chat-app-gs-9be98.firebaseapp.com",
    projectId: "chat-app-gs-9be98",
    storageBucket: "chat-app-gs-9be98.firebasestorage.app",
    messagingSenderId: "131193550127",
    appId: "1:131193550127:web:2be6917b2b17d0fb561dda"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signUp = async(username, email, password) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        await setDoc(doc(db, "users", user.uid), {
            id: user.uid,
            username: username.toLowerCase(),
            email,
            name: "",
            avatar: "",
            bio: "Hey There I am using chat app",
            lastSeen: Date.now()
        })
        await setDoc(doc(db, "chats", user.uid), {
            chatsData: []
        })
    } catch (error) {
        console.error(error)
        toast.error(error.code.split('/')[1].split('-').join(" "));
    }
}

const login = async(email, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
        console.log(error);
        toast.error(error.code.split('/')[1].split('-').join(" "));
    }
}

const logout = async() => {
    try {
        await signOut(auth);
    } catch (error) {
        console.log(error);
        toast.error(error.code.split('/')[1].split('-').join(" "));
    }
}

export { signUp, login, logout, auth, db };