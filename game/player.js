/* jshint esversion: 8 */

window.addEventListener("load", main);
window.addEventListener("resize", resetCanvasSize);

// Frame rate settings
let frameRate = 60;
let sleepTime = 1/frameRate * 1000;

// Window size
let screenWidth = 600;
let screenHeight = 600;

let gameRunning = true;

async function main() {
    // Init canvas size
    resetCanvasSize();

    // Init player
    let p = new Player();
    
    // Init level manager
    let man = new LevelManager();

    while (gameRunning) {
        clearScreen();
        p.update();
        p.draw();

        man.draw();

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
    constructor(x=screenWidth/2-32, y=screenHeight/2-64, spriteId="player", canId="maze", width=64, height=128, speed=5) {
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
        this.maxY = ctx.canvas.height;
        
        // Player sprite
        this.sprite = document.getElementById(spriteId);

        // Canvas id
        this.canId = canId;

        // Create a new Input to keep track of keyboard input
        this.input = new Input();
    }

    // Draw the player to the screen
    draw() {
        // Get the context
        let ctx = document.getElementById("maze").getContext("2d");

        // DEBUG: draw a rectangle around the player
        ctx.strokeRect(this.x, this.y, this.width, this.height);

        // Draw the player
        ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
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

        // Allow screen wrapping
        //this.x = mod(this.x + this.vx * this.speed, this.maxX);
        //this.y = mod(this.y + this.vy * this.speed, this.maxY);

        // Solid walls
        // https://stackoverflow.com/a/11409944 for clamping
        //this.x = Math.min(Math.max(this.x + this.vx * this.speed, 0), this.maxX - this.width);
        //this.y = Math.min(Math.max(this.y + this.vy * this.speed, 0), this.maxY - this.height);
        this.x += this.vx * this.speed;
        this.y += this.vy * this.speed;
        if (this.x > this.maxX - this.width) {
            this.x = this.maxX - this.width;
        }
        if (this.y > this.maxY - this.height) {
            this.y = this.maxY - this.height;
        }
        if (this.x < 0) {
            this.x = 0;
        }
        if (this.y < 0) {
            this.y = 0;
        }
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

class LevelManager {
    constructor() {
        // Init globalX and globalY to null
        this.globalX = null;
        this.globalY = null;

        // Init maze
        this.maze = new Maze();

        // Search for globalX and globalY cookie
        for (let cookie of document.cookie.split(";")) {
            if (cookie.includes("globalX=")) {
                this.globalX = Number.parseInt(cookie.split("=")[1]);
            }
            if (cookie.includes("globalY=")) {
                this.globalY = Number.parseInt(cookie.split("=")[1]);
            }
        }

        // Set both to zero if not found
        if (this.globalX == null) {
            this.globalX = 0;
        }
        if (this.globalY == null) {
            this.globalY = 0;
        }
    }

    draw() {
        this.maze.draw(this.globalX, this.globalY);
    }

    // Move the global position by 1 in a single direction
    moveGlobalPosition(dir) {
        // Change the global position based on dir
        switch (dir) {
            case "up":
            case "UP":
            case "Up":
                this.globalY--;
                break;
            case "down":
            case "DOWN":
            case "Down":
                this.globalY++;
                break;
            case "left":
            case "LEFT":
            case "Left":
                this.globalX--;
                break;
            case "right":
            case "RIGHT":
            case "Right":
                this.globalX++;
                break;
        }
    }

    // Set globalX and globalY to x and y
    setGlobalPos(x, y) {
        this.globalX = x;
        this.globalY = y;
    }

    // Write globalX and globalY to a cookie
    writeGlobalPos() {
        // Save global position, SameSite stops the console from complaining
        document.cookie = `globalX=${this.globalX}; SameSite=strict`;
        document.cookie = `globalY=${this.globalY}; SameSite=strict`;
    }
    
    // Delete globalX and globalY
    deleteGlobalPos() {
        document.cookie = `globalX=${this.globalX}; SameSite=strict; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
        document.cookie = `globalY=${this.globalY}; SameSite=strict; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
    }
}

class Maze {
    constructor(mazeId="maze") {
        // The maze as a string, see mazeTextLayout.txt for an explanation
        this.mazeStr = `
                        <--M7<7
                         ^<+W-J
                         E-W-7
                         L> F3
                            |E>
                            vv
                        `;
        // The maze as a 2D array
        this.maze = this.parseMazeStr(this.mazeStr);

        // ID of the maze canvas
        this.mazeId = mazeId;
    }

    // Convert a maze string into an array
    parseMazeStr(mazeStr) {
        // Remove all excess whitespace
        // Split into lines and remove empty first and last array
        let maze = mazeStr.split("\n").slice(1);
        maze.pop();
        // Find the index of the first non-space character in each row
        let leftEdge = maze[0].length;
        for (let row of maze) {
            let i = 0;
            while (row[i] == " ") {
                i++;
            }
            leftEdge = Math.min(leftEdge, i);
        }
        // Remove everything before the leftEdge and get the max length
        let maxRowLen = 0;
        for (let i = 0; i < maze.length; i++) {
            maze[i] = maze[i].slice(leftEdge).split("");
            maxRowLen = Math.max(maxRowLen, maze[i].length);
        }

        // Pad all rows to be equal length
        for (let i = 0; i < maze.length; i++) {
            while (maze[i].length < maxRowLen) {
                maze[i].push("");
            }
        }

        return maze;
    }

    // Draw the room at (x,y) in maze
    draw(x, y) {
        // Get the context
        let ctx = document.getElementById(this.mazeId).getContext("2d");

        // Draw the correct room
        // TODO: replace this with actual draw calls
        switch (this.maze[y][x]) {
            case "-":
				
				break;
			case "|":
				
				break;
			case "<":
				
				break;
			case ">":
				
				break;
			case "v":
				
				break;
			case "^":
				
				break;
			case "+":
				
				break;
			case "L":
				
				break;
			case "7":
				
				break;
			case "F":
				
				break;
			case "J":
				
				break;
			case "M":
				
				break;
			case "W":
				
				break;
			case "E":
				
				break;
			case "3":
				
				break;
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