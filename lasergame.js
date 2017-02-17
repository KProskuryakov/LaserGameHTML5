"use strict";
class Piece {
    constructor (src) {
        this.tile = new Tile(-1, -1);
        this.img = new Image(); this.img.src = src;
    }
    getLocation () {
        return this.tile;
    }
    setLocation (tile) {
        this.tile = tile;
    }
    draw() {
        if (this.tile.isValid()) {
            let pos = this.tile.toPixels();
            ctx.drawImage(this.img, pos.x, pos.y);
        }
    }
    drawAt(tile) {
        let pos = tile.toPixels();
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
    constructor (tile, dir, r, g, b) {
        this.tile = tile; this.dir = dir;
        this.r = r; this.g = g; this.b = b;
    }
    draw () {

    }
}

class Tile {
    static TileFromPixels(x, y) {
        return new Tile(Math.floor(x / tileSize), Math.floor(y / tileSize));
    }
    constructor(tileX = -1, tileY = -1) {
        this.tileX = tileX; this.tileY = tileY;
    }
    isValid() {
        return (this.tileX > -1 && this.tileY > -1);
    }
    toPixels() {
        return {x: this.tileX * tileSize, y: this.tileY * tileSize};
    }
    getOffsetTile(tileX = 0, tileY = 0) {
        return new Tile(this.tileX + tileX, this.tileY + tileY);
    }
    equals(tile) {
        return (this.tileX === tile.tileX && this.tileY === tile.tileY);
    }
    minus(tile) {
        return new Tile(this.tileX - tile.tileX, this.tileY - tile.tileY);
    }
}

class Toolbar {
    constructor(src, tile) {
        this.img = new Image(); this.img.src = src;
        this.tile = tile;
        this.selectedPiece = 0;
    }
    draw() {
        let loc = this.tile.toPixels();
        ctx.drawImage(this.img, loc.x, loc.y);
        pieces.get("forwardSlash").drawAt(this.tile);
        pieces.get("backSlash").drawAt(this.tile.getOffsetTile(1, 0));
        pieces.get("blackHole").drawAt(this.tile.getOffsetTile(2, 0));
        pieces.get("sideSplit").drawAt(this.tile.getOffsetTile(3, 0));
        pieces.get("upSplit").drawAt(this.tile.getOffsetTile(4, 0));
        pieces.get("blue").drawAt(this.tile.getOffsetTile(5, 0));
        pieces.get("red").drawAt(this.tile.getOffsetTile(6, 0));
        pieces.get("green").drawAt(this.tile.getOffsetTile(7, 0));
        ctx.fillStyle = "green";
        ctx .globalAlpha = 0.2;
        loc = new Tile(this.tile.getOffsetTile(this.selectedPiece, 0).tileX, this.tile.tileY).toPixels();
        ctx.fillRect(loc.x, loc.y, tileSize, tileSize);
        console.log(loc.x);
        ctx.globalAlpha = 1;
    }
    processMouseInput(tile) {
        let tileLoc = tile.minus(this.tile);
        if (tileLoc.tileY === 0) {
            if (tileLoc.tileX > -1 && tileLoc.tileX < numToPiece.length) {
                let tempPiece = this.selectedPiece;
                this.selectedPiece = tileLoc.tileX;
                if (tempPiece != this.selectedPiece) {
                    draw();
                }
            }
        }
    }
}


const canvas = document.getElementById("laser-game-canvas");
const ctx = canvas.getContext("2d");

const tileSize = 50;
const windowWidth = canvas.width;
const windowHeight = canvas.height;
const pieces = new Map();

const imgLaserGrid = new Image();
const toolbar = new Toolbar("toolbar.png", new Tile(1, 8));
const numToPiece = ["forwardSlash", "backSlash", "blackHole", "sideSplit", "upSplit", "blue", "red", "green"];

function init() {
    canvas.addEventListener("mousemove", onMouseMove, false);
    canvas.addEventListener("click", onClick, false);

    pieces.set("forwardSlash", new Mirror("pieces/mirror_forwardslash.png", "east", "north", "west", "south"));
    pieces.set("backSlash", new Mirror("pieces/mirror_backslash.png", "west", "south", "east", "north"));
    pieces.set("blackHole", new Mirror("pieces/mirror_blackhole.png", "none", "none", "none", "none"));
    pieces.set("sideSplit", new Mirror("pieces/mirror_sidesplit.png", "east", "none", "east", "splitns"));
    pieces.set("upSplit", new Mirror("pieces/mirror_upsplit.png", "none", "north", "splitew", "north"));

    pieces.set("blue", new Swatch("pieces/swatch_blue.png", 0, 0, 255));
    pieces.set("red", new Swatch("pieces/swatch_red.png", 255, 0, 0));
    pieces.set("green", new Swatch("pieces/swatch_green.png", 0, 255, 0));


    imgLaserGrid.onload = () => {draw()};
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

function draw() {
    // empty screen
    ctx.clearRect(0, 0, windowWidth, windowHeight);
    ctx.fillStyle = '#bcbcbc';
    ctx.fillRect(0, 0, windowWidth, windowHeight);

    ctx.drawImage(imgLaserGrid, 0, 0);
    toolbar.draw();

    pieces.forEach((piece) => {piece.draw()});
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
    let tile = Tile.TileFromPixels(event.clientX, event.clientY);
    toolbar.processMouseInput(tile);
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


init();