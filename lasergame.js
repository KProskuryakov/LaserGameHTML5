"use strict";
const DIRECTION_NORTH = Symbol('North');
const DIRECTION_SOUTH = Symbol('South');
const DIRECTION_EAST = Symbol('East');
const DIRECTION_WEST = Symbol('West');
const DIRECTION_NONE = Symbol('None');
const DIRECTION_SPLIT_EAST_WEST = Symbol('Split East-West');
const DIRECTION_SPLIT_NORTH_SOUTH = Symbol('Split North-South');

const PIECE_FORWARDSLASH = Symbol('forwardSlash');
const PIECE_BACKSLASH = Symbol('forwardSlash');
const PIECE_BLACKHOLE = Symbol('forwardSlash');
const PIECE_SIDESPLIT = Symbol('forwardSlash');
const PIECE_UPSPLIT = Symbol('forwardSlash');
const PIECE_BLUE = Symbol('forwardSlash');
const PIECE_RED = Symbol('forwardSlash');
const PIECE_GREEN = Symbol('forwardSlash');

class Piece {
    /**
     * Constructs a single piece with the given image src
     * @param {string} src
     */
    constructor (src) {
        this.tile = new Tile(-1, -1);
        this.img = new Image(); this.img.src = src;
    }

    /**
     * Draws the piece's img at a given tile location
     * @param {Tile} tile
     */
    drawAt(tile) {
        let pos = tile.toPixels();
        ctx.drawImage(this.img, pos.x, pos.y);
    }
}

/**
 * @extends Piece
 */
class Mirror extends Piece {
    /**
     * Creates a mirror out of this stuff
     * @param {string} src
     * @param {Symbol} north
     * @param {Symbol} east
     * @param {Symbol} south
     * @param {Symbol} west
     */
    constructor (src, north, east, south, west) {
        super(src);
        this[DIRECTION_NORTH] = north; this[DIRECTION_SOUTH] = south; this[DIRECTION_EAST] = east; this[DIRECTION_WEST] = west;
    }
    // TODO: figure out whether I need to process the laser here or not
    processLaser(laser) {
        return new Laser(this.tile, this[laser.dir], laser.r, laser.g, laser.b);
    }
}

/**
 * @extends Piece
 */
class Swatch extends Piece {
    /**
     *
     * @param {string} src
     * @param {number} r
     * @param {number} g
     * @param {number} b
     */
    constructor (src, r, g, b) {
        super(src);
        this.r = r; this.g = g; this.b = b;
    }
}

class Laser {
    /**
     * Constructs a Laser
     * @param {Tile} tile
     * @param {string} dir
     * @param {number} r
     * @param {number} g
     * @param {number} b
     */
    constructor (tile, dir, r = 0, g = 0, b = 0) {
        this.tile = tile; this.dir = dir;
        this.r = r; this.g = g; this.b = b;
    }
    // TODO: Finish the laser class I guess
    draw () {

    }
}

/**
 * A class that represents a tile, holds tileX and tileY
 */
class Tile {
    /**
     *  Constructs a tile based on pixel location and the global TILESIZE
     * @param {number} x
     * @param {number} y
     * @returns {Tile}
     */
    static TileFromPixels(x, y) {
        return new Tile(Math.floor(x / TILESIZE), Math.floor(y / TILESIZE));
    }

    /**
     *  Constructs a tile based on tile x and y values
     * @param {number} tileX
     * @param {number} tileY
     */
    constructor(tileX = -1, tileY = -1) {
        this.tileX = tileX; this.tileY = tileY;
    }

    /**
     *
     * @param {number} maxX
     * @param {number} maxY
     * @returns {boolean}
     */
    isValid(maxX = Infinity, maxY = Infinity) {
        return (this.tileX > -1 && this.tileY > -1 && this.tileX < maxX && this.tileY < maxY);
    }

    /**
     *
     * @returns {{x: number, y: number}}
     */
    toPixels() {
        return {x: this.tileX * TILESIZE, y: this.tileY * TILESIZE};
    }

    /**
     * Compares this tile to another using the given comparator
     * @param {Tile} tile
     * @param {Tile~comparator} comparator
     * @returns {boolean}
     */
    compare(tile, comparator) {
        return (comparator(this.tileX, tile.tileX) && comparator(this.tileY, tile.tileY));
    }

    /**
     * Subtracts a tile from this one, returns a new tile
     * @param {Tile} tile
     * @returns {Tile}
     */
    minus(tile) {
        return new Tile(this.tileX - tile.tileX, this.tileY - tile.tileY);
    }

    /**
     * Adds a tile to this one, returns a new tile.
     * @param {Tile} tile
     * @returns {Tile}
     */
    add(tile) {
        return new Tile(this.tileX + tile.tileX, this.tileY + tile.tileY);
    }

    /**
     * @returns {Tile}
     */
    copy() {
        return new Tile(this.tileX, this.tileY);
    }

    /**
     * returns the next tile in a given direction
     * @param {Symbol} dir
     */
    nextTile(dir) {
        return this.add(directionMapping[dir]);
    }
}

/**
 * @callback Tile~comparator
 * @param {number} v1
 * @param {number} v2
 * @returns {boolean}
 */

/**
 * An abstract class representing a smaller section of the canvas
 */
class CanvasComponent {
    /**
     *
     * @param {string} src
     * @param {Tile} tile
     * @param {number} widthInTiles
     * @param {number} heightInTiles
     * @param {number} [offsetX = 0] pixel offset for the image
     * @param {number} [offsetY = 0] pixel offset for the image
     */
    constructor(src, tile, widthInTiles, heightInTiles, offsetX = 0, offsetY = 0) {
        this.img = new Image(); this.img.onload = () => {draw()}; this.img.src = src;
        this.tile = tile; this.widthInTiles = widthInTiles; this.heightInTiles = heightInTiles;
        this.offsetX = offsetX; this.offsetY = offsetY;
    }

    /**
     * Draws the components image at the location
     */
    draw() {
        let loc = this.tile.toPixels();
        ctx.drawImage(this.img, loc.x + this.offsetX, loc.y + this.offsetY);
    }

    /**
     * Figures out whether a button press happened inside the component and returns it. If it didn't, returns null.
     * @param {number} x a pixel x value
     * @param {number} y a pixel y value
     * @returns {?Tile} returns null if the button press was outside the component
     */
    processMouseClick(x, y) {
        let relativeTile = Tile.TileFromPixels(x, y).minus(this.tile);
        if (relativeTile.isValid(this.widthInTiles, this.heightInTiles)) {
            return relativeTile;
        }
        return null;
    }
}

/**
 * The toolbar to select the pieces to put in the grid
 */
class Toolbar extends CanvasComponent {
    /**
     *
     * @param {string} src
     * @param {Tile} tile
     * @param {number} widthInTiles
     * @param {number} heightInTiles
     * @param {number} [offsetX = 0] pixel offset for the image
     * @param {number} [offsetY = 0] pixel offset for the image
     */
    constructor(src, tile, widthInTiles, heightInTiles, offsetX = 0, offsetY = 0) {
        super(src, tile, widthInTiles, heightInTiles, offsetX, offsetY);
        this.selectedPiece = 0;
    }

    /**
     * draws the image, the pieces and the highlight
     */
    draw() {
        super.draw();

        // draw pieces in each box
        for (let i = 0; i < numToPiece.length; i++) {
            pieces.get(numToPiece[i]).drawAt(this.tile.add(new Tile(i, 0)));
        }

        // draw the green highlight
        ctx.fillStyle = "green";
        ctx .globalAlpha = 0.2;
        let loc = new Tile(this.tile.add(new Tile(this.selectedPiece, 0)).tileX, this.tile.tileY).toPixels();
        ctx.fillRect(loc.x, loc.y, TILESIZE, TILESIZE);
        ctx.globalAlpha = 1;
    }

    /**
     * Selects a piece if clicked on.
     * @param {number} x a pixel x value
     * @param {number} y a pixel y value
     */
    processMouseClick(x, y) {
        let relativeTile = super.processMouseClick(x, y);
        if (relativeTile != null) {
            this.selectedPiece = relativeTile.tileX;
        }
    }

    /**
     * Fetches the selected piece object.
     * @returns {Piece}
     */
    getSelectedPiece() {
        return pieces.get(numToPiece[this.selectedPiece]);
    }
}

/**
 * The laser grid in the top left
 */
class LaserGrid extends CanvasComponent {
    /**
     *
     * @param {string} src
     * @param {Tile} tile
     * @param {number} widthInTiles
     * @param {number} heightInTiles
     * @param {number} [offsetX = 0] pixel offset for the image
     * @param {number} [offsetY = 0] pixel offset for the image
     */
    constructor(src, tile, widthInTiles, heightInTiles, offsetX = 0, offsetY = 0) {
        super(src, tile, widthInTiles, heightInTiles, offsetX, offsetY);

        this.grid = [];
        for (let i = 0; i < 5; i++) {
            this.grid[i] = [];
            for (let j = 0; j < 5; j++) {
                this.grid[i][j] = null;
            }
        }

        this.paths = [];
    }

    /**
     * Draws the image and the pieces on the grid
     */
    draw() {
        super.draw();

        for (let i = 0; i < numToPiece.length; i++) {
            let piece = pieces.get(numToPiece[i]);
            if (piece.tile.isValid()) {
                piece.drawAt(this.tile.add(piece.tile).add(new Tile(1, 1)));
            }
        }
    }

    /**
     * Process mouse clicks on the grid
     * @param {number} x
     * @param {number} y
     */
    processMouseClick(x, y) {
        let relativeTile = super.processMouseClick(x, y);
        if (relativeTile != null) {
            if (relativeTile.compare(new Tile(1, 1), (v1, v2) => v1 >= v2) && relativeTile.compare(new Tile(5, 5), (v1, v2) => v1 <= v2)) {
                let loc = relativeTile.minus(new Tile(1, 1));
                let piece = this.grid[loc.tileY][loc.tileX];
                if (piece != null) {
                    this.removePiece(piece);
                } else {
                    this.addPiece(toolbar.getSelectedPiece(), loc);
                }
            }
        }
    }

    /**
     * Removes a piece from the grid and resets the pieces tile
     * @param {Piece} piece
     */
    removePiece(piece) {
        if (piece.tile.isValid()) {
            this.grid[piece.tile.tileY][piece.tile.tileX] = null;
            piece.tile = new Tile(-1, -1);
        }
    }

    /**
     * Adds the piece to the grid, and removes it from anywhere else it was on the grid.
     * @param piece the selected piece
     * @param {Tile} tile the tile on the grid to put the piece in
     */
    addPiece(piece, tile) {
        this.removePiece(piece);
        this.grid[tile.tileY][tile.tileX] = piece;
        piece.tile = tile;
    }

    /**
     * Populates the paths array with a bunch of paths
     */
    calculateAllPaths() {
        this.paths = [];
        for (let edge = 1; edge <= 20; edge++) {
            this.calculatePath(edge, LaserGrid.edgeNumberToLaser(edge));
        }
    }

    /**
     *
     * @param {number} edge
     * @param {Laser} laser
     */
    calculatePath(edge, laser) {
        for (let i = 0; i < 100; i++) {

        }
    }

    /**
     * Returns a laser with the given properties based on the edge it originated from
     * @param {number} edge
     * @returns {Laser}
     */
    static edgeNumberToLaser(edge) {
        if (edge < 6) {
            return new Laser(new Tile(edge, 0), "south");
        } else if (edge < 11) {
            return new Laser(new Tile(6, edge - 5), "west");
        } else if (edge < 16) {
            return new Laser(new Tile(-edge + 16, 6), "north");
        } else if (edge < 21) {
            return new Laser(new Tile(0, -edge + 21), "east");
        }
    }
}


const canvas = document.getElementById("laser-game-canvas");
const ctx = canvas.getContext("2d");

const TILESIZE = 50;

const toolbar = new Toolbar("toolbar.png", new Tile(1, 8), 8, 1);
const lasergrid = new LaserGrid("lasergrid.png", new Tile(0, 0), 7, 7);

/**
 * @type {Map.<Symbol, Piece>}
 */
const pieces = new Map();
/**
 * @type {string[]}
 */
const numToPiece = [PIECE_FORWARDSLASH, PIECE_BACKSLASH, PIECE_BLACKHOLE, PIECE_SIDESPLIT, PIECE_UPSPLIT, PIECE_BLUE, PIECE_RED, PIECE_GREEN];
/**
 * @type {Object.<Symbol, Tile>}
 */
const directionMapping = {[DIRECTION_NORTH]: new Tile(0, -1), [DIRECTION_SOUTH]: new Tile(0, 1), [DIRECTION_EAST]: new Tile(1, 0), [DIRECTION_WEST]: new Tile(-1, 0)};


/**
 * Inits the things that aren't constants
 */
function init() {
    canvas.addEventListener("mousemove", onMouseMove, false);
    canvas.addEventListener("click", onClick, false);

    pieces.set(PIECE_FORWARDSLASH, new Mirror("pieces/mirror_forwardslash.png", DIRECTION_EAST, DIRECTION_NORTH, DIRECTION_WEST, DIRECTION_SOUTH));
    pieces.set(PIECE_BACKSLASH, new Mirror("pieces/mirror_backslash.png", DIRECTION_WEST, DIRECTION_SOUTH, DIRECTION_EAST, DIRECTION_NORTH));
    pieces.set(PIECE_BLACKHOLE, new Mirror("pieces/mirror_blackhole.png", DIRECTION_NONE, DIRECTION_NONE, DIRECTION_NONE, DIRECTION_NONE));
    pieces.set(PIECE_SIDESPLIT, new Mirror("pieces/mirror_sidesplit.png", DIRECTION_EAST, DIRECTION_NONE, DIRECTION_EAST, DIRECTION_SPLIT_NORTH_SOUTH));
    pieces.set(PIECE_UPSPLIT, new Mirror("pieces/mirror_upsplit.png", DIRECTION_NONE, DIRECTION_NORTH, DIRECTION_SPLIT_EAST_WEST, DIRECTION_NORTH));

    pieces.set(PIECE_BLUE, new Swatch("pieces/swatch_blue.png", 0, 0, 255));
    pieces.set(PIECE_RED, new Swatch("pieces/swatch_red.png", 255, 0, 0));
    pieces.set(PIECE_GREEN, new Swatch("pieces/swatch_green.png", 0, 255, 0));
}

/**
 * Draws all the things
 */
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#bcbcbc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    lasergrid.draw();
    toolbar.draw();
}

function onMouseMove(event) {
    //console.log("Moved here: x" + event.clientX + ", y: " + event.clientY);
}

function onClick(event) {
    //console.log("Clicked here: x" + event.clientX + ", y: " + event.clientY);
    let loc = windowToCanvas(event.clientX, event.clientY);
    lasergrid.processMouseClick(loc.x, loc.y);
    toolbar.processMouseClick(loc.x, loc.y);
    draw();
}

/**
 * Converts the x, y pixel coordinates from window position to relative canvas position
 * @param {number} x clientX
 * @param {number} y clientY
 * @returns {{x: number, y: number}} a relative location to the canvas
 */
function windowToCanvas(x, y) {
    let bbox = canvas.getBoundingClientRect();

    return { x: x - bbox.left * (canvas.width  / bbox.width),
        y: y - bbox.top  * (canvas.height / bbox.height)
    };
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