import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// TODO: replace with your web app config from Firebase console
const firebaseConfig = {
  // Web API Key provided by you
  apiKey: "BCsXVRGJwD8l7KVT_UQCObUa8TZyUNLPXxIWwCUQpAP4Bh-BpYv35S2LOkcORqwE6idupYPctct3l3OISczvfpQ",
  // TODO: Replace the values below from Firebase console → Project settings → General → Your apps (Web app)
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);


