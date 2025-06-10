// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAUTgBRyboxcBEf8gd9DhZe6gHvrkFHwHQ",
  authDomain: "to-do-list-4b26a.firebaseapp.com",
  projectId: "to-do-list-4b26a",
  storageBucket: "to-do-list-4b26a.firebasestorage.app",
  messagingSenderId: "627861539197",
  appId: "1:627861539197:web:3c985c96fb000e26872414",
  measurementId: "G-1PZ97NDT54"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.auth-form');
    if (!form) return;
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const inputs = form.querySelectorAll('input');
        if (inputs.length === 2) {
            // 로그인
            const username = inputs[0].value.trim();
            const password = inputs[1].value.trim();
            if (!username || !password) {
                alert('아이디와 비밀번호를 모두 입력하세요.');
                return;
            }
            // 데모 로그인
            if (username === 'test' && password === '1234') {
                alert('로그인 성공!');
                // location.href = 'index.html';
            } else {
                alert('로그인 정보가 올바르지 않습니다.');
            }
        } else if (inputs.length === 3) {
            // 회원가입
            const username = inputs[0].value.trim();
            const email = inputs[1].value.trim();
            const password = inputs[2].value.trim();
            if (!username || !email || !password) {
                alert('모든 정보를 입력하세요.');
                return;
            }
            alert('회원가입이 완료되었습니다!');
            // location.href = 'signin.html';
        }
    });
}); 