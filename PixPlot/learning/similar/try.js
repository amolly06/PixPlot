const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const inputBox = document.getElementById('inputBox');
const textInput = document.getElementById('textInput');
const fileInput = document.getElementById('fileInput');
const saveButton = document.getElementById('saveButton');

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

function drawNode(node) {
    const { x, y, text, image } = node;
    ctx.fillStyle = '#007bff';
    ctx.strokeStyle = '#0056b3';
    ctx.lineWidth = 2;
    ctx.fillRect(x - nodeWidth / 2, y - nodeHeight / 2, nodeWidth, nodeHeight);
    ctx.strokeRect(x - nodeWidth / 2, y - nodeHeight / 2, nodeWidth, nodeHeight);
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x, y);
    if (image) {
        const imgX = x - nodeWidth / 2;
        const imgY = y - nodeHeight / 2;
        ctx.drawImage(image, imgX, imgY, nodeWidth, nodeHeight);
    }
}

function drawCurve(nodeFrom, nodeTo) {
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(nodeFrom.x, nodeFrom.y);
    ctx.quadraticCurveTo(nodeFrom.x, (nodeFrom.y + nodeTo.y) / 2, nodeTo.x, nodeTo.y);
    ctx.stroke();
}

function addNode(x, y, text, image) {
    nodes.push({ 
        x,
        y,
        text,
        image,
        connections: [] // Array to store connected nodes
    });
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

canvas.addEventListener('mousedown', (e) => {
    const x = e.clientX;
    const y = e.clientY;
    
    // Check if clicked on any existing node
    selectedNode = nodes.find(node => {
        return x >= node.x - nodeWidth / 2 && x <= node.x + nodeWidth / 2 &&
               y >= node.y - nodeHeight / 2 && y <= node.y + nodeHeight / 2;
    });
    
    if (!selectedNode) {
        // If not clicked on an existing node, create a new node
        addNode(x, y, '', null);
        redrawNodes();
        selectedNode = nodes[nodes.length - 1]; // Select the newly created node
    }
    
    isDrawing = true;
});

canvas.addEventListener('mousemove', (e) => {
    if (isDrawing && selectedNode) {
        redrawNodes();
        
        // Draw a temporary line from selectedNode to current mouse position
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(selectedNode.x, selectedNode.y);
        ctx.quadraticCurveTo(selectedNode.x, (selectedNode.y + e.clientY) / 2, e.clientX, e.clientY);
        ctx.stroke();
    }
});

canvas.addEventListener('mouseup', (e) => {
    if (isDrawing && selectedNode) {
        const clickedNode = nodes.find(node => {
            return e.clientX >= node.x - nodeWidth / 2 && e.clientX <= node.x + nodeWidth / 2 &&
                   e.clientY >= node.y - nodeHeight / 2 && e.clientY <= node.y + nodeHeight / 2;
        });

        if (clickedNode && clickedNode !== selectedNode) {
            // Connect selectedNode to clickedNode
            selectedNode.connections.push(clickedNode);
        }

        redrawNodes();
    }

    isDrawing = false;
});

canvas.addEventListener('mouseout', () => {
    isDrawing = false;
});

saveButton.addEventListener('click', () => {
    const x = parseInt(inputBox.dataset.x);
    const y = parseInt(inputBox.dataset.y);
    const text = textInput.value;
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                addNode(x, y, text, img);
                redrawNodes();
                inputBox.classList.add('hidden');
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    } else {
        addNode(x, y, text, null);
        redrawNodes();
        inputBox.classList.add('hidden');
    }
});


