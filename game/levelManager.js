/* jshint esversion: 8 */

window.addEventListener("load", main);

function main() {
    let manager = new LevelManager();
    manager.draw();
    //console.log(manager.globalX, manager.globalY);
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
				console.log("-");
				break;
			case "|":
				console.log("|");
				break;
			case "<":
				console.log("<");
				break;
			case ">":
				console.log(">");
				break;
			case "v":
				console.log("v");
				break;
			case "^":
				console.log("^");
				break;
			case "+":
				console.log("+");
				break;
			case "L":
				console.log("L");
				break;
			case "7":
				console.log("7");
				break;
			case "F":
				console.log("F");
				break;
			case "J":
				console.log("J");
				break;
			case "M":
				console.log("M");
				break;
			case "W":
				console.log("W");
				break;
			case "E":
				console.log("E");
				break;
			case "3":
				console.log("3");
				break;
        }
    }
}