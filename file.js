function readFile(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const data = e.target.result;
        const workbook = XLSX.read(data, {
            type: 'binary'
        });

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        let rawData = XLSX.utils.sheet_to_json(worksheet, {
            header: 1
        });
        globalLabels = rawData[0].slice(1);
        globalMatrix = rawData.slice(1).map(row => row.slice(1));
    };

    reader.readAsBinaryString(file);
}

function getElements(matrix, labels, showLabels) {
    if (!Array.isArray(labels) || !Array.isArray(matrix)) {
        console.error('Labels or matrix are not provided in the expected format.');
        return [];
    }

    const isSymmetric = isMatrixSymmetric(matrix);

    const nodes = labels.map(label => ({
        data: { id: label },
    }));

    const edges = [];
    matrix.forEach((row, i) => {
        row.forEach((cell, j) => {
            if (cell === 1 && (!isSymmetric || i < j)) {
                const edgeClass = isSymmetric ? 'undirected' : 'directed';
                edges.push({
                    data: {
                        id: `${labels[i]}-${labels[j]}`,
                        source: labels[i],
                        target: labels[j],
                        label: showLabels ? String(globalMatrix[i][j]) : '',
                    },
                    classes: edgeClass,
                });
            }
        });
    });

    return [...nodes, ...edges];
}
