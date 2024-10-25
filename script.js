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

            // Вычисляем количество дней с округлением в большую сторону
            const days = elapsedTime / (1000 * 60 * 60 * 24);

            let message = '';
            if (days < 5) {
                message = 'Меньше 6 дней';
            } else if (days > 15) {
                message = 'Больше 15 дней';
            } else {
                message = 'Больше 6 дней';
            }

            timerElement.textContent = message;
            progressBar.style.width = `${elapsedPercentage}%`;
//            percentageElement.textContent = `${elapsedPercentage}%`;

//            // Отображение медалей
//            const days = Math.floor(elapsedTime / (1000 * 60 * 60 * 24));
//            document.querySelectorAll('.medal').forEach(function(medal) {
//                const medalDays = parseInt(medal.alt.split(" ")[0]);
//                if (medalDays <= days) {
//                    medal.style.display = "inline";
//                } else {
//                    medal.style.display = "none";
//                }
//            });
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

    // Переключение изображений медалей и кнопок в зависимости от текущей темы
    const medals = document.querySelectorAll('.medal'); // Выбираем все элементы с классом 'medal'
    const buttons = document.querySelectorAll('#settingsButton img, #resetButton img'); // Выбираем все изображения кнопок
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)'); // Создаем объект MediaQueryList для отслеживания изменения темы

    function updateImages(e) {
        // Функция для обновления изображений
        medals.forEach(medal => {
            // Для каждого элемента 'medal'
            medal.src = e.matches ? medal.getAttribute('data-dark') : medal.getAttribute('data-light');
            // Устанавливаем атрибут 'src' в зависимости от текущей темы: 'data-dark' для темной темы и 'data-light' для светлой
        });
        buttons.forEach(button => {
            // Для каждого изображения кнопок
            button.src = e.matches ? button.getAttribute('data-dark') : button.getAttribute('data-light');
            // Устанавливаем атрибут 'src' в зависимости от текущей темы: 'data-dark' для темной темы и 'data-light' для светлой
        });
    }

    function calculateAnxiety(t) {
        const days = t / 86400;
        const phase1 = 40 / (1 + Math.exp(0.5 * (days - 7)));
        const phase2 = 50 / (1 + Math.exp(-0.5 * (days - 18))) + 20;
        const phase3 = 73 / (1 + Math.exp(0.2 * (days - 45)));
        const phase4 = 4 / (1 + Math.exp(0.2 * (days - 75)));

        let anxiety;
        if (days < 7) {
            anxiety = phase1;
        } else if (days < 30) {
            anxiety = phase2;
        } else if (days < 60) {
            anxiety = phase3;
        } else {
            anxiety = phase4;
        }
        return Math.max(0, Math.min(100, anxiety));
    }

    function calculateSociality(t) {
        const days = t / 86400;
        const phase1 = 30 - 3 * days;
        const phase2 = 55 / (1 + Math.exp(0.5 * (days - 2)));
        const phase3 = 51 / (1 + Math.exp(-0.25 * (days - 18))) - 1;
        const phase4 = 40 / (1 + Math.exp(-0.1 * (days - 45))) + 40;
        const phase5 = 60 / (0.65 + Math.exp(-0.06 * (days - 45))) + 16;

        let sociality;
        if (days < 3) {
            sociality = phase1;
        } else if (days < 7) {
            sociality = phase2;
        } else if (days < 30) {
            sociality = phase3;
        } else if (days < 60) {
            sociality = phase4;
        } else {
            sociality = phase5;
        }
        return Math.max(0, Math.min(100, sociality));
    }

    function calculateSleepQuality(t) {
        const days = t / 86400;
        const phase1 = 40 - 20 / (1 + Math.exp(-1 * (days - 3)));
        const phase2 = 20 + 40 / (1 + Math.exp(-0.2 * (days - 18)));
        const phase3 = 50 + 50 / (1 + Math.exp(-0.1 * (days - 45)));
        const phase4 = 90 + 14 / (1 + Math.exp(-0.1 * (days - 75)));

        let sleepQuality;
        if (days < 3) {
            sleepQuality = phase1;
        } else if (days < 30) {
            sleepQuality = phase2;
        } else if (days < 60) {
            sleepQuality = phase3;
        } else {
            sleepQuality = phase4;
        }
        return Math.max(0, Math.min(100, sleepQuality));
    }

    function calculateImpulsivity(t) {
        const days = t / 86400;
        const phase1 = 80 / (1 + Math.exp(-0.3 * (days - 3)));
        const phase2 = 80 - 40 / (1 + Math.exp(-0.2 * (days - 18)));
        const phase3 = 49 - 30 / (1 + Math.exp(-0.1 * (days - 45)));
        const phase4 = 36 - 50 / (1 + Math.exp(-0.08 * (days - 75)));

        let impulsivity;
        if (days < 7) {
            impulsivity = phase1;
        } else if (days < 30) {
            impulsivity = phase2;
        } else if (days < 60) {
            impulsivity = phase3;
        } else {
            impulsivity = phase4;
        }
        return Math.max(0, Math.min(100, impulsivity));
    }

    function calculateEnergy(t) {
        const days = t / 86400;
        const phase1 = 50 - 15 * days;
        const phase2 = 35 - 15 / (1 + Math.exp(-1 * (days - 5)));
        const phase3 = 20 + 30 / (1 + Math.exp(-0.3 * (days - 11)));
        const phase4 = 50 + 25 / (1 + Math.exp(-0.2 * (days - 18)));
        const phase5 = 75 + 15 / (1 + Math.exp(-0.1 * (days - 25)));
        const phase6 = 90 - 5 / (1 + Math.exp(-0.05 * (days - 38)));
        const phase7 = 85 + 10 / (1 + Math.exp(-0.03 * (days - 53)));
        const phase8 = 95 - 5 / (1 + Math.exp(-0.02 * (days - 68)));
        const phase9 = 90 + 10 / (1 + Math.exp(-0.01 * (days - 83)));

        let energy;
        if (days < 3) {
            energy = phase1;
        } else if (days < 8) {
            energy = phase2;
        } else if (days < 15) {
            energy = phase3;
        } else if (days < 22) {
            energy = phase4;
        } else if (days < 31) {
            energy = phase5;
        } else if (days < 46) {
            energy = phase6;
        } else if (days < 61) {
            energy = phase7;
        } else if (days < 76) {
            energy = phase8;
        } else {
            energy = phase9;
        }
        return Math.max(0, Math.min(100, energy));
    }
    // Функция для обновления цвета параметров
    function getColor(value, isPositive) {
        if (isPositive) {
            const red = Math.min(255, Math.floor(255 - 2.55 * value));
            const green = Math.min(255, Math.floor(100 + 1.55 * value));
            return `rgb(${red}, ${green}, 0)`;
        } else {
            const red = Math.min(255, Math.floor(100 + 1.55 * value));
            const green = Math.min(255, Math.floor(255 - 2.55 * value));
            return `rgb(${red}, ${green}, 0)`;
        }
    }
    // Функция для обновления всех параметров (↑↓)
    function updateParameters(timeElapsed) {
        const now = new Date().getTime();
        const elapsedSeconds = Math.floor((now - startTime) / 1000);
        const twelveHoursInSeconds = 12 * 60 * 60;
        const twelveHoursAgo = elapsedSeconds - twelveHoursInSeconds;

        const currentAnxiety = calculateAnxiety(elapsedSeconds);
        const currentSociality = calculateSociality(elapsedSeconds);
        const currentSleepQuality = calculateSleepQuality(elapsedSeconds);
        const currentImpulsivity = calculateImpulsivity(elapsedSeconds);
        const currentEnergy = calculateEnergy(elapsedSeconds);

        const anxietyElement = document.getElementById('anxiety-level');
        const socialityElement = document.getElementById('sociality-level');
        const sleepQualityElement = document.getElementById('sleep-quality');
        const impulsivityElement = document.getElementById('impulsivity-level');
        const energyElement = document.getElementById('energy-level');

        if (twelveHoursAgo > 0) {
            const pastAnxiety = calculateAnxiety(twelveHoursAgo);
            const pastSociality = calculateSociality(twelveHoursAgo);
            const pastSleepQuality = calculateSleepQuality(twelveHoursAgo);
            const pastImpulsivity = calculateImpulsivity(twelveHoursAgo);
            const pastEnergy = calculateEnergy(twelveHoursAgo);

            anxietyElement.textContent = `${currentAnxiety > pastAnxiety ? '↑' : '↓'} ${currentAnxiety.toFixed(0)}`;
            socialityElement.textContent = `${currentSociality > pastSociality ? '↑' : '↓'} ${currentSociality.toFixed(0)}`;
            sleepQualityElement.textContent = `${currentSleepQuality > pastSleepQuality ? '↑' : '↓'} ${currentSleepQuality.toFixed(0)}`;
            impulsivityElement.textContent = `${currentImpulsivity > pastImpulsivity ? '↑' : '↓'} ${currentImpulsivity.toFixed(0)}`;
            energyElement.textContent = `${currentEnergy > pastEnergy ? '↑' : '↓'} ${currentEnergy.toFixed(0)}`;
        } else {
            anxietyElement.textContent = currentAnxiety.toFixed(0);
            socialityElement.textContent = currentSociality.toFixed(0);
            sleepQualityElement.textContent = currentSleepQuality.toFixed(0);
            impulsivityElement.textContent = currentImpulsivity.toFixed(0);
            energyElement.textContent = currentEnergy.toFixed(0);
        }

        anxietyElement.style.color = getColor(currentAnxiety, false);
        socialityElement.style.color = getColor(currentSociality, true);
        sleepQualityElement.style.color = getColor(currentSleepQuality, true);
        impulsivityElement.style.color = getColor(currentImpulsivity, false);
        energyElement.style.color = getColor(currentEnergy, true);
    }

    updateParameters(startTime);

    const updateTheme = (e) => {
        if (e.matches) {
            document.querySelector('meta[name="theme-color"]').setAttribute('content', '#1e1e1e');
        } else {
            document.querySelector('meta[name="theme-color"]').setAttribute('content', '#ffffff');
        }
    };

    mediaQuery.addListener(updateImages); // Добавляем слушатель изменений темы
    mediaQuery.addListener(updateTheme);
    updateImages(mediaQuery); // Вызываем функцию для первоначальной установки изображений в зависимости от текущей темы
    updateTheme(mediaQuery);

    // Переменные для отслеживания жестов
    let touchStartY = 0;
    let touchEndY = 0;

    const refreshIndicator = document.createElement('div');
    refreshIndicator.className = 'refresh-indicator';
    refreshIndicator.textContent = 'Перезагрузка...';
    document.body.appendChild(refreshIndicator);

    document.addEventListener('touchstart', function(event) {
        touchStartY = event.touches[0].clientY;
    });

    document.addEventListener('touchmove', function(event) {
        touchEndY = event.touches[0].clientY;
        if (touchEndY > touchStartY + 100) {
            refreshIndicator.style.display = 'block';
        }
    });

    document.addEventListener('touchend', function() {
        if (touchEndY > touchStartY + 100) {
            setTimeout(function() {
                location.reload();
            }, 500); // Ждем завершения анимации перед перезагрузкой страницы
        } else {
            refreshIndicator.style.display = 'none';
        }
        touchStartY = 0;
        touchEndY = 0;
    });
});
