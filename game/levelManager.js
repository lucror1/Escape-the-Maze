/* jshint esversion: 8 */

window.addEventListener("load", main);

function main() {
    let manager = new LevelManager();
    console.log(manager.globalX, manager.globalY);
}

class LevelManager {
    constructor() {
        // Init globalX and globalY to null
        this.globalX = null;
        this.globalY = null;

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