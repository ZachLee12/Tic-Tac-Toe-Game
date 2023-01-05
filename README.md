# Tic-Tac-Toe Game
A game of Tic-Tac-Toe! The first player who aligns 3 symbols of their assigned team, either vertical, horizontal or diagonally, wins.

**Live Demo: https://zachlee12.github.io/Tic-Tac-Toe-Game/**

## Module Pattern
This project is built based on the Module Pattern concept. The Module Pattern allows encapsulation and privacy of modules, in which we are to include both private and public methods and variables inside a single object. This resolves the global namespace pollution in the JavaScript ```window``` object. As such, the likelihood of function or variable names conflicting with one another is reduced.
  
## Example - ```DOMCache``` Module
I have structured my code as so, that only the ```DOMCache``` module is responsible to access the ```DOM elements``` and caches them internally. Any attempts to access the ```DOM``` should not be made anywhere else **outside** this module. This improves the code quality and cleans up the code (and global namespace).


```javascript
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
    //player form
    const form = document.querySelector('.player-form')

    //game buttons
    const playButton = document.querySelector('#play-btn');
    const playAgainButton = document.querySelector('#play-again');
    const changePlayers = document.querySelector('#change-players');

    ...//some codes are removed for an optimal example
    
    return {
        cachePlayersInfo,
        form,
        playButton,
        playAgainButton,
        changePlayers,
        ...
    }
})();
```
