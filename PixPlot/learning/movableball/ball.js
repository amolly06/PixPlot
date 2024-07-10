const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let nodes = [];
const padding = 50; // The distance to the edge before expanding the canvas
const nodeRadius = 10;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    redrawNodes();
}

function redrawNodes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    nodes.forEach(node => drawNode(node.x, node.y));
}

function drawNode(x, y) {
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(x, y, nodeRadius, 0, Math.PI * 2);
    ctx.fill();
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    [lastX, lastY] = [e.clientX, e.clientY];
    drawNode(e.clientX, e.clientY);
    nodes.push({ x: e.clientX, y: e.clientY });
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

canvas.addEventListener('mouseup', (e) => {
    if (isDrawing) {
        drawNode(e.clientX, e.clientY);
        nodes.push({ x: e.clientX, y: e.clientY });
    }
    isDrawing = false;
});

canvas.addEventListener('mouseout', () => {
    isDrawing = false;
});

function expandCanvasIfNeeded(x, y) {
    let needsRedraw = false;

    if (x > canvas.width - padding) {
        canvas.width += padding;
        ctx.translate(-padding, 0);
        needsRedraw = true;
    }
    if (y > canvas.height - padding) {
        canvas.height += padding;
        ctx.translate(0, -padding);
        needsRedraw = true;
    }
    if (x < padding) {
        canvas.width += padding;
        ctx.translate(padding, 0);
        needsRedraw = true;
    }
    if (y < padding) {
        canvas.height += padding;
        ctx.translate(0, padding);
        needsRedraw = true;
    }

    if (needsRedraw) {
        redrawNodes();
    }
}

