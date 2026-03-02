// ── Firebase Configuration ──
// TODO: Replace with your Firebase project config from:
// https://console.firebase.google.com → Project Settings → Your apps → Web app
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// ── Initialize Firebase ──
firebase.initializeApp(firebaseConfig);
var auth = firebase.auth(); // var: 전역 접근 가능 (login/signup 인라인 스크립트에서 사용)

// ── Auth State Observer ──
auth.onAuthStateChanged(function(user) {
    updateAuthUI(user);
});

// ── Update Util-Bar UI based on auth state ──
function updateAuthUI(user) {
    const loginEl    = document.getElementById('util-login');
    const signupEl   = document.getElementById('util-signup');
    const userInfoEl = document.getElementById('util-user-info');
    const usernameEl = document.getElementById('util-username');

    if (!loginEl || !signupEl || !userInfoEl) return;

    if (user) {
        loginEl.style.display    = 'none';
        signupEl.style.display   = 'none';
        userInfoEl.style.display = 'flex';
        if (usernameEl) {
            usernameEl.textContent = user.displayName || user.email;
        }
    } else {
        loginEl.style.display    = '';
        signupEl.style.display   = '';
        userInfoEl.style.display = 'none';
    }
}

// ── Sign Up ──
function handleSignup(name, email, password) {
    return auth.createUserWithEmailAndPassword(email, password)
        .then(function(result) {
            return result.user.updateProfile({ displayName: name });
        });
}

// ── Login ──
function handleLogin(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
}

// ── Logout ──
function handleLogout() {
    return auth.signOut().then(function() {
        window.location.href = 'index.html';
    });
}

// ── Wire up logout button (스크립트가 <body> 하단에 위치하므로 DOM이 이미 준비된 상태) ──
var logoutBtn = document.getElementById('util-logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
}
