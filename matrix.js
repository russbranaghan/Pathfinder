    // Function to enable or disable input fields based on network type
    function toggleInputs(networkType) {
        const inputsToToggle = [qInput, rInput, maxValueInput];
        const isPathfinderNetwork = networkType === 'pathfinder';
    
        inputsToToggle.forEach(input => {
            input.disabled = !isPathfinderNetwork;
        });
        }

        function generateNetwork() {
            if (!globalMatrix || !globalLabels) {
                alert("Please load an Excel file first.");
                return;  
            }
        
            const r = parseFloat(document.getElementById('input-r').value);
            const q = parseInt(document.getElementById('input-q').value);
            const maxValue = parseFloat(document.getElementById('input-max-value').value);
        
            if (q < 2 || q >= globalMatrix.length) {
                alert("Invalid value for q parameter.");
                return;
            }
        
            const networkType = document.querySelector('input[name="network-type"]:checked').value;
        
            let networkMatrix;
            if (networkType === "pathfinder") {
                // Calculate and display the Pathfinder network
                const shortestPathsMatrix = floydWarshall(globalMatrix, r, q);
                networkMatrix = generateComparisonMatrix(globalMatrix, shortestPathsMatrix, maxValue);
            } else if (networkType === "nearest-neighbor") {
                // Generate and display the Nearest Neighbor network
                networkMatrix = generateNearestNeighborMatrix(globalMatrix);
            }
        
            // Calculate network statistics
            const nodeStats = [];
            for (let i = 0; i < globalLabels.length; i++) {
                const nodeStat = {
                    node: globalLabels[i],
                    degreeCentrality: calculateDegreeCentrality(networkMatrix, i),
                    eccentricity: calculateEccentricity(networkMatrix, i),
                    isMedian: calculateMedianNodes(networkMatrix).includes(globalLabels[i]),
                };
                nodeStats.push(nodeStat);
            }
        
            // Update the network statistics table
            updateNetworkStats(nodeStats);
        
            // Draw the network
            drawNetwork(networkMatrix, globalLabels);
        
            // Update the network density
            updateNetworkDensity(networkMatrix, networkType);
        } 

        function floydWarshall(matrix, r, q) {
            const numVertices = matrix.length;
            q = Math.min(q, numVertices - 1);
            const dist = matrix.map(row => row.slice());
    
            for (let k = 0; k < q; k++) {
                for (let i = 0; i < numVertices; i++) {
                    for (let j = 0; j < numVertices; j++) {
                        if (i !== j && i !== k && j !== k) {
                            const newDist = calculateDistance(dist[i][k], dist[k][j], r);
                            if (newDist < dist[i][j]) {
                                dist[i][j] = newDist;
                            }
                        }
                    }
                }
            }
    
            return dist;
        }

        function calculateDistance(a, b, r) {
            if (r > 99) {
                return Math.max(a, b);
            } else if (r === 1) {
                return a + b;
            } else {
                return Math.pow((Math.pow(a, r) + Math.pow(b, r)), 1 / r);
            }
        }
    
        function generateComparisonMatrix(inputMatrix, adjacencyMatrix, maxValue) {
            return inputMatrix.map((row, i) =>
                row.map((cell, j) =>
                    i === j ? 0 : (isFinite(cell) && cell <= adjacencyMatrix[i][j] && cell < maxValue ? 1 : 0)
                )
            );
        }
    
        function isMatrixSymmetric(matrix) {
            for (let i = 0; i < matrix.length; i++) {
                for (let j = 0; j < i; j++) {
                    if (matrix[i][j] !== matrix[j][i]) {
                        return false;
                    }
                }
            }
            return true;
        }

        function generateNearestNeighborMatrix(matrix) {
            const numVertices = matrix.length;
            const nearestNeighborMatrix = [];
    
            for (let i = 0; i < numVertices; i++) {
                nearestNeighborMatrix[i] = [];
                for (let j = 0; j < numVertices; j++) {
                    if (i !== j && findNearestNeighbor(matrix, i) === j) {
                        nearestNeighborMatrix[i][j] = 1; // Set to 1 if i has a nearest neighbor at j
                    } else {
                        nearestNeighborMatrix[i][j] = 0; // Set to 0 otherwise
                    }
                }
            }
    
            return nearestNeighborMatrix;
        }

            // Function to find the nearest neighbor for a given node
    function findNearestNeighbor(matrix, nodeIndex) {
        const numVertices = matrix.length;
        let minDistance = Infinity;
        let nearestNeighborIndex = -1;

        for (let i = 0; i < numVertices; i++) {
            if (i !== nodeIndex && matrix[nodeIndex][i] < minDistance) {
                minDistance = matrix[nodeIndex][i];
                nearestNeighborIndex = i;
            }
        }

        return nearestNeighborIndex;
    }
    