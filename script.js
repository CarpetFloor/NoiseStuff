let octaves = 10;
let variance = octaves * 10;
let tileSize = 7;
let animation = false;

let c = document.getElementById("canvas");
let r = c.getContext("2d");

let w = window.innerWidth - 20;
let h = window.innerHeight - 20;
c.width = w;
c.height = h;

let tileCount = (w * h) / Math.pow(tileSize, 2);

let startingShade = 255;
let shade = -1;

function random(min, max) {
    return (Math.round(Math.random() * (max - min)) + min);
}

function clamp(value, min, max) {
    if(value < min) {
        return min;
    }
    else if(value > max) {
        return max;
    }
    else {
        return value;
    }
}

function getColor(shade_) {
    let rOffset = 30;
    let bOffset = 50;
    return ("rgb(" + (shade_ + rOffset) + "," + shade_ + "," + (shade_ + bOffset) + ")");
}


let x = 0;
let y = 0;
let rows = 0;
// start at -1 so that the final value can be used for comparison rather than cols - 1, like with rows
let cols = -1;

let tiles = [];

// initial state
for(let i = 0; i < tileCount; i++) {
    shade = random(0, 255);
    r.fillStyle = getColor(shade);

    r.fillRect(x, y, tileSize, tileSize);

    tiles.push(shade);
    
    x += tileSize;
    if(y == 0) {
        ++cols;
    }

    if(x >= w) {
        x = 0;
        y += tileSize;

        ++rows;
    }
}

x = 0;
y = 0;
let currentRow = 0;
let currentCol = 0;

function removeElement(array, elem) {
    for(let i = 0; i < array.length; i++) {
        if(array[i] == elem) {
            array.splice(i, 1);
        }
    }
}

let interval;
let done = false;
window.setTimeout(function() {
    if(animation) {
        interval = window.setInterval(smooth, 0);
    }
    else {
        while(!(done)) {
            smooth();
        }
    }

}, 
0);

let i = 0;
let currentOctave = 0;

function smooth() {
    let neighbors = ["left", "right", "up", "down", "upleft", "upright", "downleft", "downright"];
    
    // at top
    if(currentRow == 0) {
        removeElement(neighbors, "upleft");
        removeElement(neighbors, "up");
        removeElement(neighbors, "upright");
    }
    // at bottom
    else if(currentRow == rows) {
        removeElement(neighbors, "downleft");
        removeElement(neighbors, "down");
        removeElement(neighbors, "downright");
    }
    
    // at left
    if(currentCol == 0) {
        removeElement(neighbors, "upleft");
        removeElement(neighbors, "left");
        removeElement(neighbors, "downleft");
    }
    // at right
    else if(currentCol == cols) {
        removeElement(neighbors, "upright");
        removeElement(neighbors, "right");
        removeElement(neighbors, "downright");
    }
    
    let shadeTotal = 0;
    
    for(let j = 0; j < neighbors.length; j++) {
        switch(neighbors[j]) {
            case "left":
                shadeTotal += tiles[i - 1];
    
                break;
            case "right":
                shadeTotal += tiles[i + 1];
    
                break;
            case "up":
                shadeTotal += tiles[i - cols];
    
                break;
            case "down":
                shadeTotal += tiles[i + cols];
    
                break;
            
            case "upleft":
                shadeTotal += tiles[i - cols];
                shadeTotal += tiles[i - 1];
    
                break;
            case "upright":
                shadeTotal += tiles[i - cols];
                shadeTotal += tiles[i + 1];
    
                break;
            case "downleft":
                shadeTotal += tiles[i + cols];
                shadeTotal += tiles[i - 1];
    
                break;
            case "downright":
                shadeTotal += tiles[i + cols];
                shadeTotal += tiles[i + 1];
    
                break;
        }
    }
    
    shadeTotal /= neighbors.length;
    
    let value = shadeTotal + random(0 - variance, variance);
    let newShade = clamp(value, 0, 255);
    r.fillStyle = getColor(newShade);
    
    if(isNaN(shadeTotal)) {
        r.fillStyle = "white";
    }
    
    r.fillRect(x, y, tileSize, tileSize);
    
    x += tileSize;
    ++currentCol;
    
    if(x >= w) {
        x = 0;
        currentCol = 0;
        y += tileSize;
    
        ++currentRow;
    }

    ++i;
    if(i >= tiles.length) {
        ++currentOctave;

        if(currentOctave == octaves) {
            if(animation) {
                window.clearInterval(interval);
            }
            else {
                done = true;
            }
        }
        else {
            i = 0;
            x = 0;
            y = 0;

            variance -= 10;
        }
    }
}