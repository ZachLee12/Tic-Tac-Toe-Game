// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}

const gameBoard = (function () {
    const _board = ["", "", "", "", "", "", "", "", ""];

    const getGameBoard = () => _board;

    const setField = (field, char) => {
        _board[field] = char;
    }

    return {
        getGameBoard,
        setField
    }
}());


//player factory
const createPlayer = function (name, team) {
    const playerName = name;
    const playerTeam = team;
    let win = false;
    let playersTurn = false;

    const setWin = boolean => win = boolean;
    const setPlayersTurn = boolean => playersTurn = boolean;
    const getWin = () => win;
    const getPlayersTurn = () => playersTurn;
    const getPlayerName = () => playerName;
    const getPlayerTeam = () => playerTeam;

    return {
        setWin,
        setPlayersTurn,
        getWin,
        getPlayerName,
        getPlayersTurn,
        getPlayerTeam
    }
}

const DOMCache = (function () {
    const cachePlayersInfo = () => {
        let playerOneName = document.getElementById('player1-name').value
        let playerTwoName = document.getElementById('player2-name').value
        let playerOneTeam = document.getElementById('player1-team').value
        let playerTwoTeam = document.getElementById('player2-team').value
        return {
            playerOneName,
            playerOneTeam,
            playerTwoName,
            playerTwoTeam
        }
    }

    //form
    const form = document.querySelector('.player-form')

    //DOM fields
    const DOMFields = (() => {
        let fields = [];
        document.querySelectorAll('.field').forEach((div) => {
            fields.push(div)
        })
        return fields;
    })()

    //player's turn
    const playersTurnDiv = document.querySelector('.players-turn')

    //play button
    const playButton = document.querySelector('#play-btn');
    return {
        playersTurnDiv,
        playButton,
        cachePlayersInfo,
        DOMFields,
        form
    }
})();

//IIFE (main)
const displayController = (function () {
    const render = () => {
        DOMCache.DOMFields.forEach((field) => {
            field.innerHTML = gameBoard.getGameBoard()[field.id];
        })
    }

    const updatePlayersTurn = (name) => {
        DOMCache.playersTurnDiv.innerHTML = `${name}'s turn!`;
    }

    const updateBoard = (field, char, playerName) => {
        gameBoard.setField(field.id, char)
        updatePlayersTurn(playerName)
        render();
    }

    return {
        updateBoard
    }
})();

const gameOverChecker = (function () {
    function _checkWin() {
        //horizontal win
        if (gameBoard.getGameBoard()[0] !== '' && gameBoard.getGameBoard()[0] === gameBoard.getGameBoard()[1] && gameBoard.getGameBoard()[1] === gameBoard.getGameBoard()[2]) {
            modal.style.display = "block";
        }
        else if (gameBoard.getGameBoard()[3] !== '' && gameBoard.getGameBoard()[3] === gameBoard.getGameBoard()[4] && gameBoard.getGameBoard()[4] === gameBoard.getGameBoard()[5]) {
            modal.style.display = "block";
        }
        else if (gameBoard.getGameBoard()[6] !== '' && gameBoard.getGameBoard()[6] === gameBoard.getGameBoard()[7] && gameBoard.getGameBoard()[7] === gameBoard.getGameBoard()[8]) {
            modal.style.display = "block";
        }

        //vertical win
        if (gameBoard.getGameBoard()[0] !== '' && gameBoard.getGameBoard()[0] === gameBoard.getGameBoard()[3] && gameBoard.getGameBoard()[3] === gameBoard.getGameBoard()[6]) {
            modal.style.display = "block";
        }
        else if (gameBoard.getGameBoard()[1] !== '' && gameBoard.getGameBoard()[1] === gameBoard.getGameBoard()[4] && gameBoard.getGameBoard()[4] === gameBoard.getGameBoard()[7]) {
            modal.style.display = "block";
        }
        else if (gameBoard.getGameBoard()[2] !== '' && gameBoard.getGameBoard()[2] === gameBoard.getGameBoard()[5] && gameBoard.getGameBoard()[5] === gameBoard.getGameBoard()[8]) {
            modal.style.display = "block";
        }

        //diagonal win
        if (gameBoard.getGameBoard()[0] !== '' && gameBoard.getGameBoard()[0] === gameBoard.getGameBoard()[4] && gameBoard.getGameBoard()[4] === gameBoard.getGameBoard()[8]) {
            modal.style.display = "block";
        }
        else if (gameBoard.getGameBoard()[2] !== '' && gameBoard.getGameBoard()[2] === gameBoard.getGameBoard()[4] && gameBoard.getGameBoard()[4] === gameBoard.getGameBoard()[6]) {
            modal.style.display = "block";
        }
    }

    function _checkNobodyWins() {
        if (gameBoard.getGameBoard().filter((char) => char === '').length === 0) {
            modal.style.display = "block";
        }
    }

    function checkGameOver() {
        _checkWin();
        _checkNobodyWins();
    }
    return {
        checkGameOver
    }
})();

//main IIFE module
const gameController = (function () {
    DOMCache.playButton.addEventListener('click', () => {
        if (!DOMCache.form.checkValidity()) return;
        const playerInfo = DOMCache.cachePlayersInfo()
        initializeGame(playerInfo.playerOneName, playerInfo.playerOneTeam, playerInfo.playerTwoName, playerInfo.playerTwoTeam)
        modal.style.display = 'none'
    })

    function initializeGame(playerOneName, playerOneTeam, playerTwoName, playerTwoTeam) {
        //players
        const playerOne = createPlayer(playerOneName, playerOneTeam)
        const playerTwo = createPlayer(playerTwoName, playerTwoTeam);
        function placeCharOnField(field) {
            if (field.innerHTML !== "") return;
            if (playerOne.getPlayersTurn()) {
                displayController.updateBoard(field, playerOne.getPlayerTeam(), playerTwo.getPlayerName())
                playerOne.setPlayersTurn(false);
                playerTwo.setPlayersTurn(true);
            } else {
                displayController.updateBoard(field, playerTwo.getPlayerTeam(), playerOne.getPlayerName())
                playerOne.setPlayersTurn(true);
                playerTwo.setPlayersTurn(false);
            }
        }
        //initialize game
        playerOne.setPlayersTurn(true);
        DOMCache.DOMFields.forEach((field) => {
            field.addEventListener('click', placeCharOnField.bind(this, field));
            field.addEventListener('click', gameOverChecker.checkGameOver);
        })
    }
})();


