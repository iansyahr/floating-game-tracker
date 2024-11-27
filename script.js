javascript:(function () {
  // Cek apakah tracker sudah ada
  if (document.getElementById('game-tracker-window')) {
    return;
  }

  // Fungsi untuk membuat elemen dengan gaya
  function createElement(tag, styles = {}) {
    const el = document.createElement(tag);
    Object.assign(el.style, {
      boxSizing: 'border-box',
      margin: '0',
      padding: '0',
      ...styles
    });
    return el;
  }

  // Container utama
  const trackerContainer = createElement('div', {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: '350px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Arial, sans-serif',
    border: '1px solid #e0e0e0',
    zIndex: '10000',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  });
  trackerContainer.id = 'game-tracker-window';

  // Header
  const header = createElement('div', {
    fontSize: '20px',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    borderBottom: '1px solid #f0f0f0',
    paddingBottom: '10px',
    width: '100%',
    margin: '0 0 10px 0'
  });
  header.textContent = 'Game Tracker';

  // Tombol tutup
  const closeButton = createElement('button', {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'none',
    border: 'none',
    color: '#888',
    fontSize: '24px',
    cursor: 'pointer',
    lineHeight: '1',
    padding: '0',
    zIndex: '10'
  });
  closeButton.textContent = '×';
  
  closeButton.addEventListener('click', () => {
    document.body.removeChild(trackerContainer);
  });

  // Header wrapper untuk positioning tombol close
  const headerWrapper = createElement('div', {
    position: 'relative',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  });
  headerWrapper.appendChild(header);
  headerWrapper.appendChild(closeButton);
  trackerContainer.appendChild(headerWrapper);

  // Container skor
  const scoreContainer = createElement('div', {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: '10px'
  });

  // Fungsi buat counter
  function createScoreCounter(label, color) {
    const counterEl = createElement('div', {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '45%'
    });

    const labelEl = createElement('span', {
      fontSize: '14px',
      color: color,
      marginBottom: '5px'
    });
    labelEl.textContent = label;

    const valueEl = createElement('span', {
      fontSize: '24px',
      fontWeight: 'bold',
      color: color
    });
    valueEl.id = `${label.toLowerCase()}Count`;
    valueEl.textContent = '0';

    counterEl.appendChild(labelEl);
    counterEl.appendChild(valueEl);
    return counterEl;
  }

  const winCounter = createScoreCounter('Win', '#28a745');
  const loseCounter = createScoreCounter('Lose', '#dc3545');
  
  scoreContainer.appendChild(winCounter);
  scoreContainer.appendChild(loseCounter);
  trackerContainer.appendChild(scoreContainer);

  // Container tombol
  const buttonContainer = createElement('div', {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '10px',
    width: '100%'
  });

  // Fungsi buat tombol
  function createButton(text, color, onClick) {
    const button = createElement('button', {
      flex: '1',
      padding: '10px',
      backgroundColor: color,
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '14px',
      cursor: 'pointer',
      transition: 'opacity 0.2s'
    });
    button.textContent = text;
    
    button.addEventListener('click', onClick);
    button.addEventListener('mouseenter', () => button.style.opacity = '0.9');
    button.addEventListener('mouseleave', () => button.style.opacity = '1');
    
    return button;
  }

  let winCount = 0;
  let loseCount = 0;

  const winButton = createButton('Win', '#28a745', () => {
    winCount++;
    document.getElementById('winCount').textContent = winCount;
  });

  const loseButton = createButton('Lose', '#dc3545', () => {
    loseCount++;
    document.getElementById('loseCount').textContent = loseCount;
  });

  const resetButton = createButton('Reset', '#007bff', () => {
    winCount = 0;
    loseCount = 0;
    document.getElementById('winCount').textContent = winCount;
    document.getElementById('loseCount').textContent = loseCount;
  });

  buttonContainer.appendChild(winButton);
  buttonContainer.appendChild(loseButton);
  buttonContainer.appendChild(resetButton);
  trackerContainer.appendChild(buttonContainer);

  // Fitur drag
  let isDragging = false;
  let startX, startY, initialLeft, initialTop;
  
  function startDrag(e) {
    // Hindari drag jika mengklik tombol close
    if (e.target === closeButton) return;
  
    isDragging = true;
    const touch = e.touches ? e.touches[0] : e;
    startX = touch.clientX;
    startY = touch.clientY;
    initialLeft = trackerContainer.offsetLeft;
    initialTop = trackerContainer.offsetTop;
    trackerContainer.style.cursor = 'grabbing';
  }
  
  function drag(e) {
    if (!isDragging) return;
  
    const touch = e.touches ? e.touches[0] : e;
    const dx = touch.clientX - startX;
    const dy = touch.clientY - startY;
  
    trackerContainer.style.left = `${initialLeft + dx}px`;
    trackerContainer.style.top = `${initialTop + dy}px`;
    trackerContainer.style.transform = 'none';
  }
  
  function stopDrag() {
    isDragging = false;
    trackerContainer.style.cursor = 'move';
  }
  
  // Event listeners untuk mouse dan touchscreen
  trackerContainer.addEventListener('mousedown', startDrag);
  trackerContainer.addEventListener('touchstart', startDrag);
  
  document.addEventListener('mousemove', drag);
  document.addEventListener('touchmove', drag);
  
  document.addEventListener('mouseup', stopDrag);
  document.addEventListener('touchend', stopDrag);
  // Tambahkan ke body
  document.body.appendChild(trackerContainer);

  // Media query sederhana untuk perangkat mobile
  const mediaQuery = window.matchMedia('(max-width: 480px)');
  
  function handleMediaQuery(e) {
    if (e.matches) {
      trackerContainer.style.width = '95%';
      trackerContainer.style.maxWidth = '95%';
      header.style.fontSize = '18px';
      
      [winButton, loseButton, resetButton].forEach(btn => {
        btn.style.fontSize = '12px';
        btn.style.padding = '8px';
      });
    } else {
      trackerContainer.style.width = '90%';
      trackerContainer.style.maxWidth = '350px';
      header.style.fontSize = '20px';
      
      [winButton, loseButton, resetButton].forEach(btn => {
        btn.style.fontSize = '14px';
        btn.style.padding = '10px';
      });
    }
  }

  mediaQuery.addListener(handleMediaQuery);
  handleMediaQuery(mediaQuery);
  const resizeHandle = createElement('div', {
    position: 'absolute',
    bottom: '0',
    right: '0',
    width: '20px',
    height: '20px',
    backgroundColor: 'rgba(0,0,0,0)',
    cursor: 'nwse-resize',
    zIndex: '10',
  });
  trackerContainer.appendChild(resizeHandle);

  let isResizing = false;

  resizeHandle.addEventListener('mousedown', (e) => {
    isResizing = true;
    startX = e.clientX;
    startY = e.clientY;
    startWidth = trackerContainer.offsetWidth;
    startHeight = trackerContainer.offsetHeight;

    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResize);
  });

  function resize(e) {
    if (!isResizing) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    trackerContainer.style.width = `${startWidth + dx}px`;
    trackerContainer.style.height = `${startHeight + dy}px`;
  }

  function stopResize() {
    isResizing = false;
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('mouseup', stopResize);
  }

  // Tambahkan ke body
  document.body.appendChild(trackerContainer);
})();
