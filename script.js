
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

    //modals
    const playerFormModal = document.getElementById("player-form-modal");
    const winnerModal = document.getElementById("winner-modal");
    const winnerNameContainer = document.querySelector('.winner')

    return {
        playersTurnDiv,
        playButton,
        cachePlayersInfo,
        DOMFields,
        form,
        playerFormModal,
        winnerModal,
        winnerNameContainer
    }
})();

//IIFE (main)
const displayController = (function () {
    const _render = () => {
        DOMCache.DOMFields.forEach((field) => {
            field.innerHTML = gameBoard.getGameBoard()[field.id];
        })
    }

    const _updatePlayersTurn = (name) => {
        DOMCache.playersTurnDiv.innerHTML = `${name}'s turn!`;
    }

    const updateBoard = (field, char, playerName) => {
        gameBoard.setField(field.id, char)
        _updatePlayersTurn(playerName)
        _render();
    }

    const displayPlayerFormModal = (value) => {
        DOMCache.playerFormModal.style.display = `${value}`
    }

    const displayWinnerModal = (winner, value) => {
        DOMCache.winnerNameContainer.textContent = winner;
        DOMCache.winnerModal.style.display = `${value}`;
    }

    return {
        updateBoard,
        displayPlayerFormModal,
        displayWinnerModal
    }
})();

const gameOverChecker = (function () {
    function _checkWin() {
        //horizontal win
        if (gameBoard.getGameBoard()[0] !== '' && gameBoard.getGameBoard()[0] === gameBoard.getGameBoard()[1] && gameBoard.getGameBoard()[1] === gameBoard.getGameBoard()[2]) {
            return true;
        }
        else if (gameBoard.getGameBoard()[3] !== '' && gameBoard.getGameBoard()[3] === gameBoard.getGameBoard()[4] && gameBoard.getGameBoard()[4] === gameBoard.getGameBoard()[5]) {
            return true;
        }
        else if (gameBoard.getGameBoard()[6] !== '' && gameBoard.getGameBoard()[6] === gameBoard.getGameBoard()[7] && gameBoard.getGameBoard()[7] === gameBoard.getGameBoard()[8]) {
            return true;
        }

        //vertical win
        if (gameBoard.getGameBoard()[0] !== '' && gameBoard.getGameBoard()[0] === gameBoard.getGameBoard()[3] && gameBoard.getGameBoard()[3] === gameBoard.getGameBoard()[6]) {
            return true;
        }
        else if (gameBoard.getGameBoard()[1] !== '' && gameBoard.getGameBoard()[1] === gameBoard.getGameBoard()[4] && gameBoard.getGameBoard()[4] === gameBoard.getGameBoard()[7]) {
            return true;
        }
        else if (gameBoard.getGameBoard()[2] !== '' && gameBoard.getGameBoard()[2] === gameBoard.getGameBoard()[5] && gameBoard.getGameBoard()[5] === gameBoard.getGameBoard()[8]) {
            return true;
        }

        //diagonal win
        if (gameBoard.getGameBoard()[0] !== '' && gameBoard.getGameBoard()[0] === gameBoard.getGameBoard()[4] && gameBoard.getGameBoard()[4] === gameBoard.getGameBoard()[8]) {
            return true;
        }
        else if (gameBoard.getGameBoard()[2] !== '' && gameBoard.getGameBoard()[2] === gameBoard.getGameBoard()[4] && gameBoard.getGameBoard()[4] === gameBoard.getGameBoard()[6]) {
            return true;
        }
    }

    function _checkNobodyWins() {
        if (gameBoard.getGameBoard().filter((char) => char === '').length === 0) {
            displayController.displayPlayerFormModal('block')
        }
    }

    function checkGameOver() {
        let someoneWon = (function () { _checkWin })();
        let nobodyWon = (function () { _checkNobodyWins })();
    }
    return {
        checkGameOver
    }
})();

//main IIFE module
const gameController = (function () {
    //initialize game after playerFormModal is filled and 'Let's play' is clicked
    DOMCache.playButton.addEventListener('click', () => {
        if (!DOMCache.form.checkValidity()) return;
        const playerInfo = DOMCache.cachePlayersInfo()
        initializeGame(playerInfo.playerOneName, playerInfo.playerOneTeam, playerInfo.playerTwoName, playerInfo.playerTwoTeam)
        displayController.displayPlayerFormModal('none')
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
        //initialize field functions
        playerOne.setPlayersTurn(true);
        DOMCache.DOMFields.forEach((field) => {
            field.addEventListener('click', placeCharOnField.bind(this, field));
            field.addEventListener('click', gameOverChecker.checkGameOver);
        })
    }
})();


