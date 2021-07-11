// Game variables and constants
let directions = {x : 0, y : 0};
const foodSound = new Audio('../Music/food.mp3');
const gameOverSound = new Audio('../Music/gameover.mp3');
const moveSound = new Audio('../Music/move.mp3');
const musicSound = new Audio('../Music/music.mp3');
const board = document.getElementById('board');
const SC = document.getElementById('Score');
const HS = document.getElementById('Highscore');
let lastPaintTime = 0;
let speed = 10;

let snakeArr = [
    {x: 15, y:15}
];

let food = { x: Math.round((20) * Math.random()), y: Math.round((20) * Math.random())};
let score = 0;
if(!localStorage.getItem("Highscore"))
    localStorage.setItem("Highscore", score);

let Highscore = localStorage.getItem("Highscore");
updateScore();

// Game functions
function main(ctime){       // Game loop
    window.requestAnimationFrame(main);
    if((ctime - lastPaintTime)/1000 < 1 / speed){    // For Frames per second
        // if ((ctime - lastPaintTime) < 5000)
        //     speed += 5;
        return;
    }
    lastPaintTime = ctime;

    gameEngine();
}

function gameEngine(){
    // Part 1: Updating the snake array and food
    // If snake Collides then what to do:
    if(isCollide(snakeArr)){
        gameOverSound.play();
        musicSound.pause();
        // Setting the defaults
        directions = {x: 0, y: 0};
        snakeArr = [{x:13, y:15}];
        alert(`Game over\nScore: ${score}\nPress any key to play again!`);
        score = 0;
        updateScore();
    }

    // If snake eats the food then to display the new food and increment the score
    if(snakeArr[0].x === food.x && snakeArr[0].y === food.y){
        foodSound.play()
        score++;
        updateScore();
        snakeArr.unshift({x : snakeArr[0].x + directions.x, y: snakeArr[0].y + directions.y});
        // TODO: Also make sure that the food doesn't get spawned on the body of the snake
        food.x = Math.round(1 + (18) * Math.random()); // Generate a number between 0 to 19
        food.y = Math.round(1 + (18) * Math.random()); // Generate a number between 0 to 19
    }
    
    // Move the snake
    for(let i = snakeArr.length - 2; i >=0;i--){
        snakeArr[i+1] = {...snakeArr[i]};
    }
    if (snakeArr[0].x )
    snakeArr[0].x += directions.x;
    snakeArr[0].y += directions.y;

    // Part 2: Rendering / Displaying the snake array and food
    RenderSnake();
    RenderFood();
}

function updateScore(){
    SC.innerHTML = `Score: ${score}`;
    if(score === 0)
        speed = 10
    else if(score % 10 == 0)
        speed += 10;

    if(score > Highscore){
        Highscore = score;
        localStorage.setItem("Highscore", score)
    }
    HS.innerHTML = `Highscore: ${Highscore}`;

}
function RenderSnake(){
    board.innerHTML = "";
    // Render the snake body parts
    snakeArr.forEach((e, index)=>{
        let temp = document.createElement('div');
        temp.style.gridRowStart = e.y;
        temp.style.gridColumnStart = e.x;
        if(index === 0)
            temp.classList.add('head');
        else
            temp.classList.add('tail');
        board.appendChild(temp);
    });
}

function RenderFood(){
    // Rendering the food element on the screen.
    let f = document.createElement('div');
    f.style.gridRowStart = food.y;
    f.style.gridColumnStart = food.x;
    f.classList.add('food');
    board.appendChild(f);
}

window.addEventListener('keydown', (e)=>{
    moveSound.play();
    switch(e.key){      // This will be used to change the directions
        case "ArrowUp":
            directions.x = 0;
            directions.y = -1;
            break;
        case "ArrowDown":
            directions.x = 0;
            directions.y = 1;
            break;
        case "ArrowLeft":
            directions.x = -1;
            directions.y = 0;
            break;
        case "ArrowRight":
            directions.x = 1;
            directions.y = 0;
            break;
        default:
            break;
    }
});

function isCollide(snakeArr){
    // If you bumb into yourself or collide into a wall
    for(let i = 1; i<snakeArr.length;i++){
        if(snakeArr[i].x === snakeArr[0].x && snakeArr[i].y === snakeArr[0].y)
            return true;
    }
    if (snakeArr[0].x >= 21 || snakeArr[0].x <= 0 || snakeArr[0].y >= 20 || snakeArr[0].y <= 0)
        return true;
    return false;
}

// Main Loop / Game Loop
window.requestAnimationFrame(main);