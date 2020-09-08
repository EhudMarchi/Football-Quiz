const question = document.getElementById('question');
const image = document.getElementById('image');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuesions = [];

let questions = [];
var bflat = new Audio();
bflat.src = "ButtonSFX.mp3";
var audio = document.getElementById("myaudio");
  audio.volume = 0.2;
function PlaySound() {
    bflat.play();
}
fetch('questions.json')
    .then((res) => {
        return res.json();
    })
    .then((loadedQuestions) => {
        questions = loadedQuestions;
        startGame();
    })
    .catch((err) => {
        console.error(err);
    });

//CONSTANTS
var CORRECT_BONUS = 10;
const MAX_QUESTIONS = 20;
var secondsLabel = document.getElementById("timer");
var totalSeconds = 30;
        setInterval(setTime, 1000);
        function setTime()
        {
            --totalSeconds;
            secondsLabel.innerHTML = pad(totalSeconds%60);
            if (totalSeconds==0)
            {
              getNewQuestion();
            }
        }
        function pad(val)
        {
            var valString = val + "";
            if(valString.length < 2)
            {
                return "0" + valString;
            }
            else
            {
                return valString;
            }
        }
startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuesions = [...questions];
    getNewQuestion();
};
getNewQuestion = () => {
totalSeconds=30;
    if (availableQuesions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', score);
        //go to the end page
        return window.location.assign('end.html');
    }
    questionCounter++;
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    //Update the progress bar
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuesions.length);
    currentQuestion = availableQuesions[questionIndex];
    question.innerText = currentQuestion.question;
    /*------------------*/
    var img = document.createElement('img');
    img.src = currentQuestion.image;  // The image source from JSON
    document.getElementById( 'image-holder' ).innerHTML = '<img src="'+img.src+'">';
      /*------------------*/
    choices.forEach((choice) => {
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion['choice' + number];
    });

    availableQuesions.splice(questionIndex, 1);
    acceptingAnswers = true;

};

choices.forEach((choice) => {
    choice.addEventListener('click', (e) => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];

        const classToApply =
            selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

        if (classToApply === 'correct') {
            incrementScore(CORRECT_BONUS);
            CORRECT_BONUS+=1;
            let confetti = document.querySelectorAll('.c-confetti em');

            function randomNumber(min, max) {
              return Math.floor(Math.random() * (max - min + 1) + min);
            }

            confetti.forEach(el => {
             let titleWidth = el.offsetWidth;
             let totalConfetti = Math.floor(titleWidth / 10);

             for(var i = 0; i <= totalConfetti; i++) {
              let confetto = "<i style='transform: translate3d(" + (randomNumber(1, 500) - 250) + "px, " + (randomNumber(1, 200) - 150) + "px, 0) rotate(" + randomNumber(1, 360) + "deg); background: hsla(" + randomNumber(1, 360) +", 100%, 50%, 1);'></i>"
              el.insertAdjacentHTML("beforeend", confetto);
             }
            });
        }
        else {
          CORRECT_BONUS=10;
        }

        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 1000);
    });
});

incrementScore = (num) => {
    score += num + totalSeconds;
    scoreText.innerText = score;
};
