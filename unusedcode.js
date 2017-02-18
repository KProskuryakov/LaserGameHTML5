// window.requestAnimationFrame(() => {update(0, 0, ctx, canvas.width, canvas.height, tileSize)});

// this update function would be useful in the case of a constantly updating frame
// function update (curTime, oldTime, ctx, windowWidth, windowHeight, TILESIZE) {
//     const dt = (curTime - oldTime) / 1000;
//     //console.log(dt);
//     draw(ctx, windowWidth, windowHeight, TILESIZE, dt);
//     window.requestAnimationFrame((newTime) => {update(newTime, curTime, ctx, windowWidth, windowHeight, TILESIZE)});
// }



// // grid setup
// ctx.strokeStyle = "#000";
// for (let i = 0; i <= 5; i++) {
//     traceHorizontalLine(ctx, TILESIZE + TILESIZE * i, TILESIZE, TILESIZE * 6);
//     traceVerticalLine(ctx, TILESIZE + TILESIZE * i, TILESIZE, TILESIZE * 6);
// }
//
// // draw toolbar boxes
// traceHorizontalLine(ctx, windowHeight - TILESIZE * 3, TILESIZE, TILESIZE * 9);
// traceHorizontalLine(ctx, windowHeight - TILESIZE * 2, TILESIZE, TILESIZE * 9);
// for (let i = 0; i <= 8; i++) {
//     traceVerticalLine(ctx, TILESIZE + i * TILESIZE, windowHeight - TILESIZE * 3, windowHeight - TILESIZE * 2);
// }
// ctx.stroke();

// draw edge numbers
// drawEdgeNumbers(ctx, TILESIZE, "24px Ariel", "#000000");

// if ever needed
//drawFPS(ctx, "24px Ariel", "#000000", fps);

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
// function drawEdgeNumbers(ctx, TILESIZE, fontString, textColor) {
//     let halfTile = TILESIZE / 2;
//     ctx.font = fontString;
//     ctx.fillStyle = textColor;
//     ctx.textAlign = "center";
//     for (let edge = 1; edge <= 20; edge++) {
//         let tile = edgeNumberToTile(edge);
//         ctx.fillText(`${edge}`, tile.x * TILESIZE + halfTile, tile.y * TILESIZE + halfTile + 12);
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