/* jshint esversion: 8 */

window.addEventListener("load", main);

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


async function main() {
    // Init canvas size
    initCanvasSize();

    // Init level manager
    let man = new LevelManager();

    // Init player
    let p = new Player(man);

    // If debug cookie is set, activate debug features
    if (document.cookie.includes("debug")) {
        p.speed = 20;
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
    constructor(manager, x=screenWidth/2-25, y=screenHeight/2-50, spriteId="player", canId="maze", width=50, height=100, speed=10) {
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

        // Move player only in the x direction
        // This prevents a wall above/below from block left/right movement
        // The collision is kinda scuffed, so this is the best solution
        this.x += this.vx * this.speed;

        // If the player has intersected anything, move them back slowly
        // Reverse Mario 64 quarter steps
        while (this.man.room.collide(this)) {
            this.x -= this.vx * this.speed * 0.25;
        }

        // Move player only in the y direction, see previous two comments
        this.y += this.vy * this.speed;
        while (this.man.room.collide(this)) {
            this.y -= this.vy * this.speed * 0.25;
        }

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
                // Prevent arrow keys from scrolling the screen
                // https://stackoverflow.com/a/8916697
                evt.preventDefault();
                break;
            case "ArrowDown":
            case "s":
                this.state |= 0b0100;
                evt.preventDefault();
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
                evt.preventDefault();
                break;
            case "ArrowDown":
            case "s":
                this.state &= 0b1011;
                evt.preventDefault();
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

        // Get the current room
        this.room = new Room(this.maze.maze[this.globalY][this.globalX]);
    }

    draw() {
        this.room.draw();
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
                    this.room = new Room(this.maze.maze[this.globalY][this.globalX]);
                    this.writeGlobalPos();
                    return true;
                }
                return false;
            case "down":
            case "DOWN":
            case "Down":
                if (this.globalY + 1 <= this.maze.maxY) {
                    this.globalY++;
                    this.room = new Room(this.maze.maze[this.globalY][this.globalX]);
                    this.writeGlobalPos();
                    return true;
                }
                return false;
            case "left":
            case "LEFT":
            case "Left":
                if (this.globalX - 1 >= this.maze.minX) {
                    this.globalX--;
                    this.room = new Room(this.maze.maze[this.globalY][this.globalX]);
                    this.writeGlobalPos();
                    return true;
                }
                return false;
            case "right":
            case "RIGHT":
            case "Right":
                if (this.globalX == this.maze.maxX && this.globalY == this.maze.maxY) {
                    this.deleteGlobalPos();
                    window.location.href = "youWin.html";
                    return false;
                }
                else if (this.globalX + 1 <= this.maze.maxX) {
                    this.globalX++;
                    this.room = new Room(this.maze.maze[this.globalY][this.globalX]);
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
        this.room = new Room(this.maze.maze[this.globalY][this.globalX]);
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
                        F-M>FM---7
                        |<W-JL-7^|
                        |F---7F3LJ
                        |vF7^LJLM7
                        EMJ|E7F-J|
                        |vFJ|LJF7v
                        L7L7L--JE7
                        ^E7L-7^FJv
                        |||F7||L-7
                        LJLJvvL--W
        `
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

        // DEBUG: draw room symbol
        ctx.font = "40px sans-serif";
        ctx.fillStyle = "white";
        ctx.fillText(this.maze[y][x], 0, 30);
        ctx.fillStyle = "black";

        // Draw the correct room
        switch (this.maze[y][x]) {
            case "-":
                drawLeftHall(ctx);
                drawUpSeal(ctx);
                drawRightHall(ctx);
                drawDownSeal(ctx);
				break;
			case "|":
                drawLeftSeal(ctx);
                drawUpHall(ctx);
                drawRightSeal(ctx);
                drawDownHall(ctx);
				break;
			case "<":
                drawLeftSeal(ctx);
                drawUpSeal(ctx);
                drawRightHall(ctx);
                drawDownSeal(ctx);
				break;
			case ">":
                drawLeftHall(ctx);
                drawUpSeal(ctx);
                drawRightSeal(ctx);
                drawDownSeal(ctx);
				break;
			case "v":
                drawLeftSeal(ctx);
                drawUpHall(ctx);
                drawRightSeal(ctx);
                drawDownSeal(ctx);
				break;
			case "^":
                drawLeftSeal(ctx);
                drawUpSeal(ctx);
                drawRightSeal(ctx);
                drawDownHall(ctx);
				break;
			case "+":
                drawLeftHall(ctx);
                drawUpHall(ctx);
                drawRightHall(ctx);
                drawDownHall(ctx);
				break;
			case "L":
                drawLeftSeal(ctx);
                drawUpHall(ctx);
                drawRightHall(ctx);
                drawDownSeal(ctx);
				break;
			case "7":
                drawLeftHall(ctx);
                drawUpSeal(ctx);
                drawRightSeal(ctx);
                drawDownHall(ctx);
				break;
			case "F":
                drawLeftSeal(ctx);
                drawUpSeal(ctx);
                drawRightHall(ctx);
                drawDownHall(ctx);
				break;
			case "J":
                drawLeftHall(ctx);
                drawUpHall(ctx);
                drawRightSeal(ctx);
                drawDownSeal(ctx);
				break;
			case "M":
                drawLeftHall(ctx);
                drawUpSeal(ctx);
                drawRightHall(ctx);
                drawDownHall(ctx);
				break;
			case "W":
                drawLeftHall(ctx);
                drawUpHall(ctx);
                drawRightHall(ctx);
                drawDownSeal(ctx);
				break;
			case "E":
                drawLeftSeal(ctx);
                drawUpHall(ctx);
                drawRightHall(ctx);
                drawDownHall(ctx);
				break;
			case "3":
                drawLeftHall(ctx);
                drawUpHall(ctx);
                drawRightSeal(ctx);
                drawDownHall(ctx);
				break;
        }
    }
}

class Room {
    constructor(mazeSymbol, mazeId="maze") {
        // Init properties
        this.mazeSymbol = mazeSymbol;
        this.mazeId = mazeId;

        // Rectangles for drawing and collision
        this.rects = Room.baseRects();

        // Switch to determine usable rectangles
        switch (mazeSymbol) {
            case "-":
                this.rects = this.rects.concat(Room.upSealRects());
                this.rects = this.rects.concat(Room.downSealRects());
                this.rects = this.rects.concat(Room.leftHallRects());
                this.rects = this.rects.concat(Room.rightHallRects());
				break;
			case "|":
                this.rects = this.rects.concat(Room.upHallRects());
                this.rects = this.rects.concat(Room.downHallRects());
                this.rects = this.rects.concat(Room.leftSealRects());
                this.rects = this.rects.concat(Room.rightSealRects());
				break;
			case "<":
                this.rects = this.rects.concat(Room.upSealRects());
                this.rects = this.rects.concat(Room.downSealRects());
                this.rects = this.rects.concat(Room.leftSealRects());
                this.rects = this.rects.concat(Room.rightHallRects());
				break;
			case ">":
                this.rects = this.rects.concat(Room.upSealRects());
                this.rects = this.rects.concat(Room.downSealRects());
                this.rects = this.rects.concat(Room.leftHallRects());
                this.rects = this.rects.concat(Room.rightSealRects());
				break;
			case "v":
                this.rects = this.rects.concat(Room.upHallRects());
                this.rects = this.rects.concat(Room.downSealRects());
                this.rects = this.rects.concat(Room.leftSealRects());
                this.rects = this.rects.concat(Room.rightSealRects());
				break;
			case "^":
                this.rects = this.rects.concat(Room.upSealRects());
                this.rects = this.rects.concat(Room.downHallRects());
                this.rects = this.rects.concat(Room.leftSealRects());
                this.rects = this.rects.concat(Room.rightSealRects());
				break;
			case "+":
                this.rects = this.rects.concat(Room.upHallRects());
                this.rects = this.rects.concat(Room.downHallRects());
                this.rects = this.rects.concat(Room.leftHallRects());
                this.rects = this.rects.concat(Room.rightHallRects());
				break;
			case "L":
                this.rects = this.rects.concat(Room.upHallRects());
                this.rects = this.rects.concat(Room.downSealRects());
                this.rects = this.rects.concat(Room.leftSealRects());
                this.rects = this.rects.concat(Room.rightHallRects());
				break;
			case "7":
                this.rects = this.rects.concat(Room.upSealRects());
                this.rects = this.rects.concat(Room.downHallRects());
                this.rects = this.rects.concat(Room.leftHallRects());
                this.rects = this.rects.concat(Room.rightSealRects());
				break;
			case "F":
                this.rects = this.rects.concat(Room.upSealRects());
                this.rects = this.rects.concat(Room.downHallRects());
                this.rects = this.rects.concat(Room.leftSealRects());
                this.rects = this.rects.concat(Room.rightHallRects());
				break;
			case "J":
                this.rects = this.rects.concat(Room.upHallRects());
                this.rects = this.rects.concat(Room.downSealRects());
                this.rects = this.rects.concat(Room.leftHallRects());
                this.rects = this.rects.concat(Room.rightSealRects());
				break;
			case "M":
                this.rects = this.rects.concat(Room.upSealRects());
                this.rects = this.rects.concat(Room.downHallRects());
                this.rects = this.rects.concat(Room.leftHallRects());
                this.rects = this.rects.concat(Room.rightHallRects());
				break;
			case "W":
                this.rects = this.rects.concat(Room.upHallRects());
                this.rects = this.rects.concat(Room.downSealRects());
                this.rects = this.rects.concat(Room.leftHallRects());
                this.rects = this.rects.concat(Room.rightHallRects());
				break;
			case "E":
                this.rects = this.rects.concat(Room.upHallRects());
                this.rects = this.rects.concat(Room.downHallRects());
                this.rects = this.rects.concat(Room.leftSealRects());
                this.rects = this.rects.concat(Room.rightHallRects());
				break;
			case "3":
                this.rects = this.rects.concat(Room.upHallRects());
                this.rects = this.rects.concat(Room.downHallRects());
                this.rects = this.rects.concat(Room.leftHallRects());
                this.rects = this.rects.concat(Room.rightSealRects());
				break;
        }
    }

    // Draw the current room
    draw() {
        let ctx = document.getElementById(this.mazeId).getContext("2d");
        
        for (let rect of this.rects) {
            rect.draw();
        }
    }

    // Check if an object collides with any rectangles in the room
    // object must have .corners() method
    collide(object) {
        for (let r of this.rects) {
            if (r.collide(object)) {
                return true;
            }
        }
        return false;
    }

    static baseRects() {
        return [
            new Rect(0, 0, 100, 100),
            new Rect(500, 0, 100, 100),
            new Rect(500, 500, 100, 100),
            new Rect(0, 500, 100, 100)
        ];
    }

    static upHallRects() {
        return [
            new Rect(100, 0, 125, 100),
            new Rect(375, 0, 125, 100)
        ];
    }

    static upSealRects() {
        return [
            new Rect(100, 0, 400, 100)
        ];
    }

    static downHallRects() {
        return [
            new Rect(100, 500, 125, 100),
            new Rect(375, 500, 125, 100)
        ];
    }

    static downSealRects() {
        return [
            new Rect(100, 500, 400, 100)
        ];
    }

    static leftHallRects() {
        return [
            new Rect(0, 100, 100, 125),
            new Rect(0, 375, 100, 125)
        ];
    }

    static leftSealRects() {
        return [
            new Rect(0, 100, 100, 400)
        ];
    }

    static rightHallRects() {
        return [
            new Rect(500, 100, 100, 125),
            new Rect(500, 375, 100, 125)
        ];
    }

    static rightSealRects() {
        return [
            new Rect(500, 100, 100, 400)
        ];
    }
}

class Rect {
    constructor(x, y, w, h, col="black", canId="maze") {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.col = col;
        this.canId = canId;
    }

    // Draw the rectangle on canId
    draw() {
        let ctx = document.getElementById(this.canId).getContext("2d");
        ctx.fillStyle = this.col;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }

    // Return a list of the objects corners
    corners() {
        return [
            [this.x, this.y],
            [this.x + this.w, this.y],
            [this.x, this.y + this.h],
            [this.x + this.w, this.y + this.h]
        ];
    }

    // Calculate if an object has collided
    // object must have a corners method (see above)
    collide(object) {
        let corn = object.corners();
        let collision = false

        for (let c of corn) {
            collision ||= c[0] >= this.x &&
                          c[0] <= this.x + this.w &&
                          c[1] >= this.y &&
                          c[1] <= this.y + this.h;
        }

        return collision;
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
function initCanvasSize() {
    let ctx = document.getElementById("maze").getContext("2d");
    ctx.canvas.width = screenWidth;
    ctx.canvas.height = screenHeight;
}
