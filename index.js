// snake game

// declaring global variables

let direction;
let boardWidth = 25;
let boardHeigth = 15;
let cells;
let level = 1;

let snakeInterval;
let snakeIndex = [0, 1 ,2];

var gameRunning = false;
var recentlyChanged = false;

// audio elements
const gameOverSound = new Audio("./sounds/gameOver.mp3");
const backgroudMusic = new Audio("./sounds/music.mp3");
backgroudMusic.loop = true;
const appleSound = new Audio("./sounds/eat.mp3");

// initialize the board on load 
function initBoard() {
    $(".grid").css("grid-template-columns", `repeat(${boardWidth}, 1fr)`);
    $(".grid").css("grid-template-rows", `repeat(${boardHeigth}, 1fr)`);

    // spawn the cells for the game
    for (var i=0; i<boardWidth*boardHeigth; i++) {
        const cellToAdd = document.createElement("div");
        cellToAdd.setAttribute("class", "cell");
        $(".grid").append(cellToAdd);
    }

    cells = $(".cell");
    // add class snake for each index 
    snakeIndex.forEach(index => {
        $(cells[index]).addClass("snake")   
    });

    setApple();
}

function moveSnake() {

    // assign integer to add to array
    const indexToAdd = snakeIndex[snakeIndex.length -1 ] + parseInt(direction);
    const hasCollided = checkCollision(indexToAdd);
    
    if (hasCollided) { 
        gameOver() 
        return; // user has collided so game over 
    }

    // assign index to remove and remove class
    const indexToRemove = snakeIndex.splice(0,1);
    $(cells[indexToRemove]).removeClass("snake");
    
    // add new item to the array and apply class
    snakeIndex.push(indexToAdd)
    $(cells[indexToAdd]).addClass("snake");
    
    checkForApple(indexToAdd);
    
}

function checkCollision(index) {
    if (direction === 1 && (index % boardWidth) === 0 || // has reached the rigth wall of a horizontal row
        direction === -1 && (index % boardWidth) === boardWidth-1 || // has reached the left wall
        !cells[index] || $(cells[index]).hasClass("snake")) { // there is no cell with that index, or the cell is a snake (self collision)

        direction = 1; // reset direction
        return true;
    } else {
        return false;
    }
}

function gameOver() {
    clearInterval(snakeInterval); // stop loop
    gameRunning = false;

    gameOverSound.play(); // audio que for gameover
    backgroudMusic.pause(); // stop background music

    // update game text to notify that user has lost 
    $(".level_text").text("GAME OVER");

    setTimeout( ()=> {
        $(".level_text").text("Press movement key to play.")
        $(".snake").removeClass("snake"); // remove all current snakes 
        snakeIndex = [0, 1 ,2]; // reset the index to starting index

        snakeIndex.forEach(index => $(cells[index]).addClass("snake")); // add snakes to the new index

        level = 0; // reset level
    }, 1500);
}

function flashKey(id) {
    // add flash aimation for keys
    $(`#K${id}`).toggleClass("flash");
    setTimeout( () => {$(`#K${id}`).toggleClass("flash")}, 400)
}

function setApple(){

    // spawn apple in a random cell that is not a snake
    let appleIndex = Math.floor(Math.random()*cells.length);

    while ($(cells[appleIndex]).hasClass("snake")) {
        appleIndex = Math.floor(Math.random()*cells.length)
    };

    $(cells[appleIndex]).addClass("apple");
    
}

function checkForApple(index){

    // check if the cell is an apple
    if ($(cells[index]).hasClass("apple")) {

        appleSound.play(); // play audio que

        $(cells[index]).removeClass("apple"); // remove the apple

        let addSnakeCell = snakeIndex[snakeIndex.length -1 ] + parseInt(direction); 
        
        snakeIndex = [addSnakeCell, ...snakeIndex]; // add item to array
        
        level++; // add level
        setGameText(); // update text
        setApple(); // spawn new apple
    }    
}

function setGameText(){
    $(".level_text").text("Level: " + level);
}

function setDirection(key) {

    console.log(key);

    key = key.toString().slice(key.length-2 ,key.length)
    
    switch (key) {
        case "38":
            // move up
            if (direction !== boardWidth && direction !== "-" + boardWidth) {
                direction = "-" + boardWidth;
                flashKey(key);
            }
            break;
        case "40":
            // move down
            if (direction !== "-" + boardWidth && direction !== boardWidth) {
                direction = boardWidth;
                flashKey(key);
            }
            
            break;
        case "37":
            // move left
            if (direction !== 1 && direction !== -1) {
                direction = -1;
                flashKey(key);
            }
            
            break;
        case "39":
            // move rigth
            if (direction !== -1 && direction !== 1) {
                direction = 1;
                flashKey(key);
            }
            
            break;
        default:
            return;
    } 


    if (!gameRunning) {
        gameRunning = true;
        snakeInterval =  setInterval(moveSnake, 200);
        setGameText();

        // start background music
        backgroudMusic.currentTime = 0;
        backgroudMusic.play();
    }
}



initBoard();

// event listener for key presses and button presses

$(document).on("keydown", (e) => {
    setDirection(e.keyCode);
})

$(".control_button").on("click", (e) => {
    setDirection(e.target.id);
})




 
