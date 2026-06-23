import React, { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,       
  signOut,                         
  onAuthStateChanged,             
  updateProfile,                   
} from "firebase/auth";
import { auth } from "../firebase/config";

// Step 1: Create the context (like a global variable holder)
const AuthContext = createContext();

// Step 2: Create the Provider component
// Wrap your whole app in this so every page can access user info
export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);   // current logged-in user (or null)
  const [loading, setLoading] = useState(true);  

  // Step 3: Listen for login/logout changes automatically
  // Firebase calls this whenever auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);   // set user (or null if logged out)
      setLoading(false);       // done checking
    });
    return unsubscribe; 
  }, []);

  // Step 4: Sign Up function
  // Creates account in Firebase Auth
  async function signUp(email, password, name) {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    // Save the display name to Firebase user profile
    await updateProfile(result.user, { displayName: name });
    return result;
  }

  // Step 5: Sign In function
  async function signIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Step 6: Sign Out function
  async function logOut() {
    return signOut(auth);
  }

  // Step 7: Share everything via context value
  const value = {
    user,           // the Firebase user object (has .email, .displayName, .uid)
    loading,    
    isLoggedIn: !!user, 
    signUp,
    signIn,
    logOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
