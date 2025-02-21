import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyARkljI4btWYdiZ2XTYO-2f6NtMKjAQZ8M",
  authDomain: "what-do-you-want-tell-teacher2.firebaseapp.com",
  databaseURL: "https://what-do-you-want-tell-teacher2-default-rtdb.firebaseio.com",
  projectId: "what-do-you-want-tell-teacher2",
  storageBucket: "what-do-you-want-tell-teacher2.firebasestorage.app",
  messagingSenderId: "130178760324",
  appId: "1:130178760324:web:b4e91e8b7e4db831d80cd1",
  measurementId: "G-LLY0Z83VE3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ส่งข้อความเมื่อฟอร์มถูกส่ง
const form = document.getElementById("feedback-form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const nickname = document.getElementById("nickname").value;
  const classRoom = document.getElementById("class-room").value;
  const teachingStyle = document.getElementById("teaching-style").value;
  const personality = document.getElementById("personality").value;

  const messagesRef = ref(db, "messages");
  push(messagesRef, {
    nickname: nickname,
    classRoom: classRoom,
    teachingStyle: teachingStyle,
    personality: personality
  }).then(() => {
    alert("ครูรับเรื่องแล้วจ้า💕");
    createFloatingHeart(nickname, classRoom, teachingStyle, personality);
    form.reset();
  }).catch((error) => {
    console.error("Error sending message:", error);
  });
});

// สร้างหัวใจและข้อความลอยขึ้น
function createFloatingHeart(nickname, classRoom, teachingStyle, personality) {
  const floatingContainer = document.querySelector(".floating-container");
  const floatingItem = document.createElement("div");
  floatingItem.classList.add("floating-item");
  floatingItem.style.left = `${Math.random() * 80 + 10}%`;

  floatingItem.innerHTML = `
    <img src="heart.png" alt="heart" class="floating-heart">
    <div class="floating-message">
      <strong>${nickname}</strong> (${classRoom})<br>
      ${teachingStyle}<br>
      ${personality}
    </div>
  `;

  floatingContainer.appendChild(floatingItem);
  setTimeout(() => {
    floatingItem.remove();
  }, 12000);
}

// แสดงข้อความทั้งหมดจาก Firebase
const viewMessagesBtn = document.getElementById("view-messages-btn");
viewMessagesBtn.addEventListener("click", () => {
  const messagesContainer = document.getElementById("messages-container");
  const messagesBox = document.getElementById("messages-box");
  messagesBox.innerHTML = "<p>กำลังโหลดข้อมูล...</p>";
  const messagesRef = ref(db, "messages");
  onValue(messagesRef, (snapshot) => {
    messagesBox.innerHTML = "";
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        const messageItem = document.createElement("div");
        messageItem.classList.add("message-box");
        messageItem.innerHTML = `
          <p><strong>นามแฝง/นามในวงการ:</strong> ${data.nickname}</p>
          <p><strong>ห้อง:</strong> ${data.classRoom}</p>
          <p><strong>การจัดการเรียนการสอน:</strong> ${data.teachingStyle}</p>
          <p><strong>ลักษณะบุคลิกภาพ:</strong> ${data.personality}</p>
        `;
        messagesBox.appendChild(messageItem);
      });
    } else {
      messagesBox.innerHTML = "<p>ยังไม่มีข้อความ</p>";
    }
  });
  messagesContainer.style.display = "block";
});

// ปิดกล่องแสดงข้อความทั้งหมด
const closeMessagesBtn = document.getElementById("close-messages-btn");
closeMessagesBtn.addEventListener("click", () => {
  document.getElementById("messages-container").style.display = "none";
});
