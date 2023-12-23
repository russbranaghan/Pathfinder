// Function to calculate network density for an undirected graph
function calculateNetworkDensityUndirected(matrix) {
    const numNodes = matrix.length;
    let numEdges = 0;

    for (let i = 0; i < numNodes; i++) {
        for (let j = i + 1; j < numNodes; j++) {
            if (matrix[i][j] === 1) {
                numEdges++;
            }
        }
    }

    const possibleEdges = (numNodes * (numNodes - 1)) / 2; // For an undirected graph
    const density = (2 * numEdges) / possibleEdges;

    return density;
}

// Function to calculate network density for a directed graph
function calculateNetworkDensityDirected(matrix) {
    const numNodes = matrix.length;
    let numEdges = 0;

    for (let i = 0; i < numNodes; i++) {
        for (let j = 0; j < numNodes; j++) {
            if (matrix[i][j] === 1) {
                numEdges++;
            }
        }
    }

    const possibleEdges = numNodes * (numNodes - 1); // For a directed graph
    const density = numEdges / possibleEdges;

    return density;
}

// Function to update the network density display
function updateNetworkDensity(matrix, networkType) {
    let density;

    if (networkType === 'pathfinder') {
        density = calculateNetworkDensityUndirected(matrix);
    } else if (networkType === 'nearest-neighbor') {
        density = calculateNetworkDensityDirected(matrix);
    } else {
        density = 0; // Default value
    }

    const densityValueElement = document.getElementById('density-value');
    densityValueElement.textContent = `Network Density: ${density.toFixed(4)}`;
}

    // Function to calculate degree centrality for a node in the network
    function calculateDegreeCentrality(matrix, nodeIndex) {
        const numVertices = matrix.length;
        let degree = 0;

        for (let i = 0; i < numVertices; i++) {
            if (matrix[nodeIndex][i] === 1) {
                degree++;
            }
        }

        return degree;
    }

    // Function to calculate eccentricity for a node in the network based on geodetic distance
    function calculateEccentricity(matrix, nodeIndex) {
        const numVertices = matrix.length;
        let maxDistance = 0;

        for (let i = 0; i < numVertices; i++) {
            if (i !== nodeIndex && matrix[nodeIndex][i] === 1) {
                maxDistance = Math.max(maxDistance, 1);
            } else {
                // Use a shortest path algorithm (e.g., BFS) to find the geodetic distance
                const geodeticDistance = findGeodeticDistance(matrix, nodeIndex, i);
                maxDistance = Math.max(maxDistance, geodeticDistance);
            }
        }

        return maxDistance;
    }

        // Function to calculate the median nodes in the network
        function calculateMedianNodes(matrix) {
            const numVertices = matrix.length;
            const eccentricities = [];
    
            // Calculate eccentricity for each node
            for (let i = 0; i < numVertices; i++) {
                eccentricities.push({
                    node: globalLabels[i],
                    eccentricity: calculateEccentricity(matrix, i),
                });
            }
    
            // Find the minimum eccentricity
            const minEccentricity = Math.min(...eccentricities.map(e => e.eccentricity));
    
            // Find the nodes with minimum eccentricity
            const medianNodes = eccentricities.filter(e => e.eccentricity === minEccentricity);
    
            return medianNodes.map(node => node.node);
        }

        function updateNetworkStats(nodeStats) {
            // Clear existing rows
            statsTableBody.innerHTML = '';
    
            // Iterate through node statistics and add rows to the table
            nodeStats.forEach(nodeStat => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${nodeStat.node}</td>
                    <td>${nodeStat.degreeCentrality}</td>
                    <td>${nodeStat.eccentricity}</td>
                    <td>${nodeStat.isMedian ? '*' : ''}</td>
                `;
                statsTableBody.appendChild(row);
            });
        }

            // Function to find the geodetic distance (graph distance) between two nodes
    function findGeodeticDistance(matrix, sourceNodeIndex, targetNodeIndex) {
        const numVertices = matrix.length;
        const visited = new Array(numVertices).fill(false);
        const queue = [];
        let distance = 0;

        queue.push(sourceNodeIndex);
        visited[sourceNodeIndex] = true;

        while (queue.length > 0) {
            const levelSize = queue.length;

            for (let i = 0; i < levelSize; i++) {
                const currentNode = queue.shift();

                if (currentNode === targetNodeIndex) {
                    return distance; // Found the target node, return the geodetic distance
                }

                for (let neighbor = 0; neighbor < numVertices; neighbor++) {
                    if (matrix[currentNode][neighbor] === 1 && !visited[neighbor]) {
                        visited[neighbor] = true;
                        queue.push(neighbor);
                    }
                }
            }

            distance++; // Increment the distance for each level (edge traversal)
        }

        return -1; // The target node is not reachable from the source node
    }

    // Function to sort the table based on the selected column
function sortTable(columnIndex, ascending) {
    const tableBody = document.getElementById('stats-table-body');
    const rows = Array.from(tableBody.querySelectorAll('tr'));

    // Define a custom sorting function for numeric columns
    const customSort = (a, b) => {
        const aValue = parseFloat(a.cells[columnIndex].textContent) || 0;
        const bValue = parseFloat(b.cells[columnIndex].textContent) || 0;

        if (ascending) {
            return aValue - bValue;
        } else {
            return bValue - aValue;
        }
    };

    // Sort the rows using the custom sorting function
    rows.sort(customSort);

    // Clear the table body
    tableBody.innerHTML = '';

    // Append the sorted rows back to the table body
    rows.forEach(row => tableBody.appendChild(row));
}
