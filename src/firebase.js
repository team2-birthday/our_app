import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAR57uycl4Nj1kn0XMIuzEfycwk-9q1PaQ",
  authDomain: "ourapp-7daf2.firebaseapp.com",
  projectId: "ourapp-7daf2",
  storageBucket: "ourapp-7daf2.appspot.com",
  messagingSenderId: "1093103247062",
  appId: "1:1093103247062:web:7720db6a9bfd58bebd7377",
  measurementId: "G-WC4656FBWB",
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
