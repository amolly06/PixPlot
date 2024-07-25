const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let isDrawing = false;
let nodes = [];
let selectedNode = null;
const nodeWidth = 150;
const nodeHeight = 90;
let zoomLevel = 1;
const zoomFactor = 0.1;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawGrid();
    redrawNodes();
}

function drawGrid() {
    const gridSize = 14;
    ctx.strokeStyle = "#FFFDD0";
    ctx.lineWidth = 0.5;

    for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

function redrawNodes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.setTransform(zoomLevel, 0, 0, zoomLevel, 0, 0);
    drawGrid();
    nodes.forEach(node => {
        updateInputBoxPosition(node);
        updateRedDotPosition(node);
        node.connections.forEach(connectedNode => {
            drawCurve(node, connectedNode);
        });
    });
    ctx.restore();
}

function updateInputBoxPosition(node) {
    const inputBox = document.getElementById(node.id);
    if (inputBox) {
        inputBox.style.left = `${(node.x - node.width / 2) * zoomLevel}px`;
        inputBox.style.top = `${(node.y - node.height / 2) * zoomLevel}px`;
        inputBox.style.width = `${node.width * zoomLevel}px`;
        inputBox.style.height = `${node.height * zoomLevel}px`;
        inputBox.style.backgroundColor = node.color;
        inputBox.style.fontFamily = node.fontStyle;
        inputBox.style.fontSize = `${node.fontSize * zoomLevel}px`;
        inputBox.style.color = node.fontColor;
        inputBox.style.opacity = node.opacity;
        inputBox.style.boxShadow = `${node.shadowOffsetX * zoomLevel}px ${node.shadowOffsetY * zoomLevel}px ${node.shadowBlur * zoomLevel}px ${node.shadowColor}`;
        inputBox.style.borderStyle = node.borderStyle;
        inputBox.style.borderColor = node.borderColor;
        inputBox.style.textDecoration = node.textDecoration;
        inputBox.style.borderRadius = `${node.cornerRadius * zoomLevel}px`;
    }
}

function updateRedDotPosition(node) {
    const redDot = document.getElementById(`red-dot-${node.id}`);
    if (redDot) {
        redDot.style.left = `${(node.x - 10) * zoomLevel}px`;
        redDot.style.top = `${(node.y + nodeHeight / 2 - 10) * zoomLevel}px`;
    }
}

function drawCurve(nodeFrom, nodeTo) {
    const lineStyle = document.getElementById('line-style').value;
    if (lineStyle === 'dashed') {
        ctx.setLineDash([10, 10]);
    } else if (lineStyle === 'dotted') {
        ctx.setLineDash([2, 2]);
    } else {
        ctx.setLineDash([]);
    }
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 5;
    ctx.beginPath();
    const fromX = nodeFrom.x + 8;
    const fromY = nodeFrom.y + nodeHeight / 2 - 5;
    ctx.moveTo(fromX, fromY);
    ctx.quadraticCurveTo(fromX, (fromY + nodeTo.y) / 2, nodeTo.x, nodeTo.y);
    ctx.stroke();
}

function addNode(x, y) {
    const id = `node-${nodes.length}`;
    const newNode = {
        id,
        x,
        y,
        color: document.getElementById('box-color').value,
        fontStyle: document.getElementById('font-style').value,
        fontSize: document.getElementById('font-size').value,
        fontColor: document.getElementById('font-color').value,
        width: document.getElementById('node-width').value,
        height: document.getElementById('node-height').value,
        opacity: document.getElementById('opacity').value / 100,
        shadowColor: document.getElementById('shadow-color').value,
        shadowOffsetX: document.getElementById('shadow-offset-x').value,
        shadowOffsetY: document.getElementById('shadow-offset-y').value,
        shadowBlur: document.getElementById('shadow-blur').value,
        borderStyle: document.getElementById('border-style').value,
        borderColor: document.getElementById('border-color').value,
        textDecoration: document.getElementById('text-decoration').value,
        cornerRadius: document.getElementById('corner-radius').value,
        rotation: 0,
        connections: []
    };
    nodes.push(newNode);
    createInputBox(newNode);
    createRedDot(newNode);
    return newNode;
}

function createInputBox(node) {
    const inputBox = document.createElement('div');
    inputBox.className = 'node-input';
    inputBox.id = node.id;

    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.placeholder = 'Enter text';
    textInput.style.width = '100%';

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.className = 'file-input';
    fileInput.accept = 'image/*,video/*';
    fileInput.addEventListener('change', (e) => handleFileUpload(e, node.id));

    const preview = document.createElement('img');
    preview.className = 'preview';

    const changeButton = document.createElement('button');
    changeButton.textContent = '+';
    changeButton.addEventListener('click', () => fileInput.click());

    const deleteButton = document.createElement('button');
    deleteButton.textContent = '-';
    deleteButton.addEventListener('click', () => handleDelete(node.id));

    inputBox.appendChild(textInput);
    inputBox.appendChild(fileInput);
    inputBox.appendChild(preview);
    inputBox.appendChild(changeButton);
    inputBox.appendChild(deleteButton);

    updateInputBoxPosition(node);

    document.body.appendChild(inputBox);
}

function handleFileUpload(event, nodeId) {
    const file = event.target.files[0];
    const inputBox = document.getElementById(nodeId);
    const preview = inputBox.querySelector('.preview');

    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            preview.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

function handleDelete(nodeId) {
    const inputBox = document.getElementById(nodeId);
    const preview = inputBox.querySelector('.preview');
    preview.src = '';
    preview.style.display = 'none';
}

function createRedDot(node) {
    const redDot = document.createElement('div');
    redDot.id = `red-dot-${node.id}`;
    redDot.className = 'red-dot';
    updateRedDotPosition(node);

    redDot.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        selectedNode = node;
        isDrawing = true;
    });
    document.body.appendChild(redDot);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

canvas.addEventListener('mousedown', (e) => {
    const x = e.clientX;
    const y = e.clientY;

    if (nodes.length === 0) {
        addNode(x, y);
        redrawNodes();
    }
});

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isDrawing && selectedNode) {
        redrawNodes();
        ctx.save();
        ctx.setTransform(zoomLevel, 0, 0, zoomLevel, 0, 0);
        ctx.strokeStyle = '#7d7cbd';
        ctx.lineWidth = 5;
        ctx.beginPath();
        const fromX = selectedNode.x + 8;
        const fromY = selectedNode.y + nodeHeight / 2 - 5;
        ctx.moveTo(fromX, fromY);
        ctx.quadraticCurveTo(fromX, (fromY + y) / 2, x, y);
        ctx.stroke();
        ctx.restore();
    }
});

function zoomIn() {
    zoomLevel = Math.min(zoomLevel + zoomFactor, 5);
    redrawNodes();
}

function zoomOut() {
    zoomLevel = Math.max(zoomLevel - zoomFactor, 0.1);
    redrawNodes();
}

document.getElementById('zoom-in').addEventListener('click', zoomIn);
document.getElementById('zoom-out').addEventListener('click', zoomOut);

window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && (e.key === '=' || e.key === '+')) {
        e.preventDefault();
        zoomIn();
    }
    if (e.ctrlKey && (e.key === '-' || e.key === '_')) {
        e.preventDefault();
        zoomOut();
    }
});

canvas.addEventListener('mouseup', (e) => {
    if (isDrawing && selectedNode) {
        const rect = canvas.getBoundingClientRect();
        const newX = e.clientX - rect.left;
        const newY = e.clientY - rect.top;
        const newNode = addNode(newX, newY);
        selectedNode.connections.push(newNode);
        selectedNode = null;
        redrawNodes();
    }

    isDrawing = false;
});

document.getElementById('box-color').addEventListener('input', (e) => {
    if (selectedNode) {
        selectedNode.color = e.target.value;
        redrawNodes();
    }
});
document.getElementById('font-style').addEventListener('change', (e) => {
    if (selectedNode) {
        selectedNode.fontStyle = e.target.value;
        redrawNodes();
    }
});
document.getElementById('font-size').addEventListener('input', (e) => {
    if (selectedNode) {
        selectedNode.fontSize = e.target.value;
        redrawNodes();
    }
});

document.getElementById('font-color').addEventListener('input', (e) => {
    if (selectedNode) {
        selectedNode.fontColor = e.target.value;
        redrawNodes();
    }
});
document.getElementById('node-width').addEventListener('input', (e) => {
    if (selectedNode) {
        selectedNode.width = e.target.value;
        redrawNodes();
    }
});

document.getElementById('node-height').addEventListener('input', (e) => {
    if (selectedNode) {
        selectedNode.height = e.target.value;
        redrawNodes();
    }
});

document.getElementById('opacity').addEventListener('input', (e) => {
    if (selectedNode) {
        selectedNode.opacity = e.target.value / 100;
        redrawNodes();
    }
});
document.getElementById('border-style').addEventListener('change', (e) => {
    if (selectedNode) {
        selectedNode.borderStyle = e.target.value;
        redrawNodes();
    }
});
document.getElementById('border-color').addEventListener('input', (e) => {
    if (selectedNode) {
        selectedNode.borderColor = e.target.value;
        redrawNodes();
    }
});

document.getElementById('text-decoration').addEventListener('change', (e) => {
    if (selectedNode) {
        selectedNode.textDecoration = e.target.value;
        redrawNodes();
    }
});

document.getElementById('corner-radius').addEventListener('input', (e) => {
    if (selectedNode) {
        selectedNode.cornerRadius = e.target.value;
        redrawNodes();
    }
});
document.getElementById('shadow-color').addEventListener('input', (e) => {
    if (selectedNode) {
        selectedNode.shadowColor = e.target.value;
        redrawNodes();
    }
});

document.getElementById('shadow-offset-x').addEventListener('input', (e) => {
    if (selectedNode) {
        selectedNode.shadowOffsetX = e.target.value;
        redrawNodes();
    }
});

document.getElementById('shadow-offset-y').addEventListener('input', (e) => {
    if (selectedNode) {
        selectedNode.shadowOffsetY = e.target.value;
        redrawNodes();
    }
});

document.getElementById('shadow-blur').addEventListener('input', (e) => {
    if (selectedNode) {
        selectedNode.shadowBlur = e.target.value;
        redrawNodes();
    }
});

function saveCanvas() {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');

    tempCtx.fillStyle = '#ffffff'; 
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    tempCtx.drawImage(canvas, 0, 0);

    const link = document.createElement('a');
    link.download = 'canvas-image.png';
    link.href = tempCanvas.toDataURL('image/png');
    link.click();
}

function createSaveButton() {
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save Canvas';
    saveButton.className = 'save-button';
    saveButton.addEventListener('click', saveCanvas);
    
    document.body.appendChild(saveButton);
}

createSaveButton();
