const displayScore = document.querySelector('.scoreDashboard');
const displayPopUp = document.querySelector('.startScreen');
const displayGameArea = document.querySelector('.gameArea');

console.log(displayGameArea);

displayPopUp.addEventListener('click', startGame); //after user clicks on the pop-up, game will start
let player = {  
    speed : 5,
    score : 0
};

//keys to move the car
let keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
}

//functionality of the keys
document.addEventListener('keydown', keyDown); //keyDown and keyUp are callback functions
document.addEventListener('keyup', keyUp);

function keyDown(e) {
    e.preventDefault(); // to prevent the default functionality of javascript
    keys[e.key] = true; // here, current key press will be true
    //  console.log(e.key); // key press will be printed
    //console.log(keys);
}

function keyUp(e) {
    e.preventDefault(); // to prevent the default functionality of javascript
    keys[e.key] = false; // here, the key which will be released will be deactivated.
    // console.log(e.key); // key release will be printed
    //console.log(keys);
}

//car will be moving 
function playGame() {
    // console.log("Start the ga  me!!");

    let moveCar = document.querySelector('.moveableCar');

    //getBoundingClientRect() is for getting exact position of the car
    let roadArea = displayGameArea.getBoundingClientRect();
    //console.log(roadArea);

    //if player is active only then show lines on the road
    if (player.startGame) {

        moveLines();
        moveOtherCars(moveCar);

        if (keys.ArrowUp && player.y > (roadArea.top + 70)) {
            player.y -= player.speed; //move up, then top value should decrease
        }

        if (keys.ArrowDown && player.y < (roadArea.height - 70)) {
            player.y += player.speed; //move down, top value should increase
        }

        if (keys.ArrowLeft && player.x > 0) {
            player.x -= player.speed; //move left, value should decrease
        }

        if (keys.ArrowRight && player.x < (roadArea.width - 68)) {
            player.x += player.speed; //move right, left value should increase
        }

        moveCar.style.top = player.y + "px"; //concatenate px
        moveCar.style.left = player.x + "px"; //concatenate px

        window.requestAnimationFrame(playGame);

        player.score++;
        displayScore.innerText = "Score : "+player.score;
    }
}

function moveLines() {

    //querySelectorAll 
    let lines = document.querySelectorAll('.createLines');

    lines.forEach(function (repeatLines) {

        if (repeatLines.y >= 700) {
            repeatLines.y -= 750;
        }

        repeatLines.y += player.speed;
        repeatLines.style.top = repeatLines.y + "px";
    })
}

function endGame(){
    player.startGame = false;
    displayPopUp.classList.remove('hide');
    displayPopUp.innerHTML ="Game Over <br> Your Final Score is " +((player.score)+1) +
    "<br> Press Here To Start Again";
}

function moveOtherCars(playersCar) {

    //querySelectorAll 
    let moveEnemyCars = document.querySelectorAll('.otherCars');
    
    moveEnemyCars.forEach(function (enemyCars) {

        if(collision(playersCar, enemyCars)){            
            console.log("hit");
            endGame();            
        }

        if (enemyCars.y >= 750) {
            enemyCars.y = -210;
            enemyCars.style.left = Math.floor(Math.random() * 330) + "px";
        }

        enemyCars.y += player.speed;
        enemyCars.style.top = enemyCars.y + "px";
    })
}

function collision(playersPosition, enemiesPosition){
    playerRect = playersPosition.getBoundingClientRect();
    enemyRect = enemiesPosition.getBoundingClientRect();

    return !( (playerRect.top > enemyRect.bottom) || (playerRect.left > enemyRect.right)
                || (playerRect.bottom < enemyRect.top) || (playerRect.right<enemyRect.left) )
}

//game are will be displayed and pop-up will be disabled
function startGame() {

   // displayGameArea.classList.remove('hide'); //game area will be displayed
    displayPopUp.classList.add('hide'); //pop up will be disabled
    displayGameArea.innerHTML = "";

    player.startGame = true; //car will be shown
    player.score = 0;
    //to update the animation before the next repaint`
    window.requestAnimationFrame(playGame); //with this function we can run the loop multiple times in the function

    //creating lines
    for (i = 0; i < 5; i++) {
        let roadLine = document.createElement('div');
        roadLine.setAttribute('class', 'createLines');
        roadLine.y = i * 150; //this is important, if we merge it below code will not work  
        roadLine.style.top = roadLine.y + "px"; //creates dash lines
        displayGameArea.appendChild(roadLine);
    }

    //create a div element inside gamearea through javascript
    let car = document.createElement('div');
    car.setAttribute('class', 'moveableCar'); //here we're creating a class attribute with moveableCar as its name
    //car.innerText = "This is car object"; //this is just for reference
    displayGameArea.appendChild(car); //here we're actually adding div car to gameArea div

    player.x = car.offsetLeft; //moving left and right
    player.y = car.offsetTop; //moving top and bottom

    //console.log(car.offsetLeft);
    //console.log(car.offsetTop);

    function randomColor(){
        function getRandomNumber(){
            //256 : color code starts from 0 to 255 so 256 is multiplied
            // 16:to convert into hexadecimal format
            let hexDecNo = Math.floor(Math.random() * 256).toString(16);            
            return ("0" + String(hexDecNo)).substr(-2);
        }
        return "#" + getRandomNumber() + getRandomNumber() + getRandomNumber();
    }

    //create other cars
    for (x = 0; x < 4; x++) {
        let createOtherCars = document.createElement('div');
        createOtherCars.setAttribute('class', 'otherCars');
        createOtherCars.y = ((x + 1) * 350) * -1;
        createOtherCars.style.top = createOtherCars.y + "px";
        createOtherCars.style.backgroundColor = randomColor();
        createOtherCars.style.left = Math.floor(Math.random() * 350) + "px";
        displayGameArea.appendChild(createOtherCars);
    }

   
}