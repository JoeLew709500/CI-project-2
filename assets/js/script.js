let character = document.getElementById('character');
let barrels = document.getElementById('barrels');
let barrelHit = true;
let characterBackground = getComputedStyle(character).getPropertyValue('background');

document.addEventListener('keydown', function (event) {
    if (event.code === 'Space') {
        jump();
    }
});

function jump() {
    if (character.classList != 'jump-character')
        character.classList.add('jump-character');
    setTimeout(function () {
        character.classList.remove('jump-character');
    }, 250);
    ;
}