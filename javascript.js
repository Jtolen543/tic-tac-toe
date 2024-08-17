const game_container = document.querySelector(".game-body")
let winning_dom = []

let gamelayout = Array.from({length: 3}, () =>
    Array.from({length: 3}, () =>
        Array.from({length: 3}, ()=> 
            Array(3).fill("-")
        )
    )
);



function createGameBoard() {
    document.querySelector(".game-title").textContent = "Super Tic-Tac-Toe"
    const board = document.createElement("div")
    board.classList.add("game-board")
    for (let i = 1; i <= 9; i++) {
        const big_cell = document.createElement("div")
        big_cell.classList.add(`game-${i}`)
        big_cell.classList.add("big-cell")
        big_cell.classList.add('clickable')
        for (let j = 1; j <= 9; j++) {
            const cell = document.createElement("div")
            cell.classList.add(`cell-${j}`)
            cell.classList.add("small-cell")
            cell.id = "-"
            big_cell.appendChild(cell)

        }
        board.appendChild(big_cell)
    }
    reset_button = document.createElement("button")
    reset_button.classList.add("reset-game-button")
    reset_button.textContent = "Reset"
    reset_button.addEventListener("click", () => {
        game_container.innerHTML = ""
        createGameBoard()
        AddClickToCells()
        gamelayout = Array.from({length: 3}, () =>
            Array.from({length: 3}, () =>
                Array.from({length: 3}, ()=> 
                    Array(3).fill("-")
                )
            )
        );
    })
    game_container.appendChild(board)
    game_container.appendChild(reset_button)
}

function Player(name, symbol, sign, wins=0, turn) {
    this.name = name
    this.symbol = symbol
    this.sign = sign
    this.wins = wins
    this.turn = turn
}

const player_1 = new Player("Player 1", "./media/cancel-svgrepo-com (1).svg", "X", 0, true)
const player_2 = new Player("Player 2", "./media/circle-svgrepo-com.svg", "O", 0, false)

function AddClickToCells() {
    const big_cells = game_container.querySelectorAll(".big-cell");
    big_cells.forEach((element, bigIndex) => {
        const small_cells = element.querySelectorAll(".small-cell");
        small_cells.forEach((item, smallIndex) => {
            item.addEventListener("click", () => {
                console.log(item)
                if (element.classList.contains("clickable")) {
                    addMark(determineTurn(), item)
                    updateBoard(bigIndex, smallIndex, determineTurn().sign);
                    let condition = checkSmallBoard(Math.floor(bigIndex / 3), bigIndex % 3);
                    convertSmallToBig(condition, Math.floor(bigIndex / 3), bigIndex % 3);
                    checkBigBoard();
                    player_1.turn = !player_1.turn;
                    player_2.turn = !player_2.turn;
                    swapHighlight();
                    determineIfClickable(smallIndex); // Set clickable cells based on the position of the clicked cell
                }
            });
        });
    });
}

function determineIfClickable(position) {
    let currentBigCellIndex = position
    console.log(currentBigCellIndex)
    let ffa = false
    const bigCells = document.querySelectorAll(".big-cell");
    bigCells.forEach((cell, index) => {
        if (index === currentBigCellIndex) {
            if (!cell.classList.contains("solved")) {
                cell.classList.add("clickable")
                cell.id = "selected"
            }
            else ffa = true
        }
        else{
            cell.classList.remove("clickable")
            cell.id = ""
        }
    });
    if (ffa) {
        bigCells.forEach((element) =>{
            console.log("test")
            element.classList.add("clickable")
        })
    }
}

function addMark(player, cell) {
    const image = cell.querySelector("img")
    if (!image) {
        cell.id = player.sign
        const icon = document.createElement("img")
        icon.classList.add("small-cell-img")
        icon.src = player.symbol
        cell.appendChild(icon)
        return true
    }
    else {
        return false
    }
}

function updateBoard(index1, index2, value) {
    let bigRow = Math.floor(index1 / 3)
    let bigCol = index1 % 3
    let smallRow = Math.floor(index2 / 3)
    let smallCol = index2 % 3
    gamelayout[bigRow][bigCol][smallRow][smallCol] = value
    return bigRow, bigCol
}

function checkSmallBoard(index1, index2) {
    if (gamelayout[index1][index2]!== String) {
        let grid = gamelayout[index1][index2]
        return solveTicTacToe(grid)
    }
    return false
}

function checkBigBoard() {
    let user = solveTicTacToe(gamelayout)
    if (user && (user.winner === "X" || user.winner === "O")) {
        setTimeout(function() {animateWinningRow(user.cells)}, 2500)
        let game_title = document.querySelector(".game-title")
        if (user.winner === "X") {
            game_title.textContent = `${player_1.name} Wins!`
            player_1.turn = false
            player_2.turn = true
            player_1.wins += 1
        }
        else {
            game_title.textContent = `${player_2.name} Wins!`
            player_2.turn = false
            player_1.turn = true
            player_2.wins += 1
        }
        document.getElementById("p1-score").textContent = player_1.wins
        document.getElementById("p2-score").textContent = player_2.wins
        endAllListeners()
    }
}

function endAllListeners() {
    setTimeout(function() {
        const board = document.querySelector(".game-board")
        const new_board = board.cloneNode(true)
        const body = document.querySelector(".game-body")
        body.replaceChild(new_board, board)
    }, 5000)  
}

function animateWinningRow(array, game_loc = 0) {
    if (game_loc === 0) {
        let i = 0
        array.forEach((number) => {
            let cell_index = number[0] * 3 + number[1] + 1
            let element = document.querySelector(`.game-${cell_index} img`)
            setTimeout(function() {
                element.id = "winning-game"
            }, 100 + i++ * 75)
        })
        return
    }
    let elements = []
    array.forEach((number, index) => {
        let cell_index = number[0] * 3 + number[1] + 1
        let element = document.querySelector(`.game-${game_loc} .cell-${cell_index} img`)
        setTimeout(function() {
            element.id = "winning-cells"
        }, 100 + index * 75)
        elements.push(element)
    })
    return elements[2]

}

function convertSmallToBig(winner, bigRow, bigCol) {
    if (winner === null) return
    let dom_elements = winner.cells
    let imagery = winner.winner
    if (imagery === "X" || imagery === "O") {
        gamelayout[bigRow][bigCol] = imagery
        let game_location = bigRow * 3 + bigCol + 1
        let element = animateWinningRow(dom_elements, game_location)
        const game_dom = document.querySelector(`.game-${game_location}`)
        element.addEventListener("animationend", () => {
            let small_game = document.querySelectorAll(`.game-${game_location} .small-cell`)
            small_game.forEach((element) => {element.id="shrink-cell"})            
            setTimeout(function() {
                game_dom.id = ""
                game_dom.innerHTML = ""
                let icon = document.createElement("img")
                icon.classList.add("big-cell-img")
                game_dom.classList.add("solved")
                icon.src = (player_1.sign === imagery) ? player_1.symbol : player_2.symbol
                game_dom.style.cssText = "display: flex; justify-content: center; align-items: center"
                game_dom.appendChild(icon)
            }, 700)
        }, false)
    }
    else return
}


function solveTicTacToe(board) {
    for (let i = 0; i < 3; i++) {
        if (board[0][i] === board[1][i] && board[1][i] === board[2][i] && board[0][i] !== "-") {
            return {winner: board[0][i], cells: [[0, i], [1, i], [2, i]]}
        }
        else if (board[i][0] === board[i][1] && board[i][1] === board[i][2] && board[i][0] !== "-") {
            return {winner: board[i][0], cells: [[i, 0], [i, 1], [i, 2]]}
        }
    }
    if ((board[0][0] === board[1][1] && board[1][1] === board[2][2]) && board[1][1] !== "-")
        return {winner: board[1][1], cells: [[0, 0], [1, 1], [2, 2]]}
    else if ((board[0][2] === board[1][1] && board[1][1] === board[2][0]) && board[1][1] !== "-")
        return {winner: board[1][1], cells: [[0, 2], [1, 1], [2, 0]]}
    else return null
    
}

function determineTurn() {
    return (player_1.turn) ? player_1 : player_2
}

function swapHighlight() {
    const p1 = document.querySelector(".player-one-header")
    const p2 = document.querySelector(".player-two-header")
    if (player_1.turn) {
        p1.id = "player-move"
        p2.id = "player-no-move"
    }
    else {
        p2.id = "player-move"
        p1.id = "player-no-move"
    }
}

createGameBoard()
AddClickToCells()
