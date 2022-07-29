import { useContext } from "react";
import { FirebaseContent } from "../providers/FirebaseProvider";

const useFirebase = () => {
  return useContext(FirebaseContent);
};

export default useFirebase;
