document.addEventListener('DOMContentLoaded', () => {
    const notepad = document.getElementById('notepad');
    const newBtn = document.getElementById('newBtn');
    const saveBtn = document.getElementById('saveBtn');
    const loadBtn = document.getElementById('loadBtn');
    const fontSize = document.getElementById('fontSize');
    const fontFamily = document.getElementById('fontFamily');
    const charCount = document.getElementById('charCount');
    const saveStatus = document.getElementById('saveStatus');

    // 자동 저장을 위한 타이머
    let saveTimer;

    // 댓글 관련 DOM 요소 선택
    const commentAuthor = document.getElementById('commentAuthor');
    const commentText = document.getElementById('commentText');
    const submitComment = document.getElementById('submitComment');
    const commentsList = document.querySelector('.comments-list');

    // 로컬 스토리지 키
    const STORAGE_KEY = 'memo_content';
    const COMMENTS_KEY = 'memo_comments';

    // 초기 설정
    let comments = JSON.parse(localStorage.getItem(COMMENTS_KEY) || '[]');
    updateCommentsList();

    // 글자 수 업데이트
    function updateCharCount() {
        const count = notepad.value.length;
        charCount.textContent = `글자 수: ${count}`;
    }

    // 자동 저장
    function autoSave() {
        localStorage.setItem('notepad-content', notepad.value);
        saveStatus.textContent = '자동 저장됨';
        setTimeout(() => {
            saveStatus.textContent = '';
        }, 2000);
    }

    // 새 메모
    newBtn.addEventListener('click', () => {
        if (confirm('새 메모를 시작하시겠습니까? 저장하지 않은 내용은 사라집니다.')) {
            notepad.value = '';
            updateCharCount();
        }
    });

    // 저장
    saveBtn.addEventListener('click', () => {
        const content = notepad.value;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'memo.txt';
        a.click();
        URL.revokeObjectURL(url);
        
        saveStatus.textContent = '저장됨';
        setTimeout(() => {
            saveStatus.textContent = '';
        }, 2000);
    });

    // 불러오기
    loadBtn.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.txt';
        
        input.onchange = e => {
            const file = e.target.files[0];
            const reader = new FileReader();
            
            reader.onload = event => {
                notepad.value = event.target.result;
                updateCharCount();
            };
            
            reader.readAsText(file);
        };
        
        input.click();
    });

    // 글꼴 크기 변경
    fontSize.addEventListener('change', () => {
        notepad.style.fontSize = fontSize.value;
    });

    // 글꼴 변경
    fontFamily.addEventListener('change', () => {
        notepad.style.fontFamily = fontFamily.value;
    });

    // 글자 수 실시간 업데이트
    notepad.addEventListener('input', () => {
        updateCharCount();
        clearTimeout(saveTimer);
        saveTimer = setTimeout(autoSave, 1000);
    });

    // 이전 내용 불러오기
    const savedContent = localStorage.getItem('notepad-content');
    if (savedContent) {
        notepad.value = savedContent;
        updateCharCount();
    }

    // 댓글 관련 함수들
    function addComment() {
        const author = commentAuthor.value.trim();
        const text = commentText.value.trim();
        
        if (!author || !text) {
            alert('이름과 댓글 내용을 모두 입력해주세요.');
            return;
        }

        const newComment = {
            id: Date.now(),
            author: author,
            text: text,
            date: new Date().toLocaleString()
        };

        comments.push(newComment);
        saveComments();
        updateCommentsList();
        
        // 입력 필드 초기화
        commentAuthor.value = '';
        commentText.value = '';
    }

    function saveComments() {
        localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
    }

    function updateCommentsList() {
        commentsList.innerHTML = '';
        
        comments.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.className = 'comment';
            commentElement.innerHTML = `
                <div class="comment-header">
                    <span class="comment-author">${comment.author}</span>
                    <span class="comment-date">${comment.date}</span>
                </div>
                <div class="comment-content">${comment.text}</div>
            `;
            commentsList.appendChild(commentElement);
        });
    }

    // 초기 로드
    loadBtn.addEventListener('click', () => {
        const savedContent = localStorage.getItem(STORAGE_KEY);
        if (savedContent) {
            notepad.value = savedContent;
            updateCharCount();
            showSaveStatus('메모를 불러왔습니다.');
        } else {
            showSaveStatus('저장된 메모가 없습니다.');
        }
    });

    function showSaveStatus(message) {
        saveStatus.textContent = message;
        setTimeout(() => {
            saveStatus.textContent = '';
        }, 2000);
    }
}); 