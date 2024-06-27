import React from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const Login = () => {
  const handleLogin = () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then((result) => {
        console.log('Logged in:', result.user);
      })
      .catch((error) => {
        console.error('Login error:', error);
      });
  };

  return (
    <button onClick={handleLogin}>Login with Google</button>
  );
};

export default Login;
