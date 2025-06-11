// Firebase 관련 모듈 import
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

// Firebase 설정
const firebaseConfig = {
    apiKey: "AIzaSyDMU8EdSzoF8aikqWaDvsCAb0XtUop1PFU",
    authDomain: "mmemo-47730.firebaseapp.com",
    projectId: "mmemo-47730",
    storageBucket: "mmemo-47730.firebasestorage.app",
    messagingSenderId: "371211028549",
    appId: "1:371211028549:web:47705712192cf6fdeb7b2c",
    measurementId: "G-38661X4BNQ",
    databaseURL: "https://mmemo-47730-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// DOM 요소 선택
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const showRegisterFormBtn = document.getElementById('showRegisterForm');
const showLoginFormBtn = document.getElementById('showLoginForm');

// 폼 전환 함수
function showRegisterForm() {
    loginForm.style.display = 'none';
    registerForm.style.display = 'flex';
}

function showLoginForm() {
    registerForm.style.display = 'none';
    loginForm.style.display = 'flex';
}

// 에러 메시지 표시 함수
function showError(formId, message) {
    const form = document.getElementById(formId);
    let errorDiv = form.querySelector('.error-message');
    
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        form.appendChild(errorDiv);
    }
    
    errorDiv.textContent = message;
}

// 로그인 처리 함수
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const submitBtn = loginForm.querySelector('button[type="submit"]');
    
    try {
        submitBtn.disabled = true;
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = 'index.html'; // 로그인 성공 시 메인 페이지로 이동
    } catch (error) {
        let errorMessage = '로그인에 실패했습니다.';
        if (error.code === 'auth/user-not-found') {
            errorMessage = '존재하지 않는 이메일입니다.';
        } else if (error.code === 'auth/wrong-password') {
            errorMessage = '비밀번호가 올바르지 않습니다.';
        }
        showError('loginForm', errorMessage);
    } finally {
        submitBtn.disabled = false;
    }
}

// 회원가입 처리 함수
async function handleRegister(e) {
    e.preventDefault();
    
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const submitBtn = registerForm.querySelector('button[type="submit"]');
    
    if (password !== confirmPassword) {
        showError('registerForm', '비밀번호가 일치하지 않습니다.');
        return;
    }
    
    if (password.length < 6) {
        showError('registerForm', '비밀번호는 최소 6자 이상이어야 합니다.');
        return;
    }
    
    try {
        submitBtn.disabled = true;
        await createUserWithEmailAndPassword(auth, email, password);
        window.location.href = 'index.html'; // 회원가입 성공 시 메인 페이지로 이동
    } catch (error) {
        let errorMessage = '회원가입에 실패했습니다.';
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = '이미 사용 중인 이메일입니다.';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = '유효하지 않은 이메일 형식입니다.';
        }
        showError('registerForm', errorMessage);
    } finally {
        submitBtn.disabled = false;
    }
}

// 이벤트 리스너 등록
loginForm.addEventListener('submit', handleLogin);
registerForm.addEventListener('submit', handleRegister);
showRegisterFormBtn.addEventListener('click', showRegisterForm);
showLoginFormBtn.addEventListener('click', showLoginForm);

// 엔터 키 처리
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const form = input.closest('form');
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.click();
        }
    });
}); 