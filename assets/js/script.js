let character = document.getElementById('character');
let blocks = document.getElementById('blocks');
let barrelHit = true;
let characterBackground = 'rightArmForward'
let currentScore = document.getElementById('current-score');
let highScore = document.getElementById('high-score');

// define slide sections
let home = document.getElementById('home-section');
let instructions = document.getElementById('instructions-section');
let review = document.getElementById('review-section');
let gameRPSLS = document.getElementById('game-rpsls')
let gameBarrelJump = document.getElementById('game-barrel-jump');
let gameBarrelJumpInstruct = document.getElementById('barrel-jump-instruct');

let characterChange = 0;
let score = 0;
let topScore = 0;

setInterval(game, 1);

//make something wait x amount of milliseconds
const sleep = async (ms) => {
    await new Promise(resolve => {
        return setTimeout(resolve, ms)
    })
}

document.getElementById('game').addEventListener('click', function (event) {
    jump();
});

document.getElementById('play').addEventListener('click', start);

// display Barrel Jump Instructions
document.getElementById('barrel-jump-instruct').addEventListener('click', function() {
    displayModal('Instructions','To play barrel jump you must jump over all of the barrels coming from the left of the screen. To jump you must click on the game screen.','How to play')
});

// display RPSLS Instructions
document.getElementById('rpsls-instruct').addEventListener('click', function() {
    displayModal('Instructions',`<p>To play Rock Paper Scissors Lizard Spock also known as RPSLS, you must select one of the hands below.</p>
<ul>
  <li><i class="fa-regular fa-hand-back-fist"></i> - Rock (Beats scissors and lizard)</li>
  <li><i class="fa-regular fa-hand"></i> - Paper (Beats rock and Spock)</li>
  <li><i class="fa-regular fa-hand-scissors"></i> - Scissors (Beats paper and lizard)</li>
  <li><i class="fa-regular fa-hand-lizard"></i> - Lizard (Beats paper and Spock)</li>
  <li><i class="fa-regular fa-hand-spock"></i> - Spock (Beats scissors and rock)</li>
</ul>`,'How to play')
});

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
    let barrelSpeed = Math.floor(Math.random() * 3) + 2;
    // gets screen game size for where barrel starts
    let gameWidth = parseInt(window.getComputedStyle(document.getElementById('game')).getPropertyValue('width'));

    blocks.appendChild(barrel);
    barrel.setAttribute('class', 'barrel');
    barrel.style.top = (35) + 'px';
    //takes off 20 for the width of the barrel
    barrel.style.left = (gameWidth-20) + 'px';

    let barrelLeft = parseInt(window.getComputedStyle(barrel).getPropertyValue('left'));

    while (barrelLeft > 0) {
        await sleep(10);
        barrelLeft = barrelLeft - barrelSpeed;
        barrel.style.left = barrelLeft + 'px';
        let characterTop = parseInt(window.getComputedStyle(character).getPropertyValue('top'));
        if ((barrelLeft < 30 && barrelLeft > 10 && characterTop > 20)) {
            barrel.remove();
            displayModal(`You lost`,`High Score: ${topScore}`,`Your score: ${score}`);
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
    if (characterBackground === 'rightArmForward') {
        character.style.backgroundImage = 'url("/assets/images/character-2.png")';
        characterBackground = 'leftArmForward';
    } else {
        character.style.backgroundImage = 'url("/assets/images/character-1.png")';
        characterBackground = 'rightArmForward';
    }
}

//DOM content event listener
document.addEventListener("DOMContentLoaded", function () {
    let navLinks = document.getElementsByTagName('a');


    //slides
    for (let link of navLinks) {
        link.addEventListener('click', function () {
            let selectedLink = this.id;
            if (selectedLink === 'home') {
                home.classList.remove('slide-animation');
                home.style.display = 'grid';
                home.classList.add('slide-animation');
                review.style.display = 'none';
                gameRPSLS.style.display = 'none';
                gameBarrelJump.style.display = 'none';
            }  else if (selectedLink === 'review') {
                home.style.display = 'none';
                review.style.display = 'block';
                review.classList.add('slide-animation');
                gameRPSLS.style.display = 'none';
                gameBarrelJump.style.display = 'none';
            } else if (selectedLink === 'game-rpsls-nav') {
                home.style.display = 'none';
                review.style.display = 'none';
                gameRPSLS.classList.add('slide-animation');
                gameRPSLS.style.display = 'grid';
                gameBarrelJump.style.display = 'none';
            } else if (selectedLink === 'game-barrel-jump-nav') {
                home.style.display = 'none';
                review.style.display = 'none';
                gameRPSLS.style.display = 'none';
                gameBarrelJump.style.display = 'grid';
                gameBarrelJump.classList.add('slide-animation');
            }
        })
    }

    //rpsls button listeners
    let buttons = document.getElementsByClassName('game-button');

    for (let button of buttons) {
        button.addEventListener('click', function () {
            let userSelected = this.getAttribute("data-type");

            rpslsGame(userSelected);
        })
    }
})

// rpsls game

let userScore = 0;
let computerScore = 0;
let checkResultsDic = [
    //first word is user second is computer
    {merged:'rockpaper',text: 'Paper covers rock you lose',winner:'comp'},
    {merged:'rockscissors',text: 'Rock crushes scissors you win',winner:'user'},
    {merged: 'rocklizard',text: 'Rock crushes lizard you win',winner:'user'},
    {merged: 'rockspock',text: 'Spock vaporises rock you lose',winner:'comp'},
    {merged:'paperrock',text: 'Paper covers rock you win',winner:'user'},
    {merged:'paperscissors',text: 'Scissors cuts paper you lose',winner:'comp'},
    {merged: 'paperlizard',text: 'Lizard eats paper you lose',winner:'comp'},
    {merged:'paperspock',text: 'Paper disproves of Spock you win',winner:'user'},
    {merged:'scissorsrock',text: 'Rock crushes scissors you lose',winner:'comp'},
    {merged:'scissorspaper',text: 'Scissors cuts paper you win',winner:'user'},
    {merged:'scissorslizard',text: 'Scissors decapitates lizard you win',winner:'user'},
    {merged:'scissorsspock',text: 'Spock smashes scissors you lose',winner:'comp'},
    {merged:'lizardrock',text: 'Rock crushes lizard you lose',winner:'comp'},
    {merged:'lizardpaper',text: 'Lizard eats paper you win',winner:'user'},
    {merged:'lizardscissors',text: 'Scissors decapitates lizard you lose',winner:'comp'},
    {merged:'lizardspock',text: 'Lizard poisons Spock you win',winner:'user'},
    {merged:'spockpaper',text:'Spock vaporizes rock you win',winner:'user'},
    {merged:'spockrock',text:'Paper disproves Spock you lose',winner:'comp'},
    {merged:'spockscissors',text:'Spock smashes scissor you win',winner:'user'},
    {merged:'spocklizard',text:'Lizard poisons Spock you lose',winner:'comp'},
];

function rpslsGame(userSelected) {
    let computerSelected = null;
    //show user what they selected
    document.getElementById('user-selected').innerHTML = `You selected: ${userSelected}`;

    //computer to select its hand
    if (Math.random() < 0.2) {
        computerSelected = 'rock';
    } else if (Math.random() < 0.4) {
        computerSelected = 'paper';
    } else if (Math.random() < 0.6) {
        computerSelected = 'scissors';
    }
    else if (Math.random() < 0.8) {
        computerSelected = 'lizard';
    }
    else {
        computerSelected = 'spock';
    }
    //shows user what computer selected
    document.getElementById('computer-selected').innerHTML = `Computer selected: ${computerSelected}`;

    rpslsCompareSelected(userSelected,computerSelected);
}

function rpslsCompareSelected(userSelected,computerSelected) {
    let mergedSelected = userSelected+computerSelected;
    let rpslsResult = document.getElementById('result');
    if (userSelected === computerSelected) {
        rpslsResult.innerHTML = `Draw you both selected ${computerSelected}`;
    } else {
        for (let i = 0;i<checkResultsDic.length;i++) {
            if (checkResultsDic[i].merged === mergedSelected) {
                rpslsResult.innerHTML = checkResultsDic[i].text;
                if (checkResultsDic[i].winner==='user') {
                    userScore++;
                    document.getElementById('user-score').innerHTML = `User score: ${userScore}`;
                } else {
                    computerScore++;
                    document.getElementById('computer-score').innerHTML = `Computer score: ${computerScore}`;
                }
                rpslsGameOver();
            }
        };
    }
}
/**
 * Checks if rpsls is over (first to 5 wins)
*/
function rpslsGameOver() {
    if (userScore===5) {
        displayModal('You win',`Computers score: ${computerScore}`,`Your score: ${userScore}`);
        userScore = 0;
        computerScore = 0;
    } else if (computerScore===5) {
        displayModal('You lose',`Computers score: ${computerScore}`,`Your score: ${userScore}`);
        userScore = 0;
        computerScore = 0;
    }
}

/**
 * displays modal*/
function displayModal(gameOverText,line2,line1) {
    let modal = document.getElementById('game-modal')
    let modalHeader = modal.children[0];
    let modalPara = modal.children[1];
    let modalButton = modal.children[2];

    modalButton.addEventListener('click', function() {
        modal.close();
    })

    modal.showModal();
    modalHeader.innerHTML = gameOverText;
    modalPara.innerHTML = `${line1} <br>${line2}`;
}
