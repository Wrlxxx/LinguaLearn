const wordPairs = [
    { russian: "дом", english: "house" },
    { russian: "кот", english: "cat" },
    { russian: "собака", english: "dog" },
    { russian: "солнце", english: "sun" },
    { russian: "вода", english: "water" },
    { russian: "книга", english: "book" },
    { russian: "стол", english: "table" },
    { russian: "стул", english: "chair" },
    { russian: "окно", english: "window" },
    { russian: "дверь", english: "door" },
    { russian: "машина", english: "car" },
    { russian: "город", english: "city" },
    { russian: "страна", english: "country" },
    { russian: "человек", english: "person" },
    { russian: "работа", english: "work" }
];

let currentWordIndex = 0;
let wordsLearned = 0;
let correctAnswers = 0;
let currentStreak = 0;
let maxStreak = 0;

let achievements = {
    firstWords: { unlocked: false, progress: 0, target: 10 },
    vocabularyBuilder: { unlocked: false, progress: 0, target: 50 },
    perfectDay: { unlocked: false, progress: 0, target: 7 },
    speedDemon: { unlocked: false, progress: 0, target: 10 }
};

const wordDisplay = document.getElementById('wordDisplay');
const optionsContainer = document.getElementById('optionsContainer');
const nextWordBtn = document.getElementById('nextWordBtn');
const hintBtn = document.getElementById('hintBtn');
const progressElement = document.getElementById('progress');
const wordsLearnedElement = document.getElementById('wordsLearned');
const correctAnswersElement = document.getElementById('correctAnswers');
const currentStreakElement = document.getElementById('currentStreak');
const accuracyElement = document.getElementById('accuracy');
const flashcard = document.getElementById('flashcard');
const cardFront = document.getElementById('cardFront');
const cardBack = document.getElementById('cardBack');
const nextCardBtn = document.getElementById('nextCardBtn');
const flipCardBtn = document.getElementById('flipCardBtn');

function updateStats() {
    wordsLearnedElement.textContent = wordsLearned;
    correctAnswersElement.textContent = correctAnswers;
    currentStreakElement.textContent = currentStreak;
    
    const accuracy = wordsLearned > 0 ? Math.round((correctAnswers / wordsLearned) * 100) : 0;
    accuracyElement.textContent = `${accuracy}%`;
    
    progressElement.textContent = `Слов изучено: ${wordsLearned}`;
    
    checkAchievements();
}

function getRandomWordIndex(excludeIndex) {
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * wordPairs.length);
    } while (randomIndex === excludeIndex);
    return randomIndex;
}

function displayNewWord() {
    const currentWord = wordPairs[currentWordIndex];
    
    wordDisplay.textContent = currentWord.russian;
    
    optionsContainer.innerHTML = '';
    
    const options = [currentWord.english];
    
    for (let i = 0; i < 3; i++) {
        const randomIndex = getRandomWordIndex(currentWordIndex);
        options.push(wordPairs[randomIndex].english);
    }
    
    shuffleArray(options);
    
    options.forEach(option => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.textContent = option;
        optionElement.addEventListener('click', () => checkAnswer(option, currentWord.english));
        optionsContainer.appendChild(optionElement);
    });
    
    updateStats();
}

function checkAnswer(selectedAnswer, correctAnswer) {
    const options = document.querySelectorAll('.option');
    
    options.forEach(option => {
        option.style.pointerEvents = 'none';
        
        if (option.textContent === correctAnswer) {
            option.classList.add('correct');
        }
        
        if (option.textContent === selectedAnswer && selectedAnswer !== correctAnswer) {
            option.classList.add('incorrect');
        }
    });
    
    wordsLearned++;
    
    if (selectedAnswer === correctAnswer) {
        correctAnswers++;
        currentStreak++;
        if (currentStreak > maxStreak) {
            maxStreak = currentStreak;
        }
    } else {
        currentStreak = 0;
    }
    
    updateStats();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function displayFlashcard() {
    const card = wordPairs[currentWordIndex];
    cardFront.textContent = card.russian;
    cardBack.textContent = card.english;
}

function checkAchievements() {
    achievements.firstWords.progress = wordsLearned;
    if (wordsLearned >= achievements.firstWords.target && !achievements.firstWords.unlocked) {
        unlockAchievement('firstWords');
    }
    updateAchievementProgress('firstWords');
    
    achievements.vocabularyBuilder.progress = wordsLearned;
    if (wordsLearned >= achievements.vocabularyBuilder.target && !achievements.vocabularyBuilder.unlocked) {
        unlockAchievement('vocabularyBuilder');
    }
    updateAchievementProgress('vocabularyBuilder');
    
    achievements.perfectDay.progress = currentStreak;
    if (currentStreak >= achievements.perfectDay.target && !achievements.perfectDay.unlocked) {
        unlockAchievement('perfectDay');
    }
    updateAchievementProgress('perfectDay');
    
    if (correctAnswers >= 5 && !achievements.speedDemon.unlocked) {
        achievements.speedDemon.progress = Math.min(correctAnswers / 2, achievements.speedDemon.target);
        updateAchievementProgress('speedDemon');
    }
}

function unlockAchievement(achievementId) {
    achievements[achievementId].unlocked = true;
    const achievementCard = document.getElementById(achievementId);
    achievementCard.classList.remove('achievement-locked');
    achievementCard.classList.add('achievement-unlocked');
    
    showAchievementNotification(achievementId);
}

function updateAchievementProgress(achievementId) {
    const achievement = achievements[achievementId];
    const progressFill = document.getElementById(achievementId + 'Progress');
    const progressPercent = Math.min((achievement.progress / achievement.target) * 100, 100);
    progressFill.style.width = progressPercent + '%';
}

function showAchievementNotification(achievementId) {
    const achievementNames = {
        firstWords: "Первые слова",
        vocabularyBuilder: "Строитель словаря", 
        perfectDay: "Идеальный день",
        speedDemon: "Скоростной демон"
    };
    
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
        <div class="notification-icon">🎉</div>
        <div class="notification-content">
            <h4>Достижение разблокировано!</h4>
            <p>${achievementNames[achievementId]}</p>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

nextWordBtn.addEventListener('click', () => {
    currentWordIndex = Math.floor(Math.random() * wordPairs.length);
    displayNewWord();
});

hintBtn.addEventListener('click', () => {
    const currentWord = wordPairs[currentWordIndex];
    alert(`Подсказка: слово начинается на "${currentWord.english[0]}"`);
});

flashcard.addEventListener('click', () => {
    flashcard.classList.toggle('flipped');
});

flipCardBtn.addEventListener('click', () => {
    flashcard.classList.toggle('flipped');
});

nextCardBtn.addEventListener('click', () => {
    currentWordIndex = Math.floor(Math.random() * wordPairs.length);
    displayFlashcard();
    if (flashcard.classList.contains('flipped')) {
        flashcard.classList.remove('flipped');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    updateStats();
    displayNewWord();
    displayFlashcard();
    
    wordsLearned = 0;
    correctAnswers = 0;
    currentStreak = 0;
    updateStats();
});
