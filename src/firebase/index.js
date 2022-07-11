import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import "firebase/compat/database";

const firebaseConfig = {
  apiKey: "AIzaSyBazt2gIqkdNpvU8e4t_oJD-BNq0tOtowM",
  databaseURL: "https://cs5990sp22-default-rtdb.firebaseio.com/",
  authDomain: "cs5990sp22.firebaseapp.com",
  projectId: "cs5990sp22",
  storageBucket: "cs5990sp22.appspot.com",
  messagingSenderId: "622617212731",
  appId: "1:622617212731:web:a9cf206aa33159a292291e",
  measurementId: "G-0YHMPKFEQW",
};
const firebaseApp = firebase.initializeApp(firebaseConfig);

const storage = firebase.storage(firebaseApp);
const database = firebase.database();

export { storage, database, firebase as default };
