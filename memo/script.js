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
}); 