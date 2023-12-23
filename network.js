function drawNetwork(matrix, labels) {
    const showLabels = document.getElementById('toggle-labels').checked;
    const cyContainer = document.getElementById('cy');

    if (!labels || !Array.isArray(labels)) {
        console.error('Labels are not defined or not an array.');
        return;
    }

    if (!cyContainer) {
        console.error('Container element with ID "cy" not found.');
        return;
    }

    const cy = cytoscape({
        container: cyContainer,
        elements: getElements(matrix, labels, showLabels),
        style: [
            {
                selector: 'node',
                style: {
                    'background-color': '#666',
                    'label': 'data(id)',
                    'width': 10,
                    'height': 10,
                    'font-size': 10, // Set font size for labels
                },
            },
            {
                selector: 'edge.directed',
                style: {
                    'width': 2, // Set arrow width
                    'line-color': '#ccc',
                    'label': showLabels ? 'data(label)' : '',
                    'font-size': 8, // Set font size for edge labels
                    'text-rotation': 'autorotate',
                    'curve-style': 'bezier',
                    'target-arrow-shape': 'triangle',
                    'arrow-scale': 1, // Set arrow scale
                },
            },
            {
                selector: 'edge.undirected',
                style: {
                    'width': 2, // Set arrow width
                    'line-color': '#ccc',
                    'label': showLabels ? 'data(label)' : '',
                    'font-size': 8, // Set font size for edge labels
                    'text-rotation': 'autorotate',
                    'curve-style': 'bezier',
                    'target-arrow-shape': 'none',
                },
            },
            {
                selector: '.highlighted',
                style: {
                    'background-color': 'red',
                    'line-color': 'red',
                    'target-arrow-color': 'red',
                    'transition-property': 'background-color, line-color, target-arrow-color',
                    'transition-duration': '0.5s',
                },
            },
        ],
        layout: {
            name: 'cose',
        },
    });

    cy.on('tap', 'node', function (evt) {
        const node = evt.target;
        cy.elements().removeClass('highlighted');
        node.addClass('highlighted');
        node.neighborhood().addClass('highlighted');
    });

    cy.on('tap', function (event) {
        if (event.target === cy) {
            cy.elements().removeClass('highlighted');
        }
    });

    // Scroll the network container into view
    cyContainer.scrollIntoView();
}
