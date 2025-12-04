const graph = document.getElementById('coordinate-plane');
const ctx = graph.getContext('2d');
const scale = 40;
let centerX, centerY;
let currentR = 2;

graph.width = 400;
graph.height = 400;

document.addEventListener('DOMContentLoaded', function() {
    initCanvas();
});
drawArea(currentR);
drawLabels(currentR);

function initCanvas(R = currentR) {
    if (R !== undefined && R !== null) {
        currentR = parseFloat(R) || 2;
    }
    centerX = graph.width / 2;
    centerY = graph.height / 2;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, graph.width, graph.height);

    drawGrid();
    drawAxis();
    drawArea(currentR);
    drawLabels(currentR);
    drawArrows();
    if (window.pointsHistory && Array.isArray(window.pointsHistory)) {
        window.pointsHistory.forEach(point => {
            drawPoint(point.x, point.y, point.hit);
        });
    }

}

function drawArea(R = currentR) {
    const maxVisibleR = 4;
    const drawR = Math.min(R, maxVisibleR);

    ctx.beginPath();
    ctx.rect(
        centerX,
        centerY - scale * drawR,
        scale * drawR,
        scale * drawR
    );
    ctx.fillStyle = 'rgba(254, 249, 140, 0.7)';
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX - scale * drawR/2, centerY);
    ctx.lineTo(centerX, centerY - scale * drawR);
    ctx.closePath();
    ctx.fillStyle = 'rgba(254, 249, 140, 0.7)';
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, scale * drawR/2, 0, -Math.PI*1.5, false);// ← ВВЕРХ-ПРАВО
    ctx.lineTo(centerX, centerY);
    ctx.closePath();
    ctx.fillStyle = 'rgba(254, 249, 140, 0.7)';
    ctx.fill();
    if (R > maxVisibleR) {
        showGraphWarning(`R=${R} слишком большой для отображения. 
                        Показана область для R=${maxVisibleR}`);
    }
}
function showGraphWarning(message) {
    const oldWarning = document.getElementById('graph-warning');
    if (oldWarning) {
        oldWarning.remove();
    }

    const warning = document.createElement('div');
    warning.id = 'graph-warning';
    warning.style.cssText = `
        position: absolute;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(255, 0, 0, 0.9);
        color: white;
        padding: 10px 15px;
        border-radius: 5px;
        font-weight: bold;
        z-index: 1000;
        text-align: center;
        max-width: 80%;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    `;
    warning.textContent = message;
    const graphContainer = document.querySelector('.coordinate-plane');
    if (graphContainer) {
        graphContainer.appendChild(warning);
        setTimeout(() => {
            if (warning.parentNode) {
                warning.parentNode.removeChild(warning);
            }
        }, 5000);
    }
}

function drawAxis(R) {
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(graph.width, centerY);
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, graph.height);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.stroke();
}

function drawGrid() {
    ctx.strokeStyle = '#acacac';
    ctx.lineWidth = 1;

    for (let x = centerX % scale; x < graph.width; x += scale) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, graph.height);
        ctx.stroke();
    }

    for (let y = centerY % scale; y < graph.height; y += scale) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(graph.width, y);
        ctx.stroke();
    }
}

function drawLabels(R = currentR) {
    const maxVisibleR = 4;
    const drawR = Math.min(R, maxVisibleR);
    ctx.fillStyle = 'black';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';

    ctx.fillText('R', centerX + scale * drawR, centerY + 15);
    ctx.fillText('R/2', centerX + scale * drawR/2, centerY + 15);
    ctx.fillText('-R/2', centerX - scale * drawR/2, centerY + 15);
    ctx.fillText('-R', centerX - scale * drawR, centerY + 15);

    ctx.textAlign = 'left';
    ctx.fillText('R', centerX + 5, centerY - scale * drawR);
    ctx.fillText('R/2', centerX + 5, centerY - scale * drawR/2);
    ctx.fillText('-R/2', centerX + 5, centerY + scale * drawR/2);
    ctx.fillText('-R', centerX + 5, centerY + scale * drawR);

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;

    const marks = [-drawR, -drawR/2, drawR/2, drawR];
    marks.forEach(value => {
        const x = centerX + value * scale;
        const y = centerY - value * scale;

        ctx.beginPath();
        ctx.moveTo(x, centerY - 5);
        ctx.lineTo(x, centerY + 5);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(centerX - 5, y);
        ctx.lineTo(centerX + 5, y);
        ctx.stroke();
    });
}

function drawArrows() {
    ctx.beginPath();
    ctx.moveTo(graph.width - 10, centerY - 5);
    ctx.lineTo(graph.width, centerY);
    ctx.lineTo(graph.width - 10, centerY + 5);
    ctx.fillStyle = 'black';
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(centerX - 5, 10);
    ctx.lineTo(centerX, 0);
    ctx.lineTo(centerX + 5, 10);
    ctx.fillStyle = 'black';
    ctx.fill();

    ctx.fillStyle = 'black';
    ctx.font = '14px Arial';
    ctx.fillText('x', graph.width - 15, centerY - 10);
    ctx.fillText('y', centerX + 10, 15);
}

function drawPoint(x, y, hit, isTemporary = false) {
    const canvasX = centerX + x * scale;
    const canvasY = centerY - y * scale;

    ctx.beginPath();
    ctx.arc(canvasX, canvasY, 4, 0, Math.PI * 2);

    if (isTemporary) {
        ctx.fillStyle = '#000000';
        ctx.setLineDash([2, 2]);
    } else if (hit) {
        ctx.fillStyle = '#4CAF50';
        ctx.setLineDash([]);
    } else {
        ctx.fillStyle = '#D14545';
        ctx.setLineDash([]);
    }

    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.setLineDash([]);
}

function drawHistoryPoints() {
    if (window.pointsHistory && window.pointsHistory.length > 0) {
        window.pointsHistory.forEach(point => {
            drawPoint(point.x, point.y, point.hit);
        });
    }
}

graph.addEventListener('click', function(event) {
    const hiddenXInput = document.getElementById('hiddenX');
    const yInput = document.getElementById('yInput');
    const rInput = document.getElementById('rInput');
    const coordsForm = document.getElementById('coords-form');


    if (!hiddenXInput || !yInput || !rInput || !coordsForm) {
        console.error("MISSING FORM ELEMENTS!");
        return;
    }

    const rect = graph.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    const rValue = rInput.value;

    if (!rValue || rValue === '') {
        document.getElementById('graph-message').style.display = 'block';
        setTimeout(() => {
            document.getElementById('graph-message').style.display = 'none';
        }, 3000);
        return;
    }
    const R = parseFloat(rValue);
    if (window.currentR !== R) {
        window.currentR = R;
        if (typeof initCanvas === 'function') {
            initCanvas(R);
        }
    }
    const x = (clickX - centerX) / scale;
    const y = (centerY - clickY) / scale;
    drawPoint(x, y, false, true);

    hiddenXInput.value = x.toFixed(3);
    hiddenXInput.name = 'x_graph'
    yInput.value = y.toFixed(3);
    rInput.value = rValue;

    coordsForm.submit();
});

function updateGraph() {
    initCanvas();
}
window.updateCanvasWithR = function(R) {
    if (R && !isNaN(parseFloat(R))) {
        currentR = parseFloat(R);
        initCanvas(currentR);
        return true;
    }
    return false;
};
window.drawHistoryPoints = drawHistoryPoints;
window.updateGraph = updateGraph;