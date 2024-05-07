document.addEventListener('DOMContentLoaded', function() {
    const now = new Date();
    const day = now.getDate(); // Получаем текущий день
    const month = now.getMonth() + 1; // Получаем текущий месяц (нумерация месяцев начинается с 0)

    const quoteIndex = (day + month) % 208; // Получаем индекс цитаты

    fetch('quotes.json')
        .then(response => response.json())
        .then(quotes => {
            const quoteContainer = document.getElementById('quoteContainer');
            quoteContainer.textContent = quotes[quoteIndex];
        })
        .catch(error => console.error('Ошибка загрузки цитат: ', error));

    const settingsButton = document.getElementById('settingsButton');
    let intervalId; // Хранение ID интервала для возможности его остановки

    settingsButton.addEventListener('click', function() {
        const inputTimestamp = prompt("Введите новый timestamp (в миллисекундах):");
        if (inputTimestamp) {
            const newTime = parseInt(inputTimestamp, 10);
            if (!isNaN(newTime)) {
                localStorage.setItem('startTime', newTime);
                clearInterval(intervalId);
                updateTimer(newTime);
            } else {
                alert("Введено некорректное значение. Пожалуйста, введите число.");
            }
        }
    });

    resetButton.addEventListener('click', function(event) {
        if (confirm("Вы уверены, что хотите сбросить текущий прогресс?")) {
            const now = new Date().getTime();
            localStorage.setItem('startTime', now);
            clearInterval(intervalId);  // Очистка текущего интервала перед установкой нового
            updateTimer(now);  // Сброс таймера и начало отсчета с текущего момента
        }
    });

    function updateTimer(startTime) {
        if (intervalId) {
            clearInterval(intervalId);
        }
        intervalId = setInterval(() => {
            const now = new Date().getTime();
            const elapsedTime = now - startTime;
            const totalDuration = 90 * 24 * 60 * 60 * 1000;
            const elapsedPercentage = (elapsedTime / totalDuration * 100).toFixed(2);
            const progressBar = document.getElementById('progress-bar');
            const timerElement = document.getElementById('timer');
            const percentageElement = document.getElementById('percentage');

            timerElement.textContent = formatTime(elapsedTime);
            progressBar.style.width = `${elapsedPercentage}%`;
            percentageElement.textContent = `${elapsedPercentage}%`;

            // Отображение медалей
            const days = Math.floor(elapsedTime / (1000 * 60 * 60 * 24));
            document.querySelectorAll('.medal').forEach(function(medal) {
                const medalDays = parseInt(medal.alt.split(" ")[0]);
                if (medalDays <= days) {
                    medal.style.display = "inline";
                } else {
                    medal.style.display = "none";
                }
            });
        }, 1000);
    }

    function formatTime(ms) {
        const days = Math.floor(ms / (1000 * 60 * 60 * 24));
        const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((ms % (1000 * 60)) / 1000);
        return `${days.toString().padStart(2, '0')}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    // Запуск таймера при загрузке страницы
    let startTime = localStorage.getItem('startTime');
    if (!startTime) {
        startTime = new Date().getTime();
        localStorage.setItem('startTime', startTime);
    }
    updateTimer(startTime);
});
