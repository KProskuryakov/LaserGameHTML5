"use strict";
const canvas = document.getElementById("harvester-canvas");
const ctx = canvas.getContext("2d");

const TILE_FULL = 20;

/**
 * An immutable representation of x/y coordinates or whatever values you want
 */
class Vector {
    /**
     * Create a vector with x/y coords.
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * Adds two vectors together and returns a new one. Increments v1 if v2 is not given.
     * @param {Vector} v1
     * @param {Vector} v2
     * @returns {Vector}
     */
    static add(v1, v2 = new Vector(1, 1)) {
        return new Vector(v1.x + v2.x, v1.y + v2.y);
    }
}

class ResourcePoint {
    /**
     * Create a resource point that generates res at loc.
     * @param {Vector} loc
     * @param {number} res
     */
    constructor(loc, res) {

    }
}

class Gatherer {
    constructor(loc) {
        this.loc = loc;
    }
}

class Grid {
    constructor(loc) {

    }

    static drawGrid() {
        ctx.beginPath();
        for (let x = 0; x <= canvas.width; x += TILE_FULL) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
        }
        for (let y = 0; y <= canvas.height; y += TILE_FULL) {
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
        }
        ctx.stroke();
    }
}

function draw() {

}

function onClick() {

}

function tick() {

}

canvas.addEventListener("click", onClick, false);
draw();