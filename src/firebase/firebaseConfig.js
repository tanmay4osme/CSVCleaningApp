import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBS4B2_fQJgKa452HPw53xeMNh3omVJLtc",
  authDomain: "trafficsigndetectionapp-4ca6f.firebaseapp.com",
  projectId: "trafficsigndetectionapp-4ca6f",
  storageBucket: "trafficsigndetectionapp-4ca6f.appspot.com",
  messagingSenderId: "917884686957",
  appId: "1:917884686957:web:74c46a23a3016cbd3aa564",
  measurementId: "G-9ELX7GG98G"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const storage = getStorage(app);

export { auth, storage, app };