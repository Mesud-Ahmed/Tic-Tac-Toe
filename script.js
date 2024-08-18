document.addEventListener('DOMContentLoaded', function () {
    const cells = document.querySelectorAll('.cell');
    const restartButton = document.getElementById('restart');
    const result = document.querySelector(".winner");

    const game = GameController();

    restartButton.addEventListener('click', () => {
        cells.forEach(cell => {
            cell.textContent = '';
        });
        game.resetGame();
    });

    cells.forEach((cell, index) => {
        const row = Math.floor(index / 3);
        const col = index % 3;
        cell.addEventListener('click', () => game.playerMove(row, col, cell));
    });

    function Gameboard() {
        const board = [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
        ];

        const getBoard = () => board;

        const placeMarker = (row, col, marker) => {
            if (board[row][col] === '') {
                board[row][col] = marker;
                return true;
            }
            return false;
        };

        const resetBoard = () => {
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    board[i][j] = '';
                }
            }
        };

        return { getBoard, placeMarker, resetBoard };
    }

    function GameController() {
        const gameboard = Gameboard();
        const players = [
            { name: 'Player', marker: 'X' },
            { name: 'Computer', marker: 'O' }
        ];
        let currentPlayer = players[0]; // Always start with the player
        let gameOver = false;

        const switchTurn = () => {
            currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
        };

        const checkWinner = () => {
            const board = gameboard.getBoard();
            const winningConditions = [
                [[0, 0], [0, 1], [0, 2]], // Rows
                [[1, 0], [1, 1], [1, 2]],
                [[2, 0], [2, 1], [2, 2]],
                [[0, 0], [1, 0], [2, 0]], // Columns
                [[0, 1], [1, 1], [2, 1]],
                [[0, 2], [1, 2], [2, 2]],
                [[0, 0], [1, 1], [2, 2]], // Diagonals
                [[0, 2], [1, 1], [2, 0]]
            ];

            for (let condition of winningConditions) {
                const [a, b, c] = condition;
                if (board[a[0]][a[1]] && board[a[0]][a[1]] === board[b[0]][b[1]] && board[a[0]][a[1]] === board[c[0]][c[1]]) {
                    return board[a[0]][a[1]];
                }
            }
            return null;
        };

        const checkTie = () => {
            const board = gameboard.getBoard();
            for (let row of board) {
                for (let cell of row) {
                    if (cell === '') {
                        return false;
                    }
                }
            }
            return true;
        };

        const playerMove = (row, col, cell) => {
            if (gameOver || currentPlayer !== players[0]) return; // Prevent further moves when game is over or it's not player's turn

            const validMove = gameboard.placeMarker(row, col, currentPlayer.marker);
            if (validMove) {
                cell.textContent = currentPlayer.marker;
                const winner = checkWinner();
                if (winner) {
                    result.textContent = `${currentPlayer.name} wins!`;
                    gameOver = true;
                    return;
                }
                if (checkTie()) {
                    result.textContent = "It's a tie!";
                    gameOver = true;
                    return;
                }
                switchTurn(); // Switch to computer turn
                setTimeout(computerMove, 500); // Delay for better UX
            } else {
                alert("Invalid move, try again.");
            }
        };

        const computerMove = () => {
            if (gameOver) return;
            const board = gameboard.getBoard();
            let found = false;
            // Find all empty cells
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (board[i][j] === '') {
                        const cell = document.querySelector(`.cell:nth-child(${i * 3 + j + 1})`);
                        found = true
                        gameboard.placeMarker(i, j, currentPlayer.marker);
                        cell.textContent = currentPlayer.marker;
                        break;
                    }
                
                }
                if(found) break;
            }
            const winner = checkWinner();
            if (winner) {
                result.textContent = `${currentPlayer.name} wins!`;
                gameOver = true;
                return;
            }
            if (checkTie()) {
                result.textContent = "It's a tie!";
                gameOver = true;
                return;
            }
            switchTurn(); // Switch back to player's turn
        };

        const resetGame = () => {
            gameboard.resetBoard();
            currentPlayer = players[0]; // Reset to player
            gameOver = false;
            result.textContent = "";
        };

        return { playerMove, resetGame };
    }
});
