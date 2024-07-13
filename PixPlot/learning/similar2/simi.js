const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let isDrawing = false;
let nodes = [];
let selectedNode = null;
const nodeWidth = 120;
const nodeHeight = 60;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    redrawNodes();
}

function redrawNodes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    nodes.forEach(node => {
        drawNode(node);
        node.connections.forEach(connectedNode => {
            drawCurve(node, connectedNode);
        });
    });
}

function drawRedDot(node) {
    const centerX = node.x;
    const centerY = node.y + nodeHeight / 2;
    const radius = 10;
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
}

function drawNode(node) {
    const { x, y } = node;
    ctx.fillStyle = '#007bff';
    ctx.strokeStyle = '#0056b3';
    ctx.lineWidth = 2;
    ctx.fillRect(x - nodeWidth / 2, y - nodeHeight / 2, nodeWidth, nodeHeight);
    ctx.strokeRect(x - nodeWidth / 2, y - nodeHeight / 2, nodeWidth, nodeHeight);
    drawRedDot(node);
}

function drawCurve(nodeFrom, nodeTo) {
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 5;
    ctx.beginPath();
    const fromX = nodeFrom.x;
    const fromY = nodeFrom.y + nodeHeight / 2;  
    ctx.moveTo(fromX, fromY);
    ctx.quadraticCurveTo(fromX, (fromY + nodeTo.y) / 2, nodeTo.x, nodeTo.y);
    ctx.stroke();
}

function addNode(x, y) {
    const newNode = {
        x,
        y,
        connections: []
    };
    nodes.push(newNode);
    return newNode;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

canvas.addEventListener('mousedown', (e) => {
    const x = e.clientX;
    const y = e.clientY;

    if (nodes.length === 0) {
        addNode(x, y);
        redrawNodes();
    } else {
        selectedNode = nodes.find(node => {
            const centerX = node.x;
            const centerY = node.y + nodeHeight / 2;
            const radius = 10;
            const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
            return distance <= radius;
        });

        if (selectedNode) {
            isDrawing = true;
        }
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (isDrawing && selectedNode) {
        redrawNodes();

        ctx.strokeStyle = '#333';
        ctx.lineWidth = 5;
        ctx.beginPath();
        const fromX = selectedNode.x;
        const fromY = selectedNode.y + nodeHeight / 2;  
        ctx.moveTo(fromX, fromY);
        ctx.quadraticCurveTo(fromX, (fromY + e.clientY) / 2, e.clientX, e.clientY);
        ctx.stroke();
    }
});

canvas.addEventListener('mouseup', (e) => {
    if (isDrawing && selectedNode) {
        const newX = e.clientX;
        const newY = e.clientY;
        const newNode = addNode(newX, newY);
        selectedNode.connections.push(newNode);

        redrawNodes();
    }

    isDrawing = false;
});

