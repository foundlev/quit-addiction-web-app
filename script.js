document.addEventListener('DOMContentLoaded', function() {
    const startDate = new Date(Date.UTC(2025, 5, 2, 15, 49, 0));
    const today = new Date();
    const daysPassedFloat = (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    const daysPassed = Math.floor(daysPassedFloat);

    document.getElementById('numberDays').textContent = daysPassedFloat.toFixed(3);

    const milestones = [4, 12, 30];

    const eventDays = {
        4: "Начало свободы",
        12: "Новый рекорд",
        30: "Оплата ресторана",
        45: "Apple Watch",
        90: "Большой донат"
    };

    const cravings = JSON.parse(localStorage.getItem('cravingsNew6') || '{}');
    const daysContainer = document.getElementById('daysContainer');

    function calculatePushUps(daysPassedFloatLocal, done=0) {
        let result = 0;
        for (let i = 1; i <= daysPassedFloatLocal; i++) {
            result += 20 + 2 * i;
        }
        result -= done;
        if (result < 0) {
            result = 0;
        }
        return 0;
    }

    function calculateAbs(daysPassedFloatLocal, done=0) {
        let result = 0;
        for (let i = 1; i <= daysPassedFloatLocal; i++) {
            result += 20 + 2 * i;
        }
        result -= done;
        if (result < 0) {
            result = 0;
        }
        return 0;
    }

    function uploadExercise() {
        const pushUpsDone = parseInt(localStorage.getItem('pushUpsDoneNew6') || '0');
        const absDone = parseInt(localStorage.getItem('absDoneNew6') || '0');

        const pushUps = calculatePushUps(daysPassedFloat + 1, pushUpsDone);
        const abs = calculateAbs(daysPassedFloat + 1, absDone);

        document.getElementById('numberPushUps').textContent = pushUps.toFixed(0);
        document.getElementById('numberAbs').textContent = abs.toFixed(0);
    }

    uploadExercise();

    document.getElementById('regPushUpsBtn').addEventListener('click', () => {
        const button = document.getElementById('regPushUpsBtn');
        const originalText = button.textContent;

        const pushUpsDone = parseInt(localStorage.getItem('pushUpsDoneNew6') || '0');
        localStorage.setItem('pushUpsDoneNew6', (pushUpsDone + 10).toString());
        uploadExercise();

        button.textContent = "ОК";
        setTimeout(() => {
            button.textContent = originalText;
        }, 200);
    });

    document.getElementById('regAbsBtn').addEventListener('click', () => {
        const button = document.getElementById('regAbsBtn');
        const originalText = button.textContent;

        const absDone = parseInt(localStorage.getItem('absDoneNew6') || '0');
        localStorage.setItem('absDoneNew6', (absDone + 10).toString());
        uploadExercise();

        button.textContent = "ОК";
        setTimeout(() => {
            button.textContent = originalText;
        }, 200);
    })

    function getColor(intensity) {
        const green = [76, 175, 80]; // #4caf50
        const red = [244, 67, 54];   // #f44336

        return `rgb(
            ${Math.floor(green[0] + (red[0] - green[0]) * intensity)},
            ${Math.floor(green[1] + (red[1] - green[1]) * intensity)},
            ${Math.floor(green[2] + (red[2] - green[2]) * intensity)}
        )`;
    }

    for (let i = 0; i < 91; i++) {
        const dayNum = i + 1;
        const dayBlock = document.createElement('div');
        dayBlock.className = 'day-block';
        dayBlock.textContent = dayNum;

        if (milestones.includes(dayNum) || eventDays[dayNum]) {
            dayBlock.classList.add('milestone');
        }

        if (eventDays[dayNum]) {
            dayBlock.dataset.event = eventDays[dayNum];
        }

        daysContainer.appendChild(dayBlock);
    }

    // Анимация заполнения и цвет ломок
    const blocks = document.querySelectorAll('.day-block');
    blocks.forEach((block, idx) => {
        if (idx < daysPassed) {
            setTimeout(() => {
                block.classList.add('active');

                const cravingCount = cravings[idx + 1] || 0;
                if (cravingCount > 0) {
                    const intensity = Math.min(cravingCount / 5, 1);
                    block.style.backgroundColor = getColor(intensity);
                }

            }, idx * 30);
        }

        block.addEventListener('click', () => {
            if (block.dataset.event) {
                document.getElementById('eventText').textContent = block.dataset.event;
                document.getElementById('eventModal').classList.remove('hidden');
            }
        });
    });

    // Ломки
    document.getElementById('addCravingBtn').addEventListener('click', () => {
        const currentDay = daysPassed + 1;
        cravings[currentDay] = (cravings[currentDay] || 0) + 1;
        localStorage.setItem('cravingsNew6', JSON.stringify(cravings));
        location.reload();
    });

    // Модальное окно
    document.getElementById('closeModal').addEventListener('click', () => {
        document.getElementById('eventModal').classList.add('hidden');
    });
});