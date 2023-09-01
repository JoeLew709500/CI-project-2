let character = document.getElementById('character');
let blocks = document.getElementById('blocks');
let barrelHit = true;
let characterBackground = getComputedStyle(character).getPropertyValue('background');
let currentScore = document.getElementById('current-score');
let highScore = document.getElementById('high-score');

let characterChange = 0;
let score = 0;
let topScore = 0;

let counter = setInterval(game, 1);

//make something wait x amount of milliseconds
const sleep = async (ms) => {
    await new Promise(resolve => {
        return setTimeout(resolve,ms)})
}

document.getElementById('game').addEventListener('click', function (event) {
        jump();
});

document.getElementById('play').addEventListener('click', start);

/**
 * Causes the character to jump */
function jump() {
    if (barrelHit) {
        return;
    }
    if (character.classList != 'jump-character')
        character.classList.add('jump-character');
    setTimeout(function () {
        character.classList.remove('jump-character');
    }, 250);
}

/** Starts game */
function start() { 
    if (barrelHit === false) {
        return;
    }
    barrelHit = false;
    generateNewBarrel();
    return;
};


/** runs the game timing for score and if barrel is hit */
function game() {
    if (barrelHit) {
        return;
    }
    characterChange++;
    score++;

    if (characterChange === 50) {
        characterMove();
        characterChange = 0;
    }

    currentScore.innerHTML = `Score: ${score}`
};

/**
 * adds new barrel to game once the barrel has come off the screen
 */
async function generateNewBarrel(newBarrel) {
    let barrel = document.createElement('div');
    // random number of pixels for movement
    let barrelSpeed = Math.floor(Math.random()*3)+2;

    blocks.appendChild(barrel);
    barrel.setAttribute('class','barrel');
    barrel.style.top = (130)+'px';
    barrel.style.left = (480)+'px';

    let barrelLeft = parseInt(window.getComputedStyle(barrel).getPropertyValue('left'));

    while (barrelLeft > 0){
        await sleep(10);
        barrelLeft = barrelLeft - barrelSpeed;
        barrel.style.left = barrelLeft+'px';
        let characterTop = parseInt(window.getComputedStyle(character).getPropertyValue('top'));
        if ((barrelLeft < 30 && barrelLeft > 10 && characterTop >= 130)) {
            barrel.remove();
            alert(`You lost :( ${score}`);
            if (score > topScore) {
                topScore = score;
            }
            highScore.innerHTML = `High Score: ${topScore}`;
            score = 0;
            barrelHit = true;
            return;
        }
    }
    barrel.remove();
    generateNewBarrel()
}

/**
 * Changes character style as the game runs
 */
function characterMove() {
    if (characterBackground === 'red') {
        character.style.background = 'pink';
        characterBackground = 'pink';
    } else {
        character.style.background = 'red';
        characterBackground = 'red';
    }
}