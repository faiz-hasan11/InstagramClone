import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyAHYKnn0s9r34kY4U_8SjPPU1z77RSk7BM",
  authDomain: "instagram-clone-f5dec.firebaseapp.com",
  databaseURL: "https://instagram-clone-f5dec-default-rtdb.firebaseio.com",
  projectId: "instagram-clone-f5dec",
  storageBucket: "instagram-clone-f5dec.appspot.com",
  messagingSenderId: "764720754389",
  appId: "1:764720754389:web:71696c6d98fe2dfb46bc5c",
  measurementId: "G-Q688BYWE0C"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };