var canvas = document.getElementById('pendulum');
var ctx = canvas.getContext('2d');
var canvasWidth = canvas.getAttribute('width');
var canvasHeight = canvas.getAttribute('height');
var rectWidth = 80;
var rectHeight = 25;


var lineLength = rectWidth / 3;
var linePosX = canvasWidth/2;
var linePosY = rectHeight; 
var alpha = Math.PI * 3 / 8;
var ballRadius = rectWidth / 4;
var g = 9.8; var ampl = 5;

var numLines = 2;
linePosY += lineLength / 2;
linePosY  += lineLength / 2 * Math.cos(alpha); 
while (linePosY < canvasHeight / 3) {
    linePosY  += lineLength * Math.cos(alpha);
    numLines++;
}

var linePosYStart = 0;
var linePosYEnd = 0;
var time = 0;

function drawPendulum(cosAlpha, sinAlpha) {
    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.fillRect(canvasWidth/2 - rectWidth/2, 0, rectWidth, rectHeight);
    ctx.strokeStyle = 'grey';
    linePosX = canvasWidth/2;
    linePosY = rectHeight;

    ctx.moveTo(linePosX, linePosY);
    linePosY += lineLength / 2;
    ctx.lineTo(linePosX, linePosY);
    linePosYStart = linePosY;
    linePosX += lineLength / 2 * sinAlpha;
    linePosY  += lineLength / 2 * cosAlpha; 
    ctx.lineTo(linePosX, linePosY);

    for (let n = 0; n < numLines - 2; n++) {
        linePosY  += lineLength * cosAlpha; 
        if (linePosX <= canvasWidth / 2) 
            linePosX += lineLength * sinAlpha;
        else linePosX -= lineLength * sinAlpha;
        ctx.lineTo(linePosX, linePosY);
    }

    if (linePosX <= canvasWidth / 2) 
        linePosX += lineLength / 2 * sinAlpha;
    else linePosX -= lineLength / 2 * sinAlpha;
    linePosY  += lineLength / 2 * cosAlpha;
    ctx.lineTo(linePosX, linePosY);
    linePosYEnd = linePosY;
    linePosY += lineLength / 2;
    ctx.lineTo(linePosX, linePosY);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(linePosX, linePosY+ballRadius, ballRadius, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'red';
    ctx.fill();
}

function movePendulum(omega, l, dX0) {
    let x = ampl * Math.cos(omega * time);
    let cosAlpha = (l + dX0 + x) / (numLines - 2) / lineLength;
    let sinAlpha = Math.sqrt(1 - Math.pow(cosAlpha, 2));
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    drawPendulum(cosAlpha, sinAlpha);
    time += 0.05;
}

drawPendulum(Math.cos(alpha), Math.sin(alpha));

/* Reading parameters */
var form = document.getElementById('params');
var inputs = Array.from(form.getElementsByTagName('input'));
var timerID = 0;

form.addEventListener('submit', function(event) {
    event.preventDefault();
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    drawPendulum(Math.cos(alpha), Math.sin(alpha));
    if (timerID != 0) clearInterval(timerID);
    let k = inputs[0].value;
    let m = inputs[1].value;
    let dX0 = m * g / k;
    let l = linePosYEnd - linePosYStart;
    let cosAlpha = (l + dX0 + ampl) / (numLines - 2) / lineLength;
    let sinAlpha = Math.sqrt(1 - Math.pow(cosAlpha, 2));
    let omega = Math.sqrt(k / m);
    let T = 2 * Math.PI / omega;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    drawPendulum(cosAlpha, sinAlpha);
    time = 0;
    timerID = setInterval(movePendulum, 50, omega, l, dX0);
});

var stopButton = document.getElementById('stop');
stopButton.addEventListener('click', function() {
    if (timerID != 0) clearInterval(timerID);
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    drawPendulum(Math.cos(alpha), Math.sin(alpha));
});