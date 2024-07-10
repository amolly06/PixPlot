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
            Node
            <button class="add-node-btn" data-direction="up">↑</button>
            <button class="add-node-btn" data-direction="down">↓</button>
            <button class="add-node-btn" data-direction="left">←</button>
            <button class="add-node-btn" data-direction="right">→</button>
        `;
        return node;
    }

    function positionNode(node, parentNode, direction) {
        const offset = 100; // Distance between nodes
        const parentRect = parentNode.getBoundingClientRect();
        switch (direction) {
            case 'up':
                node.style.left = `${parentRect.left + window.scrollX + parentRect.width / 2}px`;
                node.style.top = `${parentRect.top + window.scrollY - offset}px`;
                break;
            case 'down':
                node.style.left = `${parentRect.left + window.scrollX + parentRect.width / 2}px`;
                node.style.top = `${parentRect.top + window.scrollY + parentRect.height + offset}px`;
                break;
            case 'left':
                node.style.left = `${parentRect.left + window.scrollX - offset}px`;
                node.style.top = `${parentRect.top + window.scrollY + parentRect.height / 2}px`;
                break;
            case 'right':
                node.style.left = `${parentRect.left + window.scrollX + parentRect.width + offset}px`;
                node.style.top = `${parentRect.top + window.scrollY + parentRect.height / 2}px`;
                break;
        }
        node.style.transform = 'translate(-50%, -50%)';
    }
});

