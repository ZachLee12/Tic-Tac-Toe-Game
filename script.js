//module with "gameboard" namespace
const gameBoard = (function () {
    const _board = ["", "", "", "", "", "", "", "", ""];

    const getGameBoard = () => _board;

    const setField = (field, char) => {
        _board[field] = char;
    }

    return { getGameBoard, setField }
}());

//factory
const createPlayer = (name, team) => {
    return {
        name,
        team,
        win: false,
        playersTurn: false,
        toggleTurn() {
            this.playersTurn = !this.playersTurn;
        }
    }
}

const displayController = (function (board) {
    let _player1 = null;
    let _player2 = null;
    let gameOver = false;

    const _changePlayerSign = (parent, child, char) => {
        child.innerHTML = char;
        board.setField(parent.id, char)
    }

    const _checkFieldEmpty = (field) => {
        return field.innerHTML === "";
    }

    //returns a "result" object
    const _checkGameOver = (board, playerOne, playerTwo) => {
        let nobodyWins = false;
        let winner = null;
        //horizontal win
        if (board[0] === board[1] && board[1] === board[2] && board[2] !== "") {
            gameOver = true;
        } else if (board[3] === board[4] && board[4] === board[5] && board[5] !== "") {
            gameOver = true;
        } else if (board[6] === board[7] && board[7] === board[8] && board[8] !== "") {
            gameOver = true;
        } else if (board[0] === board[3] && board[3] === board[6] && board[6] !== "") {
            gameOver = true;
        } else if (board[1] === board[4] && board[4] === board[7] && board[7] !== "") {
            gameOver = true;
        } else if (board[2] === board[5] && board[5] === board[8] && board[8] !== "") {
            gameOver = true;
        } else if (board[0] === board[4] && board[4] === board[8] && board[8] !== "") {
            gameOver = true;
        } else if (board[2] === board[4] && board[4] === board[6] && board[6] !== "") {
            gameOver = true;
        }

        if (board.filter(field => field === "").length === 0) {
            gameOver = true;
            nobodyWins = true;
        }

        if (gameOver && !nobodyWins) {
            if (!playerOne.playersTurn) {
                winner = playerOne.name
            } else {
                winner = playerTwo.name
            }
        }

        return {
            gameOver,
            nobodyWins,
            winner
        };
    }

    const displayBoard = () => {
        for (let i = 0; i < 9; i++) {
            let field = document.getElementById(`${i}`)
            let charDiv = document.createElement('div')
            charDiv.innerHTML = board.getGameBoard()[i]
            field.append(charDiv)
        }
    }

    //IIFE
    const _initFieldFunctions = (() => {
        document.querySelectorAll('.field').forEach((field) => {
            field.addEventListener('click', (e) => {
                let parent = e.target;
                let child = e.target.children[0];
                let gameBoard = board.getGameBoard();
                let gameOverResult = _checkGameOver(gameBoard, _player1, _player2)

                if (_checkFieldEmpty(child)) {
                    if (_player1.playersTurn) {
                        _changePlayerSign(parent, child, "X")
                    } else if (_player2.playersTurn) {
                        _changePlayerSign(parent, child, "O")
                    }
                }
                if (gameOverResult.gameOver) {
                    console.log(gameOverResult)
                }
                _player1.toggleTurn();
                _player2.toggleTurn();
            })
        })


    })();

    const _initPlayers = () => {// init two players
        //player one
        let playerOneName = document.getElementById('player1-name').value;
        let playerOneTeam = document.getElementById('player1-team').value;
        //player two
        let playerTwoName = document.getElementById('player2-name').value;
        let playerTwoTeam = document.getElementById('player2-team').value;
        _player1 = createPlayer(playerOneName, playerOneTeam);
        _player2 = createPlayer(playerTwoName, playerTwoTeam);

        _player1.toggleTurn(); //player1 starts first
        console.log(_player1)
        console.log(_player2)
    };

    const _initPlayButton = (() => {
        const playBtn = document.querySelector('#play-btn')
        playBtn.addEventListener('click', (e) => {
            if (e.target.parentElement.checkValidity()) {
                _initPlayers();
                modal.style.display = "none"; //close the modal
            }
        })
    })();

    return { displayBoard }
}(gameBoard));




displayController.displayBoard();



// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function () {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}

