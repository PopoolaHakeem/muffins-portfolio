// ========================================
// 1. IMPORT FIREBASE SERVICES
// ========================================

import {
    initializeApp
} from "firebase/app";
import {
    getAuth
} from "firebase/auth";
import {
    getFirestore
} from "firebase/firestore";

// ========================================
// 2. FIREBASE CONFIGURATION
// ========================================

const firebaseConfig = {
    apiKey: "AIzaSyA6FAYZzJMKf8HxpWQbYs3RXVwFLzoNDI8",
    authDomain: "client-dashboard-25deb.firebaseapp.com",
    projectId: "client-dashboard-25deb",
    storageBucket: "client-dashboard-25deb.firebasestorage.app",
    messagingSenderId: "524180510044",
    appId: "1:524180510044:web:8d42e58f8b1fb85e65dd99"
};

// ========================================
// 3. INITIALIZE FIREBASE
// ========================================

const app = initializeApp(firebaseConfig);

// ========================================
// 4. INITIALIZE AUTHENTICATION
// ========================================

const auth = getAuth(app);

// ========================================
// 5. INITIALIZE FIRESTORE
// ========================================

const db = getFirestore(app);

// ========================================
// 6. EXPORT FIREBASE SERVICES
// ========================================

export {
    app,
    auth,
    db
};