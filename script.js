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

let selections = JSON.parse(localStorage.getItem("calendarData")) || {};

function renderCalendar() {
  const selectedMonth = parseInt(monthSelect.value); // 6 = junho, 7 = julho
  const today = new Date();
  const year = today.getFullYear();
  const totalDays = new Date(year, selectedMonth , 0).getDate();

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
  localStorage.setItem("calendarData", JSON.stringify(selections));
  alert("Disponibilidade guardada!");
});

monthSelect.addEventListener("change", renderCalendar);

renderCalendar();
