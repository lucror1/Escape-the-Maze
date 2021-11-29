/* jshint esversion: 8 */

window.addEventListener("load", main);
window.addEventListener("resize", resetCanvasSize);

// Frame rate settings
const frameRate = 60;
const sleepTime = 1/frameRate * 1000;

// Window size
const screenWidth = 600;
const screenHeight = 600;

// Useful constants
const halfScreenWidth = screenWidth / 2;
const halfScreenHeight = screenHeight / 2;

let gameRunning = true;

// Separate functions for drawings
// Using 0.5 b/c https://stackoverflow.com/a/8696641
// Half of the hall size, vertical is top/bottom, horizontal left/right
const halfVerticalHallSize = 50;
const halfHorizontalHallSize = 75;

// The spacing between the walls and the edge of the screen
const verticalWallPadding = 100;
const horizontalWallPadding = 100;

function drawBase(pen) {
    pen.beginPath();

    // Top left
    pen.moveTo(horizontalWallPadding + 0.5, halfScreenHeight - halfHorizontalHallSize + 0.5);
    pen.lineTo(horizontalWallPadding + 0.5, verticalWallPadding + 0.5);
    pen.lineTo(halfScreenWidth - halfVerticalHallSize + 0.5, verticalWallPadding + 0.5);

    // Top right
    pen.moveTo(halfScreenWidth + halfVerticalHallSize + 0.5, verticalWallPadding + 0.5);
    pen.lineTo(screenWidth - horizontalWallPadding + 0.5, verticalWallPadding + 0.5);
    pen.lineTo(screenWidth - horizontalWallPadding + 0.5, halfScreenHeight - halfHorizontalHallSize + 0.5);

    // Bottom right
    pen.moveTo(screenWidth - horizontalWallPadding + 0.5, halfScreenHeight + halfHorizontalHallSize + 0.5);
    pen.lineTo(screenWidth - horizontalWallPadding + 0.5, screenHeight - verticalWallPadding + 0.5);
    pen.lineTo(halfScreenWidth + halfVerticalHallSize + 0.5, screenHeight - verticalWallPadding + 0.5);

    // Bottom left
    pen.moveTo(halfScreenWidth - halfVerticalHallSize + 0.5, screenHeight - verticalWallPadding + 0.5);
    pen.lineTo(horizontalWallPadding + 0.5, screenHeight - verticalWallPadding + 0.5);
    pen.lineTo(horizontalWallPadding + 0.5, halfScreenHeight + halfHorizontalHallSize + 0.5);

    pen.stroke();
}
function drawUpHall(pen)
{
    //let c = document.getElementById("canvas");
    //let pen = c.getContext("2d");
    
    pen.beginPath();

    //pen.moveTo(250, 200);
    //pen.lineTo(250, 100);
    pen.moveTo(halfScreenWidth - halfVerticalHallSize + 0.5, verticalWallPadding + 0.5);
    pen.lineTo(halfScreenWidth - halfVerticalHallSize + 0.5, 0);

    //pen.moveTo(350, 200);
    //pen.lineTo(350, 100);
    pen.moveTo(halfScreenWidth + halfVerticalHallSize + 0.5, verticalWallPadding + 0.5);
    pen.lineTo(halfScreenWidth + halfVerticalHallSize + 0.5, 0);

    pen.stroke();
}
function drawUpSeal(pen)
{
    //let c = document.getElementById("canvas");
    //let pen = c.getContext("2d");
    
    pen.beginPath();
    
    pen.moveTo(halfScreenWidth - halfVerticalHallSize, verticalWallPadding + 0.5);
    pen.lineTo(halfScreenWidth + halfVerticalHallSize + 0.5, verticalWallPadding + 0.5);

    pen.stroke();
}
function drawDownHall(pen)
{
    //let c = document.getElementById("canvas");
    //let pen = c.getContext("2d");
    
    pen.beginPath();
    
    //pen.moveTo(250, 500);
    //pen.lineTo(250, 400);
    pen.moveTo(halfScreenWidth - halfVerticalHallSize + 0.5, screenHeight - verticalWallPadding + 0.5);
    pen.lineTo(halfScreenWidth - halfVerticalHallSize + 0.5, screenHeight);

    //pen.moveTo(350, 500);
    //pen.lineTo(350, 400);
    pen.moveTo(halfScreenWidth + halfVerticalHallSize + 0.5, screenHeight - verticalWallPadding + 0.5);
    pen.lineTo(halfScreenWidth + halfVerticalHallSize + 0.5, screenHeight);
    
    pen.stroke();
}
function drawDownSeal(pen)
{
    //let c = document.getElementById("canvas");
    //let pen = c.getContext("2d");
    
    pen.beginPath();

    pen.moveTo(halfScreenWidth - halfVerticalHallSize, screenHeight - verticalWallPadding + 0.5);
    pen.lineTo(halfScreenWidth + halfVerticalHallSize + 0.5, screenHeight - verticalWallPadding + 0.5);
    
    pen.stroke();
}
function drawLeftHall(pen)
{
    //let c = document.getElementById("canvas");
    //let pen = c.getContext("2d");
    
    pen.beginPath();

    //pen.moveTo(100, 250);
    //pen.lineTo(200, 250);
    pen.moveTo(0,  halfScreenHeight - halfHorizontalHallSize + 0.5);
    pen.lineTo(horizontalWallPadding, halfScreenHeight - halfHorizontalHallSize + 0.5);

    //pen.moveTo(100, 350);
    //pen.lineTo(200, 350);
    pen.moveTo(0,  halfScreenHeight + halfHorizontalHallSize + 0.5);
    pen.lineTo(horizontalWallPadding, halfScreenHeight + halfHorizontalHallSize + 0.5);
    
    pen.stroke();
}
function drawLeftSeal(pen)
{
    //let c = document.getElementById("canvas");
    //let pen = c.getContext("2d");

    pen.beginPath();

    pen.moveTo(horizontalWallPadding + 0.5, halfScreenHeight - halfHorizontalHallSize + 0.5);
    pen.lineTo(horizontalWallPadding + 0.5, halfScreenHeight + halfHorizontalHallSize + 0.5);
    
    pen.stroke();
}
function drawRightHall(pen)
{
    //let c = document.getElementById("canvas");
    //let pen = c.getContext("2d");
    
    pen.beginPath();
    
    //pen.moveTo(400, 250);
    //pen.lineTo(500, 250);
    pen.moveTo(screenWidth - horizontalWallPadding,  halfScreenHeight - halfHorizontalHallSize + 0.5);
    pen.lineTo(screenWidth, halfScreenHeight - halfHorizontalHallSize + 0.5);
    
    //pen.moveTo(400, 350);
    //pen.lineTo(500, 350);
    pen.moveTo(screenWidth - horizontalWallPadding,  halfScreenHeight + halfHorizontalHallSize + 0.5);
    pen.lineTo(screenWidth, halfScreenHeight + halfHorizontalHallSize + 0.5);
    
    pen.stroke();
}
function drawRightSeal(pen)
{
    //let c = document.getElementById("canvas");
    //let pen = c.getContext("2d");
    
    pen.beginPath();

    //pen.moveTo(screenWidth - 100 + 0.5, 250);
    //pen.lineTo(screenWidth - 100 + 0.5, 350);
    pen.moveTo(screenWidth - horizontalWallPadding + 0.5,  halfScreenHeight - halfHorizontalHallSize + 0.5);
    pen.lineTo(screenWidth - horizontalWallPadding + 0.5,  halfScreenHeight + halfHorizontalHallSize + 0.5);
    
    pen.stroke();
}

async function main() {
    // Init canvas size
    resetCanvasSize();

    // Init level manager
    let man = new LevelManager();

    // Init player
    let p = new Player(man);

    // If debug cookie is set, activate debug features
    if (document.cookie.includes("debug")) {
        p.speed = 10;
    }

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
//  - manager - a LevelManager so the player can transition screens    //
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
    constructor(manager, x=screenWidth/2-32, y=screenHeight/2-64, spriteId="player", canId="maze", width=50, height=100, speed=5) {
        // LevelManager to trigger level transitions
        this.man = manager;

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
        // Get the context and don't smooth
        let ctx = document.getElementById("maze").getContext("2d");
        ctx.imageSmoothingEnabled = false;

        // Draw the player
        ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);

        // DEBUG: draw a rectangle around the player
        ctx.strokeRect(this.x - 0.5, this.y - 0.5, this.width, this.height);
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

        // Move player
        this.x += this.vx * this.speed;
        this.y += this.vy * this.speed;

        // If at the edge, transition to next room if that room exists
        // If it does, move the player to the entrance of the next room
        // If it doesn't, prevent the player from moving off screen
        if (this.x > this.maxX - this.width) {
            if (this.man.moveGlobalPosition("right")) {
                this.x = 10;
            } else {
                this.x = this.maxX - this.width;
            }
        }
        if (this.y > this.maxY - this.height) {
            if (this.man.moveGlobalPosition("down")) {
                this.y = 10;
            } else {
                this.y = this.maxY - this.height;
            }
        }
        if (this.x < 0) {
            if (this.man.moveGlobalPosition("left")) {
                this.x = this.maxX - this.width - 10;
            } else {
                this.x = 0;
            }
        }
        if (this.y < 0) {
            if (this.man.moveGlobalPosition("up")) {
                this.y = this.maxY - this.height - 10;
            } else {
                this.y = 0;
            }
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
        // Change the global position based on dir if possible
        // A move is possible if it stays inside the maze bounds so the
        // player can move into empty rooms until collision works
        // Return if a move occured at all
        switch (dir) {
            case "up":
            case "UP":
            case "Up":
                if (this.globalY - 1 >= this.maze.minY) {
                    this.globalY--;
                    this.writeGlobalPos();
                    return true;
                }
                return false;
            case "down":
            case "DOWN":
            case "Down":
                if (this.globalY + 1 <= this.maze.maxY) {
                    this.globalY++;
                    this.writeGlobalPos();
                    return true;
                }
                return false;
            case "left":
            case "LEFT":
            case "Left":
                if (this.globalX - 1 >= this.maze.minX) {
                    this.globalX--;
                    this.writeGlobalPos();
                    return true;
                }
                return false;
            case "right":
            case "RIGHT":
            case "Right":
                if (this.globalX + 1 <= this.maze.maxX) {
                    this.globalX++;
                    this.writeGlobalPos();
                    return true;
                }
                return false;
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

        // Min/max x and y of the maze
        this.minX = 0;
        this.maxX = this.maze[0].length - 1;
        this.minY = 0;
        this.maxY = this.maze.length - 1;
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

        // Draw the base room
        drawBase(ctx);

        // DEBUG: set font size for text rendering
        ctx.font = "40px sans-serif";

        // Draw the correct room
        switch (this.maze[y][x]) {
            case "-":
				ctx.fillText(this.maze[y][x], 0, 30);
                drawLeftHall(ctx);
                drawUpSeal(ctx);
                drawRightHall(ctx);
                drawDownSeal(ctx);
				break;
			case "|":
				ctx.fillText(this.maze[y][x], 0, 30);
                drawLeftSeal(ctx);
                drawUpHall(ctx);
                drawRightSeal(ctx);
                drawDownHall(ctx);
				break;
			case "<":
				ctx.fillText(this.maze[y][x], 0, 30);
                drawLeftSeal(ctx);
                drawUpSeal(ctx);
                drawRightHall(ctx);
                drawDownSeal(ctx);
				break;
			case ">":
				ctx.fillText(this.maze[y][x], 0, 30);
                drawLeftHall(ctx);
                drawUpSeal(ctx);
                drawRightSeal(ctx);
                drawDownSeal(ctx);
				break;
			case "v":
				ctx.fillText(this.maze[y][x], 0, 30);
                drawLeftSeal(ctx);
                drawUpHall(ctx);
                drawRightSeal(ctx);
                drawDownSeal(ctx);
				break;
			case "^":
				ctx.fillText(this.maze[y][x], 0, 30);
                drawLeftSeal(ctx);
                drawUpSeal(ctx);
                drawRightSeal(ctx);
                drawDownHall(ctx);
				break;
			case "+":
				ctx.fillText(this.maze[y][x], 0, 30);
                drawLeftHall(ctx);
                drawUpHall(ctx);
                drawRightHall(ctx);
                drawDownHall(ctx);
				break;
			case "L":
				ctx.fillText(this.maze[y][x], 0, 30);
                drawLeftSeal(ctx);
                drawUpHall(ctx);
                drawRightHall(ctx);
                drawDownSeal(ctx);
				break;
			case "7":
				ctx.fillText(this.maze[y][x], 0, 30);
                drawLeftHall(ctx);
                drawUpSeal(ctx);
                drawRightSeal(ctx);
                drawDownHall(ctx);
				break;
			case "F":
				ctx.fillText(this.maze[y][x], 0, 30);
                drawLeftSeal(ctx);
                drawUpSeal(ctx);
                drawRightHall(ctx);
                drawDownHall(ctx);
				break;
			case "J":
				ctx.fillText(this.maze[y][x], 0, 30);
                drawLeftHall(ctx);
                drawUpHall(ctx);
                drawRightSeal(ctx);
                drawDownSeal(ctx);
				break;
			case "M":
				ctx.fillText(this.maze[y][x], 0, 30);
                drawLeftHall(ctx);
                drawUpSeal(ctx);
                drawRightHall(ctx);
                drawDownHall(ctx);
				break;
			case "W":
				ctx.fillText(this.maze[y][x], 0, 30);
                drawLeftHall(ctx);
                drawUpHall(ctx);
                drawRightHall(ctx);
                drawDownSeal(ctx);
				break;
			case "E":
				ctx.fillText(this.maze[y][x], 0, 30);
                drawLeftSeal(ctx);
                drawUpHall(ctx);
                drawRightHall(ctx);
                drawDownHall(ctx);
				break;
			case "3":
				ctx.fillText(this.maze[y][x], 0, 30);
                drawLeftHall(ctx);
                drawUpHall(ctx);
                drawRightSeal(ctx);
                drawDownHall(ctx);
				break;
        }
    }
}

// Sleep for some milliseconds
// https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep?page=1&tab=votes#tab-top
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
