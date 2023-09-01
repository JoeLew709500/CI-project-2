let character = document.getElementById('character');
let blocks = document.getElementById('blocks');
let barrelHit = true;
let characterBackground = getComputedStyle(character).getPropertyValue('background');

let checkHit = 0;
let score = 0;

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
    if (character.classList != 'jump-character')
        character.classList.add('jump-character');
    setTimeout(function () {
        character.classList.remove('jump-character');
    }, 250);
}


/** Starts game */
function start() {  
    barrelHit = false;
    generateNewBarrel();
    return;
};


/** runs the game timing for score and if barrel is hit */
function game() {
    if (barrelHit) {
        return;
    }
    checkHit++;
    score++;

    // check if dead and move block every 5ms
    if (checkHit === 5 ) {
        //checkDead();
        checkHit = 0;
    }
};

/**
 * adds new barrel to game once the barrel has come off the screen
 */
async function generateNewBarrel(newBarrel) {
    let barrel = document.createElement('div');
    
    blocks.appendChild(barrel);
    barrel.setAttribute('class','barrel');
    barrel.style.top = (130)+'px';
    barrel.style.left = (480)+'px';

    let barrelLeft = parseInt(window.getComputedStyle(barrel).getPropertyValue('left'));

    while (barrelLeft > 0){
        await sleep(10);
        barrelLeft--;
        barrel.style.left = barrelLeft+'px';
    }
    barrel.remove();
    generateNewBarrel()
}
