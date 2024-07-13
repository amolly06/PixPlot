const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const borderColorPicker = document.getElementById('borderColorPicker');
const borderWidthPicker = document.getElementById('borderWidthPicker');
const widthPicker = document.getElementById('widthPicker');
const heightPicker = document.getElementById('heightPicker');
const shapePicker = document.getElementById('shapePicker');
const textPicker = document.getElementById('textPicker');
const opacityPicker = document.getElementById('opacityPicker');
const strokeColorPicker = document.getElementById('strokeColorPicker');
const strokeWidthPicker = document.getElementById('strokeWidthPicker');
const fontColorPicker = document.getElementById('fontColorPicker');
const fontSizePicker = document.getElementById('fontSizePicker');
const fontStylePicker = document.getElementById('fontStylePicker');

let isDrawing = false;
let nodes = [];
let selectedNode = null;
let hoveredNode = null;

const defaultNode = {
    width: parseInt(widthPicker.value, 10),
    height: parseInt(heightPicker.value, 10),
    color: colorPicker.value,
    borderColor: borderColorPicker.value,
    borderWidth: parseInt(borderWidthPicker.value, 10),
    shape: shapePicker.value,
    text: textPicker.value,
    opacity: parseFloat(opacityPicker.value),
    fontColor: fontColorPicker.value,
    fontSize: parseInt(fontSizePicker.value, 10),
    fontStyle: fontStylePicker.value
};

const defaultStroke = {
    color: strokeColorPicker.value,
    width: parseInt(strokeWidthPicker.value, 10)
};

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
    const centerX = node.x; // Center of the node
    const centerY = node.y; // Center Y of the node
    const radius = 10; // Radius of the red dot
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
}


function drawNode(node) {
    const { x, y, color, width, height, borderColor, borderWidth, shape, text, opacity, fontColor, fontSize, fontStyle } = node;
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.fillStyle = color;
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = borderWidth;
    ctx.lineCap = 'round'; // Smooth line endings

    switch (shape) {
        case 'rectangle':
            ctx.fillRect(x - width / 2, y - height / 2, width, height);
            ctx.strokeRect(x - width / 2, y - height / 2, width, height);
            break;
        case 'square':
            const size = Math.min(width, height);
            ctx.fillRect(x - size / 2, y - size / 2, size, size);
            ctx.strokeRect(x - size / 2, y - size / 2, size, size);
            break;
        case 'circle':
            ctx.beginPath();
            ctx.arc(x, y, width / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            break;
        case 'diamond':
            ctx.beginPath();
            ctx.moveTo(x, y - height / 2);
            ctx.lineTo(x + width / 2, y);
            ctx.lineTo(x, y + height / 2);
            ctx.lineTo(x - width / 2, y);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            break;
        case 'rhombus':
            ctx.beginPath();
            ctx.moveTo(x - width / 2, y);
            ctx.lineTo(x, y - height / 2);
            ctx.lineTo(x + width / 2, y);
            ctx.lineTo(x, y + height / 2);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            break;
        default:
            break;
    }

    if (node === hoveredNode || node === selectedNode) {
        drawRedDot(node);
    }

    ctx.globalAlpha = 1;
    ctx.fillStyle = fontColor;
    ctx.font = `${fontStyle} ${fontSize}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x, y);
    ctx.restore();
}

function drawCurve(nodeFrom, nodeTo) {
    ctx.strokeStyle = nodeFrom.strokeColor || defaultStroke.color;
    ctx.lineWidth = nodeFrom.strokeWidth || defaultStroke.width;
    ctx.lineCap = 'round'; // Smooth line endings
    ctx.beginPath();
    ctx.moveTo(nodeFrom.x, nodeFrom.y + nodeFrom.height / 2);
    ctx.quadraticCurveTo(nodeFrom.x, (nodeFrom.y + nodeTo.y) / 2, nodeTo.x, nodeTo.y);
    ctx.stroke();
}

function drawTemporaryCurve(nodeFrom, x, y) {
    ctx.strokeStyle = nodeFrom.strokeColor || defaultStroke.color;
    ctx.lineWidth = nodeFrom.strokeWidth || defaultStroke.width;
    ctx.lineCap = 'round'; // Smooth line endings
    ctx.beginPath();
    ctx.moveTo(nodeFrom.x, nodeFrom.y + nodeFrom.height / 2);
    ctx.quadraticCurveTo(nodeFrom.x, (nodeFrom.y + y) / 2, x, y);
    ctx.stroke();
}

function addNode(x, y) {
    const newNode = {
        x,
        y,
        ...defaultNode,
        strokeColor: defaultStroke.color,
        strokeWidth: defaultStroke.width,
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

    const clickedNode = nodes.find(node => {
        const centerX = node.x;
        const centerY = node.y + node.height / 2;
        const radius = 10;
        const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
        return distance <= radius; // Check if clicked on red dot
    });

    if (clickedNode) {
        selectedNode = clickedNode;
        isDrawing = true; // Start drawing mode
        redrawNodes(); // Redraw to reflect the selection
    } else if (nodes.length === 0) {
        selectedNode = addNode(x, y);
        redrawNodes();
    }
});


canvas.addEventListener('mouseup', (e) => {
    if (isDrawing && selectedNode) {
        const newX = e.clientX;
        const newY = e.clientY;
        const newNode = addNode(newX, newY);
        selectedNode.connections.push(newNode); // Connect to the newly added node
        selectedNode = newNode;
        redrawNodes();
    }
    isDrawing = false;
});

canvas.addEventListener('mousemove', (e) => {
    const x = e.clientX;
    const y = e.clientY;

    hoveredNode = nodes.find(node => {
        const lowerCenterY = node.y + node.height / 2; // Middle of the lower line
        return x >= node.x - node.width / 2 && x <= node.x + node.width / 2 &&
               y === lowerCenterY; // Check if y matches the lower center line
    }) || null;

    redrawNodes();

    if (isDrawing && selectedNode) {
        drawTemporaryCurve(selectedNode, x, y);
    }
});

canvas.addEventListener('mouseout', () => {
    isDrawing = false;
});

colorPicker.addEventListener('input', (e) => {
    defaultNode.color = e.target.value;
});

borderColorPicker.addEventListener('input', (e) => {
    defaultNode.borderColor = e.target.value;
});

borderWidthPicker.addEventListener('input', (e) => {
    defaultNode.borderWidth = parseInt(e.target.value, 10);
});

widthPicker.addEventListener('input', (e) => {
    defaultNode.width = parseInt(e.target.value, 10);
});

heightPicker.addEventListener('input', (e) => {
    defaultNode.height = parseInt(e.target.value, 10);
});

shapePicker.addEventListener('input', (e) => {
    defaultNode.shape = e.target.value;
});

textPicker.addEventListener('input', (e) => {
    defaultNode.text = e.target.value;
});

opacityPicker.addEventListener('input', (e) => {
    defaultNode.opacity = parseFloat(e.target.value);
});

strokeColorPicker.addEventListener('input', (e) => {
    defaultStroke.color = e.target.value;
});

strokeWidthPicker.addEventListener('input', (e) => {
    defaultStroke.width = parseInt(e.target.value, 10);
});

fontColorPicker.addEventListener('input', (e) => {
    defaultNode.fontColor = e.target.value;
});

fontSizePicker.addEventListener('input', (e) => {
    defaultNode.fontSize = parseInt(e.target.value, 10);
});

fontStylePicker.addEventListener('input', (e) => {
    defaultNode.fontStyle = e.target.value;
});

