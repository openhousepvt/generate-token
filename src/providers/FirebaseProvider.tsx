import { LinearProgress } from "@mui/material";
import {
  User,
  getAuth,
  ApplicationVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";
import React, { useCallback, useEffect, useState } from "react";

type FirebaseContextType = {
  user?: User | null;
  signIn: (phone: string, verifier: ApplicationVerifier) => Promise<void>;
  verifyOtp: (otp: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const FirebaseContent = React.createContext<FirebaseContextType>({
  user: undefined,
  signIn: () => Promise.reject("Not implemented"),
  verifyOtp: () => Promise.reject("Not implemented"),
  logout: () => Promise.reject("Not implemented"),
});

const FirebaseProvider: React.FC = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>();
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);
  const [firebaseLoading, setFirebaseLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    return auth.onAuthStateChanged((user) => {
      setFirebaseLoading(false);
      setFirebaseUser(user);
    });
  }, []);

  const signIn = useCallback(
    (phonenumber: string, appVerifier: ApplicationVerifier) => {
      const auth = getAuth();
      return signInWithPhoneNumber(auth, phonenumber, appVerifier).then(
        (confirmationResult) => {
          setConfirmationResult(confirmationResult);
        }
      );
    },
    []
  );

  const verifyOtp = useCallback(
    (otp: string) => {
      if (confirmationResult) {
        return confirmationResult.confirm(otp).then(() => {
          setConfirmationResult(null);
        });
      }
      return Promise.reject("No confirmation result");
    },
    [confirmationResult]
  );

  const logout = useCallback(() => {
    const auth = getAuth();
    return auth.signOut();
  }, []);

  const value = {
    user: firebaseUser,
    signIn: signIn,
    verifyOtp: verifyOtp,
    logout: logout,
  };

  if (firebaseLoading) {
    return <LinearProgress />;
  }

  return (
    <FirebaseContent.Provider value={value}>
      {children}
    </FirebaseContent.Provider>
  );
};

export default FirebaseProvider;
