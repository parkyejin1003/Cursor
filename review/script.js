// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-analytics.js";
import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDMXTHZJMNL_9LXKuXvWxwAWi_sCJEDGKE",
  authDomain: "portfolio-review-c0d5c.firebaseapp.com",
  projectId: "portfolio-review-c0d5c",
  storageBucket: "portfolio-review-c0d5c.appspot.com",
  messagingSenderId: "1098874512021",
  appId: "1:1098874512021:web:0d0c3e9b2c8c6c1c6c6c6c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// DOM 요소 선택
const reviewTitle = document.getElementById('reviewTitle');
const reviewContent = document.getElementById('reviewContent');
const reviewRating = document.getElementById('reviewRating');
const submitReviewBtn = document.getElementById('submitReview');
const reviewList = document.getElementById('reviewList');
const searchInput = document.getElementById('searchInput');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const userInfo = document.getElementById('userInfo');

// 현재 로그인한 사용자 정보
let currentUser = null;

// 인증 상태 변경 감지
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        userInfo.textContent = `${user.email}님 환영합니다!`;
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'block';
        loadReviews();
    } else {
        currentUser = null;
        userInfo.textContent = '로그인이 필요합니다.';
        loginBtn.style.display = 'block';
        logoutBtn.style.display = 'none';
        reviewList.innerHTML = '<div class="no-reviews">로그인이 필요합니다.</div>';
    }
});

// 로그아웃 함수
async function logout() {
    try {
        await signOut(auth);
    } catch (error) {
        console.error('로그아웃 실패:', error);
        alert('로그아웃에 실패했습니다.');
    }
}

// 리뷰 추가 함수
async function addReview() {
    if (!currentUser) {
        alert('로그인이 필요합니다.');
        return;
    }

    const title = reviewTitle.value.trim();
    const content = reviewContent.value.trim();
    const rating = reviewRating.value;

    if (!title || !content) {
        alert('제목과 내용을 모두 입력해주세요.');
        return;
    }

    try {
        const reviewData = {
            title,
            content,
            rating: parseInt(rating),
            userId: currentUser.uid,
            userEmail: currentUser.email,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };

        const docRef = await addDoc(collection(db, 'reviews'), reviewData);
        console.log('리뷰가 추가되었습니다. ID:', docRef.id);

        reviewTitle.value = '';
        reviewContent.value = '';
        reviewRating.value = '5';
    } catch (error) {
        console.error('리뷰 추가 실패:', error);
        alert('리뷰 추가에 실패했습니다.');
    }
}

// 리뷰 삭제 함수
async function deleteReview(reviewId) {
    if (!currentUser) {
        alert('로그인이 필요합니다.');
        return;
    }

    if (!confirm('정말로 이 리뷰를 삭제하시겠습니까?')) {
        return;
    }

    try {
        const reviewRef = doc(db, 'reviews', reviewId);
        await deleteDoc(reviewRef);
        console.log('리뷰가 삭제되었습니다. ID:', reviewId);
    } catch (error) {
        console.error('리뷰 삭제 실패:', error);
        alert('리뷰 삭제에 실패했습니다.');
    }
}

// 리뷰 수정 함수
async function editReview(reviewId) {
    if (!currentUser) {
        alert('로그인이 필요합니다.');
        return;
    }

    try {
        const reviewRef = doc(db, 'reviews', reviewId);
        const reviewDoc = await getDoc(reviewRef);
        
        if (!reviewDoc.exists()) {
            alert('리뷰를 찾을 수 없습니다.');
            return;
        }

        const reviewData = reviewDoc.data();
        if (reviewData.userId !== currentUser.uid) {
            alert('자신의 리뷰만 수정할 수 있습니다.');
            return;
        }

        const newTitle = prompt('새로운 제목을 입력하세요:', reviewData.title);
        if (newTitle === null) return;

        const newContent = prompt('새로운 내용을 입력하세요:', reviewData.content);
        if (newContent === null) return;

        const newRating = prompt('새로운 평점을 입력하세요 (1-5):', reviewData.rating);
        if (newRating === null) return;

        const rating = parseInt(newRating);
        if (isNaN(rating) || rating < 1 || rating > 5) {
            alert('평점은 1부터 5 사이의 숫자여야 합니다.');
            return;
        }

        await updateDoc(reviewRef, {
            title: newTitle,
            content: newContent,
            rating: rating,
            updatedAt: serverTimestamp()
        });
        console.log('리뷰가 수정되었습니다. ID:', reviewId);
    } catch (error) {
        console.error('리뷰 수정 실패:', error);
        alert('리뷰 수정에 실패했습니다.');
    }
}

// 리뷰 목록 로드 함수
function loadReviews() {
    if (!currentUser) return;

    try {
        const q = query(
            collection(db, 'reviews'),
            where('userId', '==', currentUser.uid),
            orderBy('createdAt', 'desc')
        );

        onSnapshot(q, (snapshot) => {
            reviewList.innerHTML = '';
            
            if (snapshot.empty) {
                reviewList.innerHTML = '<div class="no-reviews">작성된 리뷰가 없습니다.</div>';
                return;
            }

            snapshot.forEach((doc) => {
                const review = doc.data();
                const reviewElement = document.createElement('div');
                reviewElement.className = 'review-item';
                reviewElement.innerHTML = `
                    <h3>${review.title}</h3>
                    <div class="review-meta">
                        <div class="review-rating">평점: ${'⭐'.repeat(review.rating)}</div>
                        <div class="review-date">작성일: ${review.createdAt ? new Date(review.createdAt.toDate()).toLocaleString() : '날짜 없음'}</div>
                    </div>
                    <div class="review-content">${review.content}</div>
                    <div class="review-actions">
                        <button onclick="editReview('${doc.id}')" class="btn edit-btn">수정</button>
                        <button onclick="deleteReview('${doc.id}')" class="btn delete-btn">삭제</button>
                    </div>
                `;
                reviewList.appendChild(reviewElement);
            });
        }, (error) => {
            console.error('리뷰 로드 실패:', error);
            alert('리뷰를 불러오는데 실패했습니다.');
        });
    } catch (error) {
        console.error('리뷰 목록 로드 실패:', error);
        alert('리뷰 목록을 불러오는데 실패했습니다.');
    }
}

// 검색 함수
function searchReviews() {
    const searchTerm = searchInput.value.toLowerCase();
    const reviewItems = document.querySelectorAll('.review-item');

    reviewItems.forEach((item) => {
        const title = item.querySelector('h3').textContent.toLowerCase();
        const content = item.querySelector('.review-content').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || content.includes(searchTerm)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// 이벤트 리스너 등록
logoutBtn.addEventListener('click', logout);
submitReviewBtn.addEventListener('click', addReview);
searchInput.addEventListener('input', searchReviews);

// Enter 키로 리뷰 작성
reviewTitle.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        reviewContent.focus();
    }
});

reviewContent.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
        addReview();
    }
}); 

// DOM 요소 선택
const reviewForm = document.getElementById('reviewForm');
const reviewsList = document.getElementById('reviewsList');
const averageRatingElement = document.querySelector('.average-rating .number');
const totalReviewsElement = document.querySelector('.total-reviews .number');
const ratingInputs = document.querySelectorAll('input[name="rating"]');
const ratingText = document.querySelector('.rating-text');

// 로컬 스토리지 키
const REVIEWS_STORAGE_KEY = 'reviews';

// 리뷰 데이터 초기화
let reviews = JSON.parse(localStorage.getItem(REVIEWS_STORAGE_KEY) || '[]');

// 별점 입력 처리
ratingInputs.forEach(input => {
    input.addEventListener('change', (e) => {
        const rating = e.target.value;
        ratingText.textContent = `${rating}점`;
    });
});

// 리뷰 통계 업데이트
function updateReviewStats() {
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
        ? (reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1)
        : '0.0';

    averageRatingElement.textContent = averageRating;
    totalReviewsElement.textContent = totalReviews;
}

// 별점을 HTML로 변환
function getStarRating(rating) {
    const filledStar = '<span class="filled">★</span>';
    const emptyStar = '<span class="empty">★</span>';
    return filledStar.repeat(rating) + emptyStar.repeat(5 - rating);
}

// 리뷰 목록 렌더링
function renderReviews() {
    reviewsList.innerHTML = '';
    
    reviews.forEach(review => {
        const reviewElement = document.createElement('div');
        reviewElement.className = 'review';
        reviewElement.innerHTML = `
            <div class="review-header">
                <span class="review-author">${review.name}</span>
                <span class="review-rating">${getStarRating(review.rating)}</span>
            </div>
            <div class="review-date">${review.date}</div>
            <div class="review-content">${review.content}</div>
        `;
        reviewsList.appendChild(reviewElement);
    });

    updateReviewStats();
}

// 리뷰 저장
function saveReviews() {
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
}

// 폼 제출 처리
reviewForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // 입력값 가져오기
    const name = document.getElementById('name').value;
    const ratingInput = document.querySelector('input[name="rating"]:checked');
    
    if (!ratingInput) {
        alert('별점을 선택해주세요.');
        return;
    }
    
    const rating = parseInt(ratingInput.value);
    const content = document.getElementById('review').value;

    // 새 리뷰 객체 생성
    const newReview = {
        id: Date.now(),
        name: name,
        rating: rating,
        content: content,
        date: new Date().toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    };

    // 리뷰 배열에 추가
    reviews.unshift(newReview);

    // 저장 및 화면 업데이트
    saveReviews();
    renderReviews();

    // 폼 초기화
    reviewForm.reset();
    ratingText.textContent = '0점';
});

// 이미지 미리보기 기능
const imageInput = document.getElementById('image');
const imagePreview = document.getElementById('imagePreview');
const reviewIdInput = document.getElementById('reviewId');
const submitBtn = document.querySelector('.submit-btn');
const cancelBtn = document.querySelector('.cancel-btn');

imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.innerHTML = `<img src="${e.target.result}" alt="미리보기">`;
        };
        reader.readAsDataURL(file);
    }
});

// 리뷰 작성/수정 폼 초기화
function resetForm() {
    reviewForm.reset();
    imagePreview.innerHTML = '';
    reviewIdInput.value = '';
    submitBtn.textContent = '리뷰 등록';
    cancelBtn.style.display = 'none';
}

// 리뷰 목록 불러오기
async function loadReviews() {
    try {
        const querySnapshot = await getDocs(collection(db, "reviews"));
        let totalRating = 0;
        reviewsList.innerHTML = '';

        querySnapshot.forEach((doc) => {
            const review = doc.data();
            totalRating += review.rating;

            const reviewElement = document.createElement('div');
            reviewElement.className = 'review';
            reviewElement.innerHTML = `
                <div class="review-header">
                    <span class="review-author">${review.name}</span>
                    <span class="review-rating">${'★'.repeat(review.rating)}</span>
                </div>
                <div class="review-content">${review.content}</div>
                ${review.imageUrl ? `<div class="review-image"><img src="${review.imageUrl}" alt="리뷰 이미지"></div>` : ''}
                <button onclick="deleteReview('${doc.id}')" class="delete-btn">삭제</button>
            `;
            reviewsList.appendChild(reviewElement);
        });

        // 통계 업데이트
        const totalReviews = querySnapshot.size;
        const averageRating = totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : '0.0';
        document.querySelector('.average-rating .number').textContent = averageRating;
        document.querySelector('.total-reviews .number').textContent = totalReviews;

    } catch (error) {
        console.error("리뷰 불러오기 실패:", error);
        alert("리뷰를 불러오는데 실패했습니다.");
    }
}

// 리뷰 작성
reviewForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const content = document.getElementById('review').value;
    const rating = parseInt(document.querySelector('input[name="rating"]:checked').value);
    const file = imageInput.files[0];

    try {
        let imageUrl = '';
        if (file) {
            const storageRef = ref(storage, `review-images/${Date.now()}_${file.name}`);
            await uploadBytes(storageRef, file);
            imageUrl = await getDownloadURL(storageRef);
        }

        await addDoc(collection(db, "reviews"), {
            name: name,
            content: content,
            rating: rating,
            imageUrl: imageUrl,
            createdAt: new Date().toISOString()
        });

        // 폼 초기화
        reviewForm.reset();
        imagePreview.innerHTML = '';
        
        // 리뷰 목록 새로고침
        await loadReviews();
        
        alert('리뷰가 등록되었습니다.');
    } catch (error) {
        console.error("리뷰 저장 실패:", error);
        alert("리뷰 저장에 실패했습니다.");
    }
});

// 리뷰 삭제
async function deleteReview(reviewId) {
    if (!confirm('정말로 이 리뷰를 삭제하시겠습니까?')) return;

    try {
        await deleteDoc(doc(db, "reviews", reviewId));
        await loadReviews();
        alert('리뷰가 삭제되었습니다.');
    } catch (error) {
        console.error("리뷰 삭제 실패:", error);
        alert("리뷰 삭제에 실패했습니다.");
    }
}

// 리뷰 작성/수정 제출
reviewForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const content = document.getElementById('review').value;
    const ratingInput = document.querySelector('input[name="rating"]:checked');
    
    if (!name || !content || !ratingInput) {
        alert('모든 필드를 입력해주세요.');
        return;
    }

    const rating = parseInt(ratingInput.value);
    const file = imageInput.files[0];
    const isEditing = reviewIdInput.value !== '';

    try {
        let imageUrl = '';
        let imagePath = '';

        // 이미지 업로드 처리
        if (file) {
            const timestamp = new Date().getTime();
            imagePath = `review-images/${timestamp}_${file.name}`;
            const storageRef = ref(storage, imagePath);
            await uploadBytes(storageRef, file);
            imageUrl = await getDownloadURL(storageRef);
        }

        const reviewData = {
            name,
            content,
            rating,
            updatedAt: new Date().toISOString()
        };

        if (imageUrl) {
            reviewData.imageUrl = imageUrl;
            reviewData.imagePath = imagePath;
        }

        if (isEditing) {
            // 리뷰 수정
            const reviewRef = doc(db, "reviews", reviewIdInput.value);
            await updateDoc(reviewRef, reviewData);
        } else {
            // 새 리뷰 작성
            reviewData.createdAt = new Date().toISOString();
            await addDoc(collection(db, "reviews"), reviewData);
        }

        resetForm();
        await loadReviews();
        alert(isEditing ? '리뷰가 수정되었습니다.' : '리뷰가 등록되었습니다.');

    } catch (error) {
        console.error("리뷰 저장 실패:", error);
        alert("리뷰 저장에 실패했습니다.");
    }
});

// 취소 버튼 이벤트
cancelBtn.addEventListener('click', resetForm);

// 초기 리뷰 목록 로드
loadReviews(); 