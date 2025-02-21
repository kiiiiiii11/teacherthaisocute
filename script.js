import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// Firebase configuration
const firebaseConfig = {  
  apiKey: "AIzaSyByZHRGZ9D19oICXDGqVrcEQvNAZNkjppQ",
  authDomain: "whatdoyouwanttotellteacher3.firebaseapp.com",
  databaseURL: "https://whatdoyouwanttotellteacher3-default-rtdb.firebaseio.com",
  projectId: "whatdoyouwanttotellteacher3",
  storageBucket: "whatdoyouwanttotellteacher3.firebasestorage.app",
  messagingSenderId: "285919090323",
  appId: "1:285919090323:web:ee96b96de8e9d4dd0c9f66",
  measurementId: "G-XE0MVZ5Y1V"
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
