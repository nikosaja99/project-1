const schedule = [
    {
        time: "04.00",
        title: "Bangun",
        tasks: ["Minum air", "Rapikan tempat tidur", "Cuci muka"]
    },
    {
        time: "04.15 - 04.45",
        title: "Ibadah atau Refleksi",
        tasks: ["Ibadah", "Menyusun target hari ini"]
    },
    {
        time: "04.45 - 06.00",
        title: "Olahraga",
        tasks: ["Lari", "Kalistenik (push up, squat, plank)", "Peregangan"]
    },
    {
        time: "06.00 - 07.00",
        title: "Persiapan Pagi",
        tasks: ["Mandi", "Sarapan", "Persiapan belajar"]
    },
    {
        time: "07.00 - 10.00",
        title: "Sesi Belajar Mendalam #1",
        tasks: [
            "Website",
            "Cybersecurity",
            "Teknologi digital",
            "Administrasi bisnis",
            "Tidak ada media sosial selama sesi ini"
        ]
    },
    {
        time: "10.00 - 10.30",
        title: "Istirahat",
        tasks: ["Istirahat"]
    },
    {
        time: "10.30 - 12.00",
        title: "Membaca Buku",
        tasks: [
            "Bisnis",
            "Psikologi",
            "Biografi",
            "Teknologi",
            "Target 30-50 halaman"
        ]
    },
    {
        time: "12.00 - 13.00",
        title: "Makan Siang",
        tasks: ["Makan siang", "Istirahat"]
    },
    {
        time: "13.00 - 16.00",
        title: "Sesi Proyek",
        tasks: [
            "Membuat website",
            "Menulis artikel",
            "Membangun portofolio",
            "Belajar SEO",
            "Merancang bisnis kuliner",
            "Membuat sistem inventaris sederhana"
        ]
    },
    {
        time: "16.00 - 17.00",
        title: "Aktivitas Ringan",
        tasks: ["Jalan kaki", "Peregangan", "Aktivitas ringan"]
    },
    {
        time: "17.00 - 19.00",
        title: "Waktu Keluarga",
        tasks: ["Waktu keluarga", "Makan", "Ibadah"]
    },
    {
        time: "19.00 - 21.00",
        title: "Sesi Belajar Mendalam #2",
        tasks: ["Review materi", "Kursus online", "Mengerjakan proyek"]
    },
    {
        time: "21.00 - 21.30",
        title: "Evaluasi Harian",
        tasks: ["Menulis jurnal harian", "Evaluasi target"]
    },
    {
        time: "21.30",
        title: "Tidur",
        tasks: ["Tidur"]
    }
];

const taskList = document.getElementById("taskList");
const dayContainer = document.getElementById("dayContainer");

// =====================
// STATE
// =====================

let selectedDay = 1;

// =====================
// DAYS (730 HARI)
// =====================

function generateDays(count = 730) {
    const days = [];

    for (let i = 1; i <= count; i++) {
        days.push(i);
    }

    localStorage.setItem("timeSkip_days", JSON.stringify(days));
    return days;
}

function getDays() {
    const data = localStorage.getItem("timeSkip_days");

    if (!data) return generateDays(730);

    return JSON.parse(data);
}

function saveDays(days) {
    localStorage.setItem("timeSkip_days", JSON.stringify(days));
}

function addDay(day) {
    const days = getDays();

    if (!days.includes(day)) {
        days.push(day);
        saveDays(days);
    }
}

// =====================
// RENDER DAYS
// =====================

function renderDays() {
    if (!dayContainer) return;

    const days = getDays();
    dayContainer.innerHTML = "";

    days.forEach(day => {
        const done = localStorage.getItem(`timeSkip_day_${day}`) === "done";

        const btn = document.createElement("button");

        btn.innerText = day;

        btn.className = `
            px-3 py-2 rounded-lg text-xs font-bold shrink-0
            ${done ? "bg-green-500" : "bg-red-500"}
            text-white
        `;

       btn.onclick = () => {
    selectedDay = day;

    renderSchedule();
    renderDays();

    document.getElementById("selectedDayLabel").innerText = "Day - " + selectedDay;
};

        dayContainer.appendChild(btn);
    });
}

// =====================
// SAVE TASK
// =====================

function saveTask(key, value) {
    localStorage.setItem(key, value);

    addDay(selectedDay);

    renderSchedule();
}

// =====================
// PROGRESS
// =====================

function updateProgress(total, completed) {
    const percent = total === 0 ? 0 : (completed / total) * 100;

    document.getElementById("progressText").innerText =
        `${completed} / ${total} Selesai`;

    document.getElementById("progressFill").style.width =
        percent + "%";
}

// =====================
// STATUS HARI
// =====================

function updateDayStatus(total, completed) {
    const key = `timeSkip_day_${selectedDay}`;

    const isComplete = total > 0 && completed === total;

    const alreadyDone =
        localStorage.getItem(key) === "done";

    if (isComplete) {

        if (!alreadyDone) {
            showSuccessNotification();
        }

        localStorage.setItem(key, "done");

    } else {

        localStorage.removeItem(key);
    }

    document.body.style.border =
        isComplete
            ? "5px solid limegreen"
            : "5px solid red";
}
// =====================
// RENDER SCHEDULE
// =====================

function renderSchedule() {
    if (!taskList) return;

    taskList.innerHTML = "";

    let totalTasks = 0;
    let completedTasks = 0;

    schedule.forEach((session, sessionIndex) => {
        const section = document.createElement("div");
        section.className = "task";

        let html = `
            <h3>${session.time}</h3>
            <h2>${session.title}</h2>
        `;

        session.tasks.forEach((task, taskIndex) => {
            const key = `timeSkip_${selectedDay}_${sessionIndex}_${taskIndex}`;
            const checked = localStorage.getItem(key) === "true";

            if (checked) completedTasks++;
            totalTasks++;

            html += `
                <label>
                    <input type="checkbox"
                        ${checked ? "checked" : ""}
                        onchange="saveTask('${key}', this.checked)">
                    ${task}
                </label><br>
            `;
        });

        section.innerHTML = html;
        taskList.appendChild(section);
    });

    updateProgress(totalTasks, completedTasks);
    updateDayStatus(totalTasks, completedTasks);
}

// =====================
// INIT
// =====================

function initDays() {
    const days = getDays();

    if (days.length === 0) {
        generateDays(730);
    }
}

function showSuccessNotification() {
    const notif = document.getElementById("successNotification");

    notif.classList.remove("hidden");

    setTimeout(() => {
        notif.classList.add("hidden");
    }, 5000);
}

initDays();
renderDays();
renderSchedule();
