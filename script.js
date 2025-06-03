// script.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCYaOfYvyoRLeaSToCmrLBwKjJdLD_jFSc",
  authDomain: "fivien18.firebaseapp.com",
  databaseURL: "https://fivien18-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "fivien18",
  storageBucket: "fivien18.firebasestorage.app",
  messagingSenderId: "635216684667",
  appId: "1:635216684667:web:bb4d5a2da30815958b64de",
  measurementId: "G-6GP5HX3FEG"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const calendar = document.getElementById("calendar");
const userSelect = document.getElementById("userSelect");
const monthSelect = document.getElementById("monthSelect");
const saveButton = document.getElementById("save");

const users = {
  Isaac: "#f94144",
  Xonsi: "#f3722c",
  Bea: "#f9c74f",
  Chamz: "#90be6d",
  Ema:"#43aa8b",
  Nô: "#577590",
  Jana: "#9e62b9",
  Marta: "#f72585"
};

const userOrder = ["Isaac", "Xonsi", "Bea", "Chamz", "Ema", "Nô", "Jana", "Marta"];

Object.entries(users).forEach(([name]) => {
  const option = document.createElement("option");
  option.value = name;
  option.textContent = name;
  userSelect.appendChild(option);
});

let selections = {};

// Função para carregar dados do Firebase
function loadSelections() {
  const dbRef = ref(db);
  get(child(dbRef, 'calendarData')).then((snapshot) => {
    if (snapshot.exists()) {
      selections = snapshot.val();
    } else {
      selections = {};
    }
    renderCalendar();
  }).catch((error) => {
    console.error("Erro ao carregar dados:", error);
    selections = {};
    renderCalendar();
  });
}

function renderCalendar() {
  const selectedMonth = parseInt(monthSelect.value);
  const today = new Date();
  const year = today.getFullYear();
  const totalDays = new Date(year, selectedMonth, 0).getDate();

  calendar.innerHTML = "";

  for (let i = 1; i <= totalDays; i++) {
    const dayEl = document.createElement("div");
    dayEl.classList.add("day");
    dayEl.textContent = i;

    const key = `${year}-${selectedMonth}-${i}`;

    if (selections[key] && selections[key].length > 0) {
      const usersHere = selections[key];
      if (usersHere.length === 1) {
        dayEl.style.backgroundColor = usersHere[0].color;
      } else {
        const sortedUsers = [...usersHere].sort(
          (a, b) => userOrder.indexOf(a.name) - userOrder.indexOf(b.name)
        );
        const gradient = sortedUsers.map(u => u.color).join(", ");

        dayEl.style.background = `linear-gradient(45deg, ${gradient})`;
      }
      dayEl.title = usersHere.map(u => u.name).join(", ");
    } else {
      dayEl.style.background = "white";
      dayEl.title = "";
    }

    dayEl.addEventListener("click", () => {
      const name = userSelect.value;
      if (!name || !(name in users)) {
        alert("Escolhe o teu nome!");
        return;
      }

      if (!selections[key]) selections[key] = [];

      const userIndex = selections[key].findIndex(u => u.name === name);

      if (userIndex === -1) {
        selections[key].push({ name, color: users[name] });
      } else {
        selections[key].splice(userIndex, 1);
        if (selections[key].length === 0) delete selections[key];
      }

      renderCalendar();
    });

    calendar.appendChild(dayEl);
  }
}

saveButton.addEventListener("click", () => {
  set(ref(db, 'calendarData'), selections)
    .then(() => alert("Disponibilidade guardada no Firebase!"))
    .catch((error) => alert("Erro a guardar: " + error));
});

monthSelect.addEventListener("change", renderCalendar);

// Carrega os dados do Firebase logo que a app inicia
loadSelections();
