const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let padding = 50; // The distance to the edge before expanding the canvas

function resizeCanvas() {
    // Initialize the canvas size to window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    [lastX, lastY] = [e.clientX, e.clientY];
    drawBall(e.clientX, e.clientY);
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'black';

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.clientX, e.clientY);
    ctx.stroke();

    [lastX, lastY] = [e.clientX, e.clientY];

    expandCanvasIfNeeded(e.clientX, e.clientY);
});

canvas.addEventListener('mouseup', () => {
    isDrawing = false;
});

canvas.addEventListener('mouseout', () => {
    isDrawing = false;
});

function drawBall(x, y) {
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
}

function expandCanvasIfNeeded(x, y) {
    if (x > canvas.width - padding) {
        canvas.width += padding;
        ctx.translate(-padding, 0); // Adjust the context to keep the drawing in place
    }
    if (y > canvas.height - padding) {
        canvas.height += padding;
        ctx.translate(0, -padding); // Adjust the context to keep the drawing in place
    }
    if (x < padding) {
        canvas.width += padding;
        ctx.translate(padding, 0); // Adjust the context to keep the drawing in place
    }
    if (y < padding) {
        canvas.height += padding;
        ctx.translate(0, padding); // Adjust the context to keep the drawing in place
    }
}

