/* jshint esversion: 8 */

window.addEventListener("load", main);
window.addEventListener("resize", resetCanvasSize);

// Frame rate settings
let frameRate = 60;
let sleepTime = 1/frameRate * 1000;

// Window size
let screenWidth = 500;
let screenHeight = 500;

let gameRunning = true;

async function main() {
    // Init canvas size
    resetCanvasSize();

    // Init player
    let p = new Player();
    //p.vx = Math.sqrt(2);
    //p.vy = Math.sqrt(2);

    while (gameRunning) {
        clearScreen();
        p.update();
        p.draw();

        await sleep(sleepTime);
    }
}

/////////////////////////////////////////////////////////////////////////
// The player's character                                              //
// Properties:                                                         //
//  - x - the x position of the player                                 //
//  - y - the y position of the player                                 //
//  - canId - the canvas the player should be drawn on                 //
//  - width - the width of the player sprite                           //
//  - height - the height of the player sprite                         //
//  - speed - the speed of the player                                  //
// Methods:                                                            //
//  - draw - draw the player on canId                                  //
//  - update - update the players velocity                             //
//  - corners - return the corners of the player for collision testing //
/////////////////////////////////////////////////////////////////////////
class Player {
    constructor(x=0, y=0, canId="maze", width=50, height=50, speed=5) {
        // Position
        this.x = x;
        this.y = y;
        
        // Velocity
        this.vx = 0;
        this.vy = 0;
        this.speed = speed;

        // Sprite dimensions
        this.width = width;
        this.height = height;

        // Max position
        let ctx = document.getElementById(canId).getContext("2d");
        this.maxX = screenWidth;
        this.maxY = ctx.canvas.height - 10;
        
        // Canvas id
        this.canId = canId;

        // Create a new Input to keep track of keyboard input
        this.input = new Input();
    }

    // Draw the player to the screen
    draw() {
        let ctx = document.getElementById("maze").getContext("2d");
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {        
        // Get x direction, -1 if left, 1 if right, 0 if neither or both
        this.vx = this.input.keyPressed("right") - this.input.keyPressed("left");
        // Get y direction, -1 if up, 1 if down, 0 if neither or both
        this.vy = this.input.keyPressed("down") - this.input.keyPressed("up");

        // If both values are non-zero, normalize them
        if (this.vx && this.vy) {
            this.vx *= Math.SQRT1_2;
            this.vy *= Math.SQRT1_2;
        }

        this.x = mod(this.x + this.vx * this.speed, this.maxX);
        this.y = mod(this.y + this.vy * this.speed, this.maxY);
    }

    corners() {
        return [
            // Top left
            [this.x, this.y],
            // Top right
            [this.x + this.width, this.y],
            // Bottom right
            [this.x + this.width, this.y + this.height],
            // Bottom left
            [this.x, this.y + this.height]
        ];
    }
}

///////////////////////////////////////////////////////////////////////
// Keep track of which directions are pressed                        //
// Properties:                                                       //
//  - state - a binary representation of what keys have been pressed //
//            1000 is up, 0100 is down, 0010 is left, 0001 is right  //
// Methods:                                                          //
//  - setKey - check which key was pressed and set state bits        //
//  - unsetKey - check which key was released and unset state bits   //
//  - keyPressed - returns if a given key is pressed                 //
///////////////////////////////////////////////////////////////////////
class Input {
    constructor() {
        // 1000 - up
        // 0100 - down
        // 0010 - left
        // 0001 - right
        this.state = 0b0000;

        // Init input listeners
        // https://stackoverflow.com/a/43727582
        document.addEventListener("keydown", this.setKey.bind(this));
        document.addEventListener("keyup", this.unsetKey.bind(this));
    }

    // Set the correct bit in state when a key is pressed
    setKey(evt) {
        // ???
        evt = evt || window.event;

        // Set state bits based on evt.key for WASD and arrow keys
        switch (evt.key) {
            case "ArrowUp":
            case "w":
                this.state |= 0b1000;
                break;
            case "ArrowDown":
            case "s":
                this.state |= 0b0100;
                break;
            case "ArrowLeft":
            case "a":
                this.state |= 0b0010;
                break;
            case "ArrowRight":
            case "d":
                this.state |= 0b0001;
                break;
        }
    }

    // Unset the correct bit in state when a key is released
    unsetKey(evt) {
        // ???
        evt = evt || window.event;

        // Set state bits based on evt.key for WASD and arrow keys
        switch (evt.key) {
            case "ArrowUp":
            case "w":
                this.state &= 0b0111;
                break;
            case "ArrowDown":
            case "s":
                this.state &= 0b1011;
                break;
            case "ArrowLeft":
            case "a":
                this.state &= 0b1101;
                break;
            case "ArrowRight":
            case "d":
                this.state &= 0b1110;
                break;
        }
    }

    // Determine if a given key is pressed
    keyPressed(dir) {
        switch (dir) {
            // Return up bit
            case "up":
            case "UP":
            case "Up":
                return (this.state & 0b1000) >> 3;
            // Return down bit
            case "down":
            case "DOWN":
            case "Down":
                return (this.state & 0b0100) >> 2;
            // Return left bit
            case "left":
            case "LEFT":
            case "Left":
                return (this.state & 0b0010) >> 1;
            // Return right bit
            case "right":
            case "RIGHT":
            case "Right":
                return this.state & 0b0001;
            // If something weird was provided, return null
            default:
                return null;
        }
    }

}

// Sleep for some milliseconds
// https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep?page=1&tab=votes#tab-top
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Custom mod function to handle negatives
function mod(n, m) {
    return ((n % m) + m) % m;
}

// Clear the canvas screen
function clearScreen(id="maze") {
    document.getElementById("maze").getContext("2d").clearRect(0, 0, screenWidth, screenHeight);
}

// Set canvas size to be correct
function resetCanvasSize() {
    let ctx = document.getElementById("maze").getContext("2d");
    ctx.canvas.width = screenWidth;
    ctx.canvas.height = screenHeight;
}