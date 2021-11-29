window.addEventListener("load", drawCorners);
window.addEventListener("load", drawUpHall);
//window.addEventListener("load", drawUpSeal);
window.addEventListener("load", drawDownHall);
//window.addEventListener("load", drawDownSeal);
window.addEventListener("load", drawLeftHall);
//window.addEventListener("load", drawLeftSeal);
window.addEventListener("load", drawRightHall);
//window.addEventListener("load", drawRightSeal);


function drawCorners(){
    let c = document.getElementById("canvas");
    let pen = c.getContext("2d");
    pen.beginPath();
    
    //Upper Left edge
    pen.moveTo(100, 225);
    pen.lineTo(100, 100);
    pen.stroke();
    pen.lineTo(225, 100);
    pen.stroke();
    //Upper Right edge
    pen.moveTo(375, 100);
    pen.lineTo(500, 100);
    pen.stroke();
    pen.lineTo(500, 225);
    pen.stroke();
    //Lower Right edge
    pen.moveTo(500, 375);
    pen.lineTo(500, 500);
    pen.stroke();
    pen.lineTo(375, 500);
    pen.stroke();
    //Lower Left edge
    pen.moveTo(225, 500);
    pen.lineTo(100, 500);
    pen.stroke();
    pen.lineTo(100, 375);
    pen.stroke();

    //Rectangle Backgrounds

    //Upper Left Corner Background
    pen.fillRect(0,0,100,100);
    pen.stroke();
    //Upper Right Corner Background
    pen.fillRect(500,0,100,100);
    pen.stroke();
    //Lower Right Corner Background
    pen.fillRect(500,500,100,100);
    pen.stroke();
    //Lower Left Corner Background
    pen.fillRect(0,500,100,100);
    pen.stroke();
}

function drawUpHall(){
    let c = document.getElementById("canvas");
    let pen = c.getContext("2d");
    pen.beginPath();

    pen.moveTo(225,0);
    pen.lineTo(225,100);
    pen.stroke();
    pen.moveTo(375,0);
    pen.lineTo(375,100);
    pen.stroke();

    pen.fillRect(100,0,125,100);
    pen.stroke();
    pen.fillRect(375,0,125,100);
    pen.stroke();
}

function drawUpSeal(){
    let c = document.getElementById("canvas");
    let pen = c.getContext("2d");
    pen.beginPath();

    pen.moveTo(225,100);
    pen.lineTo(375,100);
    pen.stroke();
    
    pen.fillRect(100,0,400,100);
    pen.stroke();
}

function drawDownHall(){
    let c = document.getElementById("canvas");
    let pen = c.getContext("2d");
    pen.beginPath();

    pen.moveTo(225,500);
    pen.lineTo(225,600);
    pen.stroke();
    pen.moveTo(375,500);
    pen.lineTo(375,600);
    pen.stroke();

    pen.fillRect(100,500,125,100);
    pen.stroke();
    pen.fillRect(375,500,125,100);
    pen.stroke();
}

function drawDownSeal(){
    let c = document.getElementById("canvas");
    let pen = c.getContext("2d");
    pen.beginPath();

    pen.moveTo(225,500);
    pen.lineTo(375,500);
    pen.stroke();

    pen.fillRect(100,500,400,100);
    pen.stroke();
}

function drawLeftHall(){
    let c = document.getElementById("canvas");
    let pen = c.getContext("2d");
    pen.beginPath();

    pen.moveTo(0,225);
    pen.lineTo(100,225);
    pen.stroke();
    pen.moveTo(0,375);
    pen.lineTo(100,375);
    pen.stroke();

    pen.fillRect(0,100,100,125);
    pen.stroke();
    pen.fillRect(0,375,100,125);
    pen.stroke();
}

function drawLeftSeal(){
    let c = document.getElementById("canvas");
    let pen = c.getContext("2d");
    pen.beginPath();
    
    pen.moveTo(100,225);
    pen.lineTo(100,375);
    pen.stroke();

    pen.fillRect(0,100,100,400);
    pen.stroke();
}

function drawRightHall(){
    let c = document.getElementById("canvas");
    let pen = c.getContext("2d");
    pen.beginPath();

    pen.moveTo(500,225);
    pen.lineTo(600,225);
    pen.stroke();
    pen.moveTo(500,375);
    pen.lineTo(600,375);
    pen.stroke();

    pen.fillRect(500,100,100,125);
    pen.stroke();
    pen.fillRect(500,375,100,125);
    pen.stroke();
}

function drawRightSeal(){
    let c = document.getElementById("canvas");
    let pen = c.getContext("2d");
    pen.beginPath();

    pen.moveTo(500,225);
    pen.lineTo(500,375);
    pen.stroke();

    pen.fillRect(500,100,100,400);
    pen.stroke();
}

function draw()
{
    pen.beginPath();
    //Upper Left edge
    pen.moveTo(200, 350);
    pen.lineTo(200, 400);
    pen.stroke();
    pen.lineTo(250, 400);
    pen.stroke();
    //Upper Right edge
    pen.moveTo(350, 400);
    pen.lineTo(400, 400);
    pen.stroke();
    pen.lineTo(400, 350);
    pen.stroke();
    //Lower Right edge
    pen.moveTo(400, 250);
    pen.lineTo(400, 200);
    pen.stroke();
    pen.lineTo(350, 200);
    pen.stroke();
    //Lower Left edge
    pen.moveTo(250, 200);
    pen.lineTo(200, 200);
    pen.stroke();
    pen.lineTo(200, 250);
    pen.stroke();

    //Up Hallway
    pen.moveTo(250, 500);
    pen.lineTo(250, 400);
    pen.stroke();
    pen.moveTo(350, 500);
    pen.lineTo(350, 400);
    pen.stroke();
    
    //Down Hallway
    pen.moveTo(250, 200);
    pen.lineTo(250, 100);
    pen.stroke();
    pen.moveTo(350, 200);
    pen.lineTo(350, 100);
    pen.stroke();
    
    //Left Hallway
    pen.moveTo(100, 350);
    pen.lineTo(200, 350);
    pen.stroke();
    pen.moveTo(100, 250);
    pen.lineTo(200, 250);
    pen.stroke();
        
    //Right Hallway
    pen.moveTo(400, 350);
    pen.lineTo(500, 350);
    pen.stroke();
    pen.moveTo(400, 250);
    pen.lineTo(500, 250);
    pen.stroke();

    //Sealed Rooms
    //Up Seal
    pen.moveTo(250, 400);
    pen.lineTo(350, 400);
    pen.stroke();

    //Down Seal
    pen.moveTo(250, 200);
    pen.lineTo(350, 200);
    pen.stroke();

    //Left Seal
    pen.moveTo(200, 250);
    pen.lineTo(200, 350);
    pen.stroke();

    //Right Seal
    pen.moveTo(400, 250);
    pen.lineTo(400, 350);
    pen.stroke();
}