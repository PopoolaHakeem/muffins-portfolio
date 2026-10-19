
// ========================================
// 1. IMPORT FIREBASE AUTHENTICATION
// ========================================

import {
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "firebase/auth";

import { auth } from "./firebase-config.js";

// ========================================
// 2. ADMIN SETTINGS
// ========================================

// Replace this with your actual Firebase User UID.
const ADMIN_UID = "NMtRjKWue2RzYsYmARRKMeuFtnC3";

// ========================================
// 3. GET HTML ELEMENTS
// ========================================

const loginForm = document.getElementById("adminLoginForm");
const emailInput = document.getElementById("adminEmail");
const passwordInput = document.getElementById("adminPassword");
const togglePasswordButton = document.getElementById("togglePassword");
const loginButton = document.getElementById("loginButton");
const loginMessage = document.getElementById("loginMessage");

// ========================================
// 4. CHECK EXISTING LOGIN SESSION
// ========================================

onAuthStateChanged(auth, async (user) => {
    if (!user) return;

    if (user.uid === ADMIN_UID) {
        window.location.replace("./admin-dashboard.html");
        return;
    }

    // Sign out any account that is not the authorized admin.
    await signOut(auth);
});

// ========================================
// 5. SHOW OR HIDE PASSWORD
// ========================================

togglePasswordButton.addEventListener("click", () => {
    const isPasswordHidden = passwordInput.type === "password";

    passwordInput.type = isPasswordHidden ? "text" : "password";

    togglePasswordButton.textContent = isPasswordHidden
        ? "Hide"
        : "Show";

    togglePasswordButton.setAttribute(
        "aria-label",
        isPasswordHidden ? "Hide password" : "Show password"
    );
});

// ========================================
// 6. DISPLAY LOGIN ERRORS
// ========================================

function showLoginMessage(message) {
    loginMessage.textContent = message;
}

// ========================================
// 7. HANDLE LOGIN FORM
// ========================================

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    showLoginMessage("");

    loginButton.disabled = true;
    loginButton.textContent = "Signing in...";

    try {
        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        const user = userCredential.user;

        if (user.uid !== ADMIN_UID) {
            await signOut(auth);

            showLoginMessage(
                "You are not authorized to access the admin dashboard."
            );

            return;
        }

        window.location.replace("./admin-dashboard.html");

    } catch (error) {
        console.error("Admin login error:", error.code);

        if (
            error.code === "auth/invalid-credential" ||
            error.code === "auth/wrong-password" ||
            error.code === "auth/user-not-found"
        ) {
            showLoginMessage("Incorrect email or password.");
        } else if (error.code === "auth/invalid-email") {
            showLoginMessage("Please enter a valid email address.");
        } else if (error.code === "auth/too-many-requests") {
            showLoginMessage(
                "Too many attempts. Please wait before trying again."
            );
        } else if (
            error.code === "auth/network-request-failed"
        ) {
            showLoginMessage(
                "Network error. Check your internet connection."
            );
        } else {
            showLoginMessage(
                "Login failed. Please try again."
            );
        }

    } finally {
        loginButton.disabled = false;
        loginButton.textContent = "Sign In";
    }
});
