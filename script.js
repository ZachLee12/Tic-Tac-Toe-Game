const gameBoard = (function () {
  const _board = ['', '', '', '', '', '', '', '', '']

  const getGameBoard = () => _board

  const setField = (field, char) => {
    _board[field] = char
  }

  const resetBoard = () => {
    _board.forEach((field, index) => {
      setField(index, '')
    })
  }

  return {
    getGameBoard,
    setField,
    resetBoard
  }
}())

// player factory
const createPlayer = function (name, team) {
  const playerName = name
  const playerTeam = team
  let win = false
  let playersTurn = false

  const setWin = boolean => (win = boolean)
  const setPlayersTurn = boolean => (playersTurn = boolean)
  const getWin = () => win
  const getPlayersTurn = () => playersTurn
  const getPlayerName = () => playerName
  const getPlayerTeam = () => playerTeam

  return {
    setWin,
    setPlayersTurn,
    getWin,
    getPlayerName,
    getPlayersTurn,
    getPlayerTeam
  }
}

// all DOM elements are cached here
const DOMCache = (function () {
  const cachePlayersInfo = () => {
    const playerOneName = document.getElementById('player1-name').value
    const playerTwoName = document.getElementById('player2-name').value
    const playerOneTeam = document.getElementById('player1-team').value
    const playerTwoTeam = document.getElementById('player2-team').value

    return {
      playerOneName,
      playerOneTeam,
      playerTwoName,
      playerTwoTeam
    }
  }
  // player form
  const form = document.querySelector('.player-form')

  // DOM fields
  const DOMFields = (() => {
    const fields = []
    document.querySelectorAll('.field').forEach((div) => {
      fields.push(div)
    })
    return fields
  })()

  // player's turn
  const playersTurnDiv = document.querySelector('.players-turn')

  // game buttons
  const playButton = document.querySelector('#play-btn')
  const playAgainButton = document.querySelector('#play-again')
  const changePlayers = document.querySelector('#change-players')

  // modals
  const playerFormModal = document.getElementById('player-form-modal')
  const winnerModal = document.getElementById('winner-modal')
  const winnerNameContainer = document.querySelector('.winner')
  return {
    playersTurnDiv,
    playButton,
    cachePlayersInfo,
    DOMFields,
    form,
    playerFormModal,
    winnerModal,
    winnerNameContainer,
    playAgainButton,
    changePlayers
  }
})()

// controls all displays on the DOM
const displayController = (function () {
  const renderBoard = () => {
    DOMCache.DOMFields.forEach((field) => {
      field.innerHTML = gameBoard.getGameBoard()[field.id]
    })
  }

  const _updatePlayersTurn = (name) => {
    DOMCache.playersTurnDiv.innerHTML = `${name}'s turn!`
  }

  const updateEndGameText = () => {
    DOMCache.playersTurnDiv.innerHTML = 'Good Game!'
  }

  const updateBoard = (field, char, playerName) => {
    gameBoard.setField(field.id, char)
    _updatePlayersTurn(playerName)
    renderBoard()
  }

  const resetPlayersTurn = (player) => {
    DOMCache.playersTurnDiv.innerHTML = `${player.getPlayerName()}'s turn!`
  }

  const displayPlayerFormModal = (displayModal) => {
    DOMCache.playerFormModal.style.display = `${displayModal}`
  }

  const displayWinnerModal = (winner, displayModal) => {
    DOMCache.winnerNameContainer.textContent = winner
    DOMCache.winnerModal.style.display = `${displayModal}`
  }

  return {
    updateBoard,
    displayPlayerFormModal,
    displayWinnerModal,
    resetPlayersTurn,
    renderBoard,
    updateEndGameText
  }
})()

// checks if the game is over, returns an Object with result properties
const gameOverChecker = (function () {
  let someoneWon = false
  let nobodyWon = false
  let winner = null
  function _checkWin (playerOne, playerTwo) {
    // horizontal win
    if (gameBoard.getGameBoard()[0] !== '' && gameBoard.getGameBoard()[0] === gameBoard.getGameBoard()[1] && gameBoard.getGameBoard()[1] === gameBoard.getGameBoard()[2]) {
      someoneWon = true
    } else if (gameBoard.getGameBoard()[3] !== '' && gameBoard.getGameBoard()[3] === gameBoard.getGameBoard()[4] && gameBoard.getGameBoard()[4] === gameBoard.getGameBoard()[5]) {
      someoneWon = true
    } else if (gameBoard.getGameBoard()[6] !== '' && gameBoard.getGameBoard()[6] === gameBoard.getGameBoard()[7] && gameBoard.getGameBoard()[7] === gameBoard.getGameBoard()[8]) {
      someoneWon = true
    }

    // vertical win
    if (gameBoard.getGameBoard()[0] !== '' && gameBoard.getGameBoard()[0] === gameBoard.getGameBoard()[3] && gameBoard.getGameBoard()[3] === gameBoard.getGameBoard()[6]) {
      someoneWon = true
    } else if (gameBoard.getGameBoard()[1] !== '' && gameBoard.getGameBoard()[1] === gameBoard.getGameBoard()[4] && gameBoard.getGameBoard()[4] === gameBoard.getGameBoard()[7]) {
      someoneWon = true
    } else if (gameBoard.getGameBoard()[2] !== '' && gameBoard.getGameBoard()[2] === gameBoard.getGameBoard()[5] && gameBoard.getGameBoard()[5] === gameBoard.getGameBoard()[8]) {
      someoneWon = true
    }

    // diagonal win
    if (gameBoard.getGameBoard()[0] !== '' && gameBoard.getGameBoard()[0] === gameBoard.getGameBoard()[4] && gameBoard.getGameBoard()[4] === gameBoard.getGameBoard()[8]) {
      someoneWon = true
    } else if (gameBoard.getGameBoard()[2] !== '' && gameBoard.getGameBoard()[2] === gameBoard.getGameBoard()[4] && gameBoard.getGameBoard()[4] === gameBoard.getGameBoard()[6]) {
      someoneWon = true
    }

    if (someoneWon) {
      if (!playerOne.getPlayersTurn()) {
        winner = playerOne.getPlayerName()
      } else {
        winner = playerTwo.getPlayerName()
      }
    }
  }

  function _checkNobodyWins () {
    if (!someoneWon && gameBoard.getGameBoard().filter((char) => char === '').length === 0) {
      nobodyWon = true
    }
  }

  function checkGameOver (playerOne, playerTwo) {
    _checkWin(playerOne, playerTwo)
    _checkNobodyWins()
    return {
      someoneWon,
      winner,
      nobodyWon
    }
  }

  function reset () {
    someoneWon = false
    nobodyWon = false
    winner = null
    return {
      someoneWon,
      winner,
      nobodyWon
    }
  }
  return {
    checkGameOver,
    reset
  }
})()

// main IIFE module
// eslint-disable-next-line no-unused-vars
const gameController = (function () {
  let playerOne = null
  let playerTwo = null

  // initialize game buttons
  DOMCache.playButton.addEventListener('click', initializePlayerForm)
  DOMCache.playAgainButton.addEventListener('click', resetGame)
  DOMCache.changePlayers.addEventListener('click', changePlayers)

  function resetGame () {
    gameBoard.resetBoard()
    displayController.renderBoard()
    displayController.resetPlayersTurn(playerOne)
    displayController.displayWinnerModal('', 'none')
  }

  function changePlayers () {
    resetGame()
    displayController.displayPlayerFormModal('block')
  }

  function initializePlayerForm () {
    // game is only initialized if form is valid
    if (!DOMCache.form.checkValidity()) return
    const playerInfo = DOMCache.cachePlayersInfo()
    initializeGame(playerInfo.playerOneName, playerInfo.playerOneTeam, playerInfo.playerTwoName, playerInfo.playerTwoTeam)
    displayController.displayPlayerFormModal('none')
  }

  function finalizeGame (playerOne, playerTwo) {
    let resultObj = gameOverChecker.checkGameOver(playerOne, playerTwo)
    if (resultObj.nobodyWon) {
      displayController.displayWinnerModal("It's a tie!", 'block')
      resultObj = gameOverChecker.reset()
      displayController.updateEndGameText()
    } else if (resultObj.someoneWon) {
      displayController.displayWinnerModal(`${resultObj.winner} wins!`, 'block')
      resultObj = gameOverChecker.reset()
      displayController.updateEndGameText()
    }
  }

  function initializeGame (playerOneName, playerOneTeam, playerTwoName, playerTwoTeam) {
    // players
    playerOne = createPlayer(playerOneName, playerOneTeam)
    playerTwo = createPlayer(playerTwoName, playerTwoTeam)

    // initialize field functions
    playerOne.setPlayersTurn(true)

    // starting text
    DOMCache.playersTurnDiv.innerHTML = `${playerOne.getPlayerName()}'s turn!`

    function placeCharOnField (field) {
      if (field.innerHTML !== '') return
      if (playerOne.getPlayersTurn()) {
        displayController.updateBoard(field, playerOne.getPlayerTeam(), playerTwo.getPlayerName())
        playerOne.setPlayersTurn(false)
        playerTwo.setPlayersTurn(true)
      } else {
        displayController.updateBoard(field, playerTwo.getPlayerTeam(), playerOne.getPlayerName())
        playerOne.setPlayersTurn(true)
        playerTwo.setPlayersTurn(false)
      }
    }

    DOMCache.DOMFields.forEach((field) => {
      field.addEventListener('click', placeCharOnField.bind(this, field, playerOne, playerTwo))
      field.addEventListener('click', finalizeGame.bind(this, playerOne, playerTwo))
    })
  }
})()
