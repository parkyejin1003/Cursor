// Firebase SDK import
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Firebase 객체 가져오기
const auth = window.firebaseAuth;
const db = window.firebaseDb;

// 회원가입 폼 요소 가져오기
const registerForm = document.getElementById('registerForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');

// 에러 메시지 표시 함수
function showError(message) {
    // 기존 에러 메시지 제거
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // 새 에러 메시지 생성
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    registerForm.insertBefore(errorDiv, registerForm.querySelector('.auth-buttons'));
}

// 회원가입 성공 메시지 표시 함수
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    registerForm.insertBefore(successDiv, registerForm.querySelector('.auth-buttons'));

    // 3초 후 로그인 페이지로 이동
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 3000);
}

// 회원가입 폼 제출 이벤트 처리
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // 입력값 검증
    if (!email || !password || !confirmPassword) {
        showError('모든 필드를 입력해주세요.');
        return;
    }

    if (password.length < 6) {
        showError('비밀번호는 6자 이상이어야 합니다.');
        return;
    }

    if (password !== confirmPassword) {
        showError('비밀번호가 일치하지 않습니다.');
        return;
    }

    try {
        // 회원가입 버튼 비활성화
        const registerBtn = registerForm.querySelector('.register-btn');
        registerBtn.disabled = true;
        registerBtn.textContent = '회원가입 중...';

        // Firebase Authentication으로 회원가입
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Firestore에 사용자 정보 저장
        await setDoc(doc(db, 'users', user.uid), {
            email: email,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
        });

        // 회원가입 성공 알림
        alert('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.');
        
        // 로그인 페이지로 이동
        window.location.href = 'login.html';

    } catch (error) {
        console.error('회원가입 에러:', error);
        // 에러 처리
        let errorMessage = '회원가입 중 오류가 발생했습니다.';
        
        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage = '이미 사용 중인 이메일입니다.';
                break;
            case 'auth/invalid-email':
                errorMessage = '유효하지 않은 이메일 형식입니다.';
                break;
            case 'auth/operation-not-allowed':
                errorMessage = '이메일/비밀번호 회원가입이 비활성화되어 있습니다.';
                break;
            case 'auth/weak-password':
                errorMessage = '비밀번호가 너무 약합니다.';
                break;
        }
        
        showError(errorMessage);

    } finally {
        // 회원가입 버튼 활성화
        const registerBtn = registerForm.querySelector('.register-btn');
        registerBtn.disabled = false;
        registerBtn.textContent = '회원가입';
    }
});

// 실시간 비밀번호 확인 검사
confirmPasswordInput.addEventListener('input', () => {
    if (passwordInput.value !== confirmPasswordInput.value) {
        confirmPasswordInput.setCustomValidity('비밀번호가 일치하지 않습니다.');
    } else {
        confirmPasswordInput.setCustomValidity('');
    }
}); 