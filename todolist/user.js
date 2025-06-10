import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAUTgBRyboxcBEf8gd9DhZe6gHvrkFHwHQ",
  authDomain: "to-do-list-4b26a.firebaseapp.com",
  projectId: "to-do-list-4b26a",
  storageBucket: "to-do-list-4b26a.appspot.com",
  messagingSenderId: "627861539197",
  appId: "1:627861539197:web:3c985c96fb000e26872414",
  measurementId: "G-1PZ97NDT54"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);

const welcomeMsg = document.getElementById('welcomeMsg');
const loginWelcomeMsg = document.getElementById('loginWelcomeMsg');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const welcomeBox = document.getElementById('welcomeBox');

onAuthStateChanged(auth, (user) => {
  if (user) {
    // 로그인 상태
    let username = user.displayName || (user.email ? user.email.split('@')[0] : '사용자');
    welcomeMsg.textContent = `${username}님 환영합니다.`;
    welcomeMsg.style.display = '';
    loginBtn.style.display = 'none';
    logoutBtn.style.display = '';
    // 할 일 관리 박스 아래 환영 박스 표시 (아이콘 포함)
    if (welcomeBox) {
      welcomeBox.innerHTML = `<span class="icon">🎉</span>환영합니다, <b>${username}</b>님`;
      welcomeBox.style.display = '';
      setTimeout(() => {
        welcomeBox.style.display = 'none';
      }, 5000);
    }
  } else {
    // 로그아웃 상태
    welcomeMsg.style.display = 'none';
    if (loginWelcomeMsg) loginWelcomeMsg.style.display = 'none';
    loginBtn.style.display = '';
    logoutBtn.style.display = 'none';
    if (welcomeBox) welcomeBox.style.display = 'none';
  }
});

logoutBtn && logoutBtn.addEventListener('click', async () => {
  await signOut(auth);
}); 