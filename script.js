function() {
    // Global Variable
    let winCount = 0;
    let loseCount = 0;
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;
    // Main Container
    function createMainContainer() {
        let container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.width = '250px';
        container.style.height = '200px';
        container.style.backgroundColor = 'white';
        container.style.borderRadius = '12px';
        container.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
        container.style.border = '1px solid #e1e4e8';
        container.style.cursor = 'move';
        container.style.zIndex = '1000';
        container.style.top = '50px';
        container.style.left = '50px';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.fontFamily = '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif';
        container.style.transition = 'all 0.3s ease';
        container.style.overflow = 'hidden';
        return container;
    }
    // Header
    function createHeader() {
        let header = document.createElement('div');
        header.style.width = '100%';
        header.style.padding = '15px';
        header.style.background = 'linear-gradient(135deg, #4a90e2, #50c878)';
        header.style.color = '#ffffff';
        header.style.textAlign = 'center';
        header.style.fontSize = '18px';
        header.style.fontWeight = '600';
        header.style.letterSpacing = '0.5px';
        header.style.cursor = 'move';
        header.textContent = 'Win/Lose Counter';
        return header;
    }
    // Button
    function createStyledButton(text, bgColor, hoverColor, onClickCallback) {
        let button = document.createElement('button');
        button.style.padding = '12px 22px';
        button.style.border = 'none';
        button.style.borderRadius = '8px';
        button.style.color = 'white';
        button.style.fontSize = '12px';
        button.style.fontWeight = '500';
        button.style.backgroundColor = bgColor;
        button.style.cursor = 'pointer';
        button.style.transition = 'background-color 0.2s ease, transform 0.1s ease';
        button.textContent = text;
        // click and hover effect
        button.addEventListener('mouseenter', () => {
            button.style.backgroundColor = hoverColor;
        });
        button.addEventListener('mouseleave', () => {
            button.style.backgroundColor = bgColor;
        });
        button.addEventListener('mousedown', () => {
            button.style.transform = 'scale(0.95)';
        });
        button.addEventListener('mouseup', () => {
            button.style.transform = 'scale(1)';
        });
        button.addEventListener('click', onClickCallback);
        return button;
    }
    // Button Container
    function createButtonContainer() {
        let buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'center';
        buttonContainer.style.gap = '15px';
        buttonContainer.style.backgroundColor = '#ffffff';
        return buttonContainer;
    }
    // Score El
    function createScoreElement(text, color) {
        let score = document.createElement('div');
        score.style.textAlign = 'center';
        score.style.color = color;
        score.style.fontSize = '20px';
        score.style.fontWeight = '600';
        score.style.display = 'flex';
        score.style.flexDirection = 'column';
        score.style.alignItems = 'center';
        let label = document.createElement('span');
        label.textContent = text.split(': ')[0];
        label.style.fontSize = '14px';
        label.style.color = '#6c757d';
        label.style.marginBottom = '5px';
        let value = document.createElement('span');
        value.textContent = text.split(': ')[1];
        score.appendChild(label);
        score.appendChild(value);
        return score;
    }
    // Score Container
    function createScoreContainer() {
        let scoreContainer = document.createElement('div');
        scoreContainer.style.display = 'flex';
        scoreContainer.style.justifyContent = 'space-around';
        scoreContainer.style.padding = '20px';
        return scoreContainer;
    }
    // Get Coordinate
    function getCoordinates(e) {
        return e.type.includes('mouse') ? {
            x: e.clientX,
            y: e.clientY
        } : {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
    }
    // Drag func
    function setupDragFunctionality(container) {
        // Event listener for mouse
        container.addEventListener('mousedown', (e) => {
            if(e.target.tagName === 'BUTTON') return;
            const coords = getCoordinates(e);
            initialX = coords.x - xOffset;
            initialY = coords.y - yOffset;
            isDragging = true;
        });
        document.addEventListener('mousemove', (e) => {
            if(!isDragging) return;
            e.preventDefault();
            const coords = getCoordinates(e);
            currentX = coords.x - initialX;
            currentY = coords.y - initialY;
            xOffset = currentX;
            yOffset = currentY;
            container.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
        });
        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
        // Event listener for touch
        container.addEventListener('touchstart', (e) => {
            if(e.target.tagName === 'BUTTON') return;
            const coords = getCoordinates(e);
            initialX = coords.x - xOffset;
            initialY = coords.y - yOffset;
            isDragging = true;
        });
        document.addEventListener('touchmove', (e) => {
            if(!isDragging) return;
            e.preventDefault();
            const coords = getCoordinates(e);
            currentX = coords.x - initialX;
            currentY = coords.y - initialY;
            xOffset = currentX;
            yOffset = currentY;
            container.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
        }, {
            passive: false
        });
        document.addEventListener('touchend', () => {
            isDragging = false;
        });
    }

    function initGameTracker() {
        const container = createMainContainer();
        const header = createHeader();
        container.appendChild(header);
        const scoreContainer = createScoreContainer();
        const scoreWin = createScoreElement("Win: 0", "#2ecc71");
        const scoreLose = createScoreElement("Lose: 0", "#e74c3c");
        scoreContainer.appendChild(scoreWin);
        scoreContainer.appendChild(scoreLose);
        const buttonContainer = createButtonContainer();
        const buttonGreen = createStyledButton("Win", "#2ecc71", "#27ae60", () => {
            winCount++;
            scoreWin.querySelector('span:last-child').textContent = winCount;
        });
        const buttonRed = createStyledButton("Lose", "#e74c3c", "#c0392b", () => {
            loseCount++;
            scoreLose.querySelector('span:last-child').textContent = loseCount;
        });
        const buttonBlue = createStyledButton("Reset", "#3498db", "#2980b9", () => {
            winCount = 0;
            loseCount = 0;
            scoreWin.querySelector('span:last-child').textContent = winCount;
            scoreLose.querySelector('span:last-child').textContent = loseCount;
        });
        buttonContainer.appendChild(buttonGreen);
        buttonContainer.appendChild(buttonRed);
        buttonContainer.appendChild(buttonBlue);
        container.appendChild(scoreContainer);
        container.appendChild(buttonContainer);
        setupDragFunctionality(container);
        document.body.appendChild(container);
    }
    initGameTracker();
}
