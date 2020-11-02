import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyDgdnXJh82dOCnQYlNZzWatCXcXGw8RA1U",
  authDomain: "imessage-276fd.firebaseapp.com",
  databaseURL: "https://imessage-276fd.firebaseio.com",
  projectId: "imessage-276fd",
  storageBucket: "imessage-276fd.appspot.com",
  messagingSenderId: "926703157474",
  appId: "1:926703157474:web:762881fde0a6572fdedebb",
  measurementId: "G-XQFXP2EMEZ"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
export default db;