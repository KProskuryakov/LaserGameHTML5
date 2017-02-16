"use strict";
const canvas = document.getElementById("laser-game-canvas");
const ctx = canvas.getContext("2d");

const tileSize = 50;
const pieces = {};

class Piece {
    constructor (src) {
        this.tileX = null; this.tileY = null;
        this.img = new Image(); this.img.src = src;
    }
    getLocation () {
        return {x: this.tileX, y: this.tileY};
    }
    setLocation (x, y) {
        this.tileX = x; this.tileY = y;
    }
    draw (ctx) {
        if (this.tileX != null && this.tileY != null)
        var pos = tileToPixel(this.tileX, this.tileY, tileSize);
        ctx.drawImage(this.img, pos.x, pos.y);
    }
}

class Mirror extends Piece {
    constructor (src, north, east, south, west) {
        super(src);
        this.north = north; this.south = south; this.east = east; this.west = west;
    }
    processLaser(laser) {
        return new Laser(this.tileX, this.tileY, this[laser.dir], laser.r, laser.g, laser.b);
    }
}

class Swatch extends Piece {
    constructor (src, r, g, b) {
        super(src);
        this.r = r; this.g = g; this.b = b;
    }
}

class Laser {
    constructor (tileX, tileY, dir, r, g, b) {
        this.tileX = tileX; this.tileY = tileY; this.dir = dir;
        this.r = r; this.g = g; this.b = b;
    }
    draw (ctx, tileX, tileY) {

    }
}

const imgLaserGrid = new Image();

function init(canvas, ctx, tileSize, pieces) {
    canvas.addEventListener("mousemove", onMouseMove, false);
    canvas.addEventListener("click", onClick, false);

    pieces.forwardSlash = new Mirror("pieces/mirror_forwardslash.png", "east", "north", "west", "south");
    pieces.backSlash = new Mirror("pieces/mirror_backslash.png", "west", "south", "east", "north");
    pieces.blackHole = new Mirror("pieces/mirror_blackhole.png", "none", "none", "none", "none");
    pieces.sideSplit = new Mirror("pieces/mirror_sidesplit.png", "east", "none", "east", "splitns");
    pieces.upSplit = new Mirror("pieces/mirror_upsplit.png", "none", "north", "splitew", "north");

    pieces.blue = new Swatch("pieces/swatch_blue.png", 0, 0, 255);
    pieces.red = new Swatch("pieces/swatch_red.png", 255, 0, 0);
    pieces.green = new Swatch("pieces/swatch_green.png", 0, 255, 0);


    imgLaserGrid.onload = () => {draw(ctx, canvas.width, canvas.height, tileSize);};
    imgLaserGrid.src = "lasergrid.png";


    // draw(ctx, canvas.width, canvas.height, tileSize);
    // window.requestAnimationFrame(() => {update(0, 0, ctx, canvas.width, canvas.height, tileSize)});
}

// this update function would be useful in the case of a constantly updating frame
// function update (curTime, oldTime, ctx, windowWidth, windowHeight, tileSize) {
//     const dt = (curTime - oldTime) / 1000;
//     //console.log(dt);
//     draw(ctx, windowWidth, windowHeight, tileSize, dt);
//     window.requestAnimationFrame((newTime) => {update(newTime, curTime, ctx, windowWidth, windowHeight, tileSize)});
// }

function draw(ctx, windowWidth, windowHeight, tileSize) {
    // empty screen
    ctx.fillStyle = '#bcbcbc';
    ctx.fillRect(0, 0, windowWidth, windowHeight);

    ctx.drawImage(imgLaserGrid, 0, 0);

    ctx.drawImage(pieces.backSlash.img, 50, 50);
    ctx.drawImage(pieces.forwardSlash.img, 100, 50);
    ctx.drawImage(pieces.blackHole.img, 150, 50);
    ctx.drawImage(pieces.blue.img, 200, 50);
    ctx.drawImage(pieces.green.img, 250, 50);
    ctx.drawImage(pieces.red.img, 50, 100);
    ctx.drawImage(pieces.upSplit.img, 100, 100);
    ctx.drawImage(pieces.sideSplit.img, 150, 100);

    // // grid setup
    // ctx.strokeStyle = "#000";
    // for (let i = 0; i <= 5; i++) {
    //     traceHorizontalLine(ctx, tileSize + tileSize * i, tileSize, tileSize * 6);
    //     traceVerticalLine(ctx, tileSize + tileSize * i, tileSize, tileSize * 6);
    // }
    //
    // // draw toolbar boxes
    // traceHorizontalLine(ctx, windowHeight - tileSize * 3, tileSize, tileSize * 9);
    // traceHorizontalLine(ctx, windowHeight - tileSize * 2, tileSize, tileSize * 9);
    // for (let i = 0; i <= 8; i++) {
    //     traceVerticalLine(ctx, tileSize + i * tileSize, windowHeight - tileSize * 3, windowHeight - tileSize * 2);
    // }
    // ctx.stroke();

    // draw edge numbers
    // drawEdgeNumbers(ctx, tileSize, "24px Ariel", "#000000");

    // if ever needed
    //drawFPS(ctx, "24px Ariel", "#000000", fps);
}

function onMouseMove(event) {
    //console.log("Moved here: x" + event.clientX + ", y: " + event.clientY);
}

function onClick(event) {
    //console.log("Clicked here: x" + event.clientX + ", y: " + event.clientY);
}

// function drawHorizontalLine(ctx, yOffset, x1, x2) {
//     ctx.moveTo(x1, yOffset);
//     ctx.lineTo(x2, yOffset);
//     ctx.stroke();
// }
//
// function traceHorizontalLine(ctx, yOffset, x1, x2) {
//     ctx.moveTo(x1, yOffset);
//     ctx.lineTo(x2, yOffset);
// }
//
// function drawVerticalLine(ctx, xOffset, y1, y2) {
//     ctx.moveTo(xOffset, y1);
//     ctx.lineTo(xOffset, y2);
//     ctx.stroke();
// }
//
// function traceVerticalLine(ctx, xOffset, y1, y2) {
//     ctx.moveTo(xOffset, y1);
//     ctx.lineTo(xOffset, y2);
// }
//
// function drawLine(ctx, x1, y1, x2, y2) {
//     ctx.moveTo(x1, y1);
//     ctx.lineTo(x2, y2);
//     ctx.stroke();
// }
//
// function drawEdgeNumbers(ctx, tileSize, fontString, textColor) {
//     let halfTile = tileSize / 2;
//     ctx.font = fontString;
//     ctx.fillStyle = textColor;
//     ctx.textAlign = "center";
//     for (let edge = 1; edge <= 20; edge++) {
//         let tile = edgeNumberToTile(edge);
//         ctx.fillText(`${edge}`, tile.x * tileSize + halfTile, tile.y * tileSize + halfTile + 12);
//     }
// }

// if ever needed
// function drawFPS(ctx, fontString, textColor, dt) {
//     ctx.font = fontString;
//     ctx.fillStyle = textColor;
//     ctx.textAlign = "center";
//     let fps = Math.floor(dt * 1000);
//     ctx.fillText(`${fps}`, 760, 20);
// }

function edgeNumberToTile(e) {
    if (e < 6) {
        return {x: e, y: 0, dir: "south"};
    } else if (e < 11) {
        return {x: 6, y: e - 5, dir: "west"};
    } else if (e < 16) {
        return {x: -e + 16, y: 6, dir: "north"};
    } else if (e < 21) {
        return {x: 0, y: -e + 21, dir: "east"};
    }
}

function pixelToTile(x, y, tileSize) {
    return {tileX: Math.floor(x / tileSize), tileY: Math.floor(y / tileSize)};
}

function tileToPixel(tileX, tileY, tileSize) {
    return {x: tileX * tileSize, y: tileY * tileSize};
}

function tileToEdgeNumber(x, y) {
    if (y === 0 && x > 0 && x < 6) {
        return x;
    } else if (x === 6 && y > 0 && y < 6) {
        return 5 + y;
    } else if (y === 6 && x > 0 && x < 6) {
        return 16 - x;
    } else if (x === 0 && y > 0 && y < 6) {
        return 21 - y;
    }
    return null;
}

function getOppositeDirection() {

}

// function rgb(r, g, b){
//
//     return "rgb("+r+","+g+","+b+")";
// }


init(canvas, ctx, tileSize, pieces);