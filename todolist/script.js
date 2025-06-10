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
    measurementId: "G-1PZ97NDT54", 
    databaseURL: "https://to-do-list-4b26a-default-rtdb.asia-southeast1.firebasedatabase.app/"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todoInput');
    const addButton = document.getElementById('addButton');
    const todoList = document.getElementById('todoList');

    // 로컬 스토리지에서 할 일 목록 불러오기
    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    // 할 일 목록 렌더링 함수
    function renderTodos() {
        todoList.innerHTML = '';
        todos.forEach((todo, index) => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            
            const todoContent = document.createElement('div');
            todoContent.className = 'todo-content';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'todo-checkbox';
            checkbox.checked = todo.completed;
            checkbox.onchange = () => toggleTodo(index);

            const todoText = document.createElement('span');
            todoText.className = 'todo-text';
            todoText.textContent = todo.text;

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = '삭제';
            deleteBtn.onclick = () => deleteTodo(index);

            todoContent.appendChild(checkbox);
            todoContent.appendChild(todoText);
            li.appendChild(todoContent);
            li.appendChild(deleteBtn);
            todoList.appendChild(li);
        });

        // 로컬 스토리지에 저장
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    // 할 일 추가 함수
    function addTodo() {
        const text = todoInput.value.trim();
        if (text) {
            todos.push({ text, completed: false });
            todoInput.value = '';
            renderTodos();
        }
    }

    // 할 일 완료 토글 함수
    function toggleTodo(index) {
        todos[index].completed = !todos[index].completed;
        renderTodos();
    }

    // 할 일 삭제 함수
    function deleteTodo(index) {
        todos.splice(index, 1);
        renderTodos();
    }

    // 이벤트 리스너 등록
    addButton.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    });

    // 초기 렌더링
    renderTodos();
}); 