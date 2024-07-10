document.addEventListener('DOMContentLoaded', () => {
    const graphContainer = document.getElementById('graph-container');

    graphContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-node-btn')) {
            const direction = event.target.getAttribute('data-direction');
            const parentNode = event.target.parentElement;
            addNode(parentNode, direction);
        }
    });

    function addNode(parentNode, direction) {
        const newNode = createNode();
        graphContainer.appendChild(newNode);
        positionNode(newNode, parentNode, direction);
    }

    function createNode() {
        const node = document.createElement('div');
        node.classList.add('node');
        node.innerHTML = `
            <input type="text" placeholder="Enter text">
            <button class="add-node-btn" data-direction="up">↑</button>
            <button class="add-node-btn" data-direction="down">↓</button>
            <button class="add-node-btn" data-direction="left">←</button>
            <button class="add-node-btn" data-direction="right">→</button>
        `;
        return node;
    }

    function positionNode(node, parentNode, direction) {
        const offset = 180; // Distance between nodes
        const parentRect = parentNode.getBoundingClientRect();
        const parentX = parentRect.left + window.scrollX;
        const parentY = parentRect.top + window.scrollY;

        switch (direction) {
            case 'up':
                node.style.left = `${parentX + parentRect.width / 2}px`;
                node.style.top = `${parentY - offset}px`;
                break;
            case 'down':
                node.style.left = `${parentX + parentRect.width / 2}px`;
                node.style.top = `${parentY + parentRect.height + offset}px`;
                break;
            case 'left':
                node.style.left = `${parentX - offset}px`;
                node.style.top = `${parentY + parentRect.height / 2}px`;
                break;
            case 'right':
                node.style.left = `${parentX + parentRect.width + offset}px`;
                node.style.top = `${parentY + parentRect.height / 2}px`;
                break;
        }
        node.style.transform = 'translate(-50%, -50%)';
    }
});

