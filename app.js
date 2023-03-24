const rollDiceBtn = document.querySelector('#roll-dice');
const holdDiceBtn = document.querySelector('#hold-dice');
const newGameBtn  = document.querySelector('#new-game-btn');
const diceNumbers = document.querySelectorAll('.dice-number');
const maxPoints   = 10;

let prevDiceContent;
let prevDiceElement;
let prevDiceNumber = 0;
let losserPlay     = '';

const player1 = {
    name: 'Player 1',
    total: 0,
    current: 0,
    hasMove: true,
    hasWon: false,
    moves: 0,
    dom: document.querySelector('#player-1'),
    currentId: '#player-1-current-score',
    totalId: '#player-1-total-score'
}
const player2 = {
    name: 'Player 2',
    total: 0,
    current: 0,
    hasMove: false,
    hasWon: false,
    moves: 0,
    dom: document.querySelector('#player-2'),
    currentId: '#player-2-current-score',
    totalId: '#player-2-total-score'
}

newGameBtn.addEventListener('click', function(){
    player1.hasMove = losserPlay === player1.name ? true : false;
    player1.hasWon  = false;
    player1.total   = 0;
    player1.current = 0;
    player1.moves   = 0;

    player2.hasMove = losserPlay === player2.name ? true : false;
    player2.hasWon  = false;
    player2.total   = 0;
    player2.current = 0;
    player2.moves   = 0;

    document.querySelector(player1.currentId).textContent  = '0';
    document.querySelector(player2.currentId).textContent  = '0';

    document.querySelector(player1.totalId).textContent  = '0';
    document.querySelector(player2.totalId).textContent  = '0';

    if ( player1.dom.classList.contains('winner-player') ) {
        player1.dom.classList.remove('winner-player');
    }

    if ( player2.dom.classList.contains('winner-player') ) {
        player2.dom.classList.remove('winner-player');
    }

    if ( player1.name === losserPlay ) {
        player1.dom.className = 'current-player';
        player2.dom.className = 'waiting-player';
    } else {
        player2.dom.className = 'current-player';
        player1.dom.className = 'waiting-player';
    }
    
    document.querySelector('#finish-message').textContent = '';

    if(document.querySelector('#finish-message').classList.contains('show-with-padding')) {
        document.querySelector('#finish-message').classList.remove('show-with-padding');
    }

    if ( ! document.querySelector('.dice-content').classList.contains('hidden') ) {
        document.querySelector('.dice-content').classList.add('hidden');
    }

});

rollDiceBtn.addEventListener('click', function(){
    let dice = getRandomDice();

    while ( dice === prevDiceNumber ) {
        dice = getRandomDice();
    }

    const diceArray   = Array.from(diceNumbers);
    const diceContent = document.querySelector('.dice-content');
    const diceElement = diceArray.find(number => dice === Number(number.dataset.dice) );

    if ( startNewGame() ) {
        document.querySelector('#finish-message').textContent = `Start new game`;
        if ( ! document.querySelector('#finish-message').classList.contains('show-with-padding') ) {
            document.querySelector('#finish-message').classList.add('show-with-padding')
        }
        return false;
    }
    
    if ( player1.hasMove ) {
        calcPlayerTurn(player1, player2, diceContent, diceElement); 
    } else {
        calcPlayerTurn(player2, player1, diceContent, diceElement);
    }

    prevDiceNumber = dice;
});

holdDiceBtn.addEventListener('click', function() {

    if ( startNewGame() ) {
        document.querySelector('#finish-message').textContent = `Start new game`;
        if ( ! document.querySelector('#finish-message').classList.contains('show-with-padding') ) {
            document.querySelector('#finish-message').classList.add('show-with-padding')
        }
        return false;
    }

    if ( player1.hasMove ) {
        savePlayerTotal(player1);

        if ( player1.total >= maxPoints) {
            finishGame(player1, player2);
            return true;
        }

        switchPlayer(player1, player2);
        resetMoves(player1, player2);
    } else {
        savePlayerTotal(player2);

        if ( player2.total >= maxPoints) {
            finishGame(player2, player1);
            return true;
        }
        
        switchPlayer(player2, player1);
        resetMoves(player2, player1);
    }
});

function startNewGame() {
    return player1.hasWon || player2.hasWon;
}

function finishGame(winner, losser) {
    winner.hasWon = true;
    losserPlay    = losser.name;

    winner.dom.classList.remove('current-player');
    winner.dom.classList.add('winner-player');

    document.querySelector('#finish-message').textContent = `${winner.name} won the game`;
    document.querySelector('#finish-message').classList.add('show-with-padding');

    setTimeout(function(){
        document.querySelector('#finish-message').textContent = '';
        document.querySelector('#finish-message').classList.remove('show-with-padding');
    }, 3000);
}

function calcPlayerTurn(currPlayer, otherPlayer, diceContent, diceElement) {
    let score = Number(diceElement.dataset.dice);

    if ( prevDiceContent != undefined && prevDiceElement != undefined ) {
        prevDiceContent.classList.add('hidden');
        prevDiceElement.classList.add('hidden');
    }

    diceContent.classList.remove('hidden');
    diceElement.classList.remove('hidden');

    prevDiceContent = diceContent;
    prevDiceElement = diceElement;

    if ( currPlayer.moves === 0 ) {
        setCurrentResult(currPlayer, score);
        currPlayer.moves++;
        return true;
    } 

    if ( currPlayer.current > score ) {
        resetMoves(currPlayer, otherPlayer);
        setCurrentResult(currPlayer, 0);
        switchPlayer(currPlayer, otherPlayer);
        return true;
    }

    setCurrentResult(currPlayer, score);
    currPlayer.moves++;
    return false;
}

function savePlayerTotal(player) {
    player.total   += player.current;
    player.current = 0;
    document.querySelector(player.currentId).textContent = 0;
    document.querySelector(player.totalId).textContent   = player.total;
}

function resetMoves(currPlayer, otherPlayer) {
    currPlayer.hasMove  = false;
    currPlayer.moves    = 0;
    otherPlayer.hasMove = true;
}

function switchPlayer(currPlayer, otherPlayer) {
    currPlayer.dom.classList.remove('current-player');
    currPlayer.dom.classList.add('waiting-player');
    otherPlayer.dom.classList.remove('waiting-player');
    otherPlayer.dom.classList.add('current-player');
}

function setCurrentResult(player, score) {
    player.current = score;
    document.querySelector(player.currentId).textContent = score;
}

function getRandomDice() {
    return Math.round(Math.random() * 5 + 1);
}