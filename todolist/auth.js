// Firebase 연동
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAUTgBRyboxcBEf8gd9DhZe6gHvrkFHwHQ",
    authDomain: "to-do-list-4b26a.firebaseapp.com",
    projectId: "to-do-list-4b26a",
    storageBucket: "to-do-list-4b26a.appspot.com",
    messagingSenderId: "627861539197",
    appId: "1:627861539197:web:3c985c96fb000e26872414",
    measurementId: "G-1PZ97NDT54", 
    databaseURL: "https://to-do-list-4b26a-default-rtdb.asia-southeast1.firebasedatabase.app/"
  };

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);

function showWelcomeBox(name) {
    const box = document.getElementById('welcomeBox');
    if (box) {
        box.textContent = `환영합니다! (${name})님`;
        box.style.display = '';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.auth-form');
    if (!form) return;
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const inputs = form.querySelectorAll('input');
        if (inputs.length === 2) {
            // 로그인 (이메일, 비밀번호)
            const email = inputs[0].value.trim();
            const password = inputs[1].value.trim();
            if (!email || !password) {
                alert('이메일과 비밀번호를 모두 입력하세요.');
                return;
            }
            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                const name = user.displayName || (user.email ? user.email.split('@')[0] : '사용자');
                // 환영 메시지 index.html의 welcomeBox에 띄우기
                window.localStorage.setItem('welcomeBoxName', name);
                window.location.href = 'index.html';
            } catch (error) {
                alert('로그인 실패: ' + error.message);
            }
        } else if (inputs.length === 3) {
            // 회원가입 (이름, 이메일, 비밀번호)
            const name = inputs[0].value.trim();
            const email = inputs[1].value.trim();
            const password = inputs[2].value.trim();
            if (!name || !email || !password) {
                alert('모든 정보를 입력하세요.');
                return;
            }
            // Firebase Auth 회원가입 및 이름 저장
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await updateProfile(userCredential.user, { displayName: name });
                alert('회원가입이 완료되었습니다!');
                // location.href = 'login.html';
            } catch (error) {
                alert('회원가입 실패: ' + error.message);
            }
        }
    });
});

// index.html에서 환영 메시지 띄우기 (welcomeBox)
if (window.location.pathname.endsWith('index.html')) {
    const name = window.localStorage.getItem('welcomeBoxName');
    if (name) {
        showWelcomeBox(name);
        window.localStorage.removeItem('welcomeBoxName');
    }
} 