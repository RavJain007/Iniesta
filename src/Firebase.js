import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyALawQTQ0xmDEhQfzC4IqSyevb1n4mHlrw",
  authDomain: "inesta-25c23.firebaseapp.com",
  databaseURL: "https://inesta-25c23.firebaseio.com",
  projectId: "inesta-25c23",
  storageBucket: "inesta-25c23.appspot.com",
  messagingSenderId: "127452456870",
  appId: "1:127452456870:web:a8d7508ed44f965622d167",
  measurementId: "G-508ENSHJRF"
});

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db, auth, storage};