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
    const board = document.createElement("div")
    board.classList.add("game-board")
    for (let i = 1; i <= 9; i++) {
        const big_cell = document.createElement("div")
        big_cell.classList.add(`game-${i}`)
        big_cell.classList.add("big-cell")
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

const player_1 = new Player("player1", "./media/cancel-svgrepo-com (1).svg", "X", 0, true)
const player_2 = new Player("player2", "./media/circle-svgrepo-com.svg", "O", 0, false)
let clickable = true

function AddClickToCells() {
    const big_cells = game_container.querySelectorAll(".big-cell")
    big_cells.forEach((element, bigIndex) => {
        if (clickable) {
            small_cells = element.querySelectorAll(".small-cell")
            small_cells.forEach((item, smallIndex) => {
                item.addEventListener("click", () => {
                    if (addMark(determineTurn(), item)) {
                        updateBoard(bigIndex, smallIndex, determineTurn().sign)
                        let condition = checkSmallBoard(Math.floor(bigIndex / 3), bigIndex % 3)
                        console.log(condition)
                        convertSmallToBig(condition, Math.floor(bigIndex / 3), bigIndex % 3)
                        // checkBigBoard()
                        player_1.turn = !player_1.turn
                        player_2.turn = !player_2.turn
                        swapHighlight()
                    }
                })
            })
            
        }
    })
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
    console.log(solveTicTacToe(gamelayout))
}

function animateWinningRow(array, game_loc) {
    let elements = []
    array.forEach((number) => {
        let cell_index = number[0] * 3 + number[1] + 1
        console.log(cell_index)
        let element = document.querySelector(`.game-${game_loc} .cell-${cell_index}`)
        element.id ="winning-cells"
    })
}

function convertSmallToBig(winner, bigRow, bigCol) {
    if (winner === null) return
    let dom_elements = winner.cells
    let imagery = winner.winner
    console.log(imagery)
    if (imagery === "X" || imagery === "O") {
        gamelayout[bigRow][bigCol] = imagery
        let game_location = bigRow * 3 + bigCol + 1
        animateWinningRow(dom_elements, game_location)
        const game_dom = document.querySelector(`.game-${game_location}`)
        game_dom.innerHTML = ""
        let icon = document.createElement("img")
        icon.classList.add("big-cell-img")
        icon.src = (player_1.sign === imagery) ? player_1.symbol : player_2.symbol
        game_dom.style.cssText = "display: flex; justify-content: center; align-items: center"
        game_dom.appendChild(icon)
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
