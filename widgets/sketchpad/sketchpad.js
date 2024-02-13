document.querySelectorAll('.sketchpad-widget').forEach(widget => {
    const canvas = widget.querySelector('.drawingCanvas');

    // Set initial canvas dimensions
    canvas.style.width = '570px'; // Default size, adjust as needed
    canvas.style.height = '440px'; // Default size, adjust as needed

    const dpi = window.devicePixelRatio;

    function fixDPI() {
        const style = getComputedStyle(canvas);
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpi;
        canvas.height = rect.height * dpi;
    }

    const ctx = canvas.getContext('2d');

    fixDPI(); // Execute the DPI adjustment for the canvas
    ctx.scale(dpi, dpi); // Adjust drawing scale to DPI

    let painting = false;
    let brushSize = 5;
    let brushColor = '#000000';

    ctx.lineWidth = brushSize;

    function startPainting(e) {
        painting = true;
        draw(e);
    }

    function endPainting() {
        painting = false;
        ctx.beginPath(); // Begin a new path to start a new drawing stroke.
    }

    function draw(e) {
        if (!painting) return;
    
        e.preventDefault();
    
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * dpi;
        const y = (e.clientY - rect.top) * dpi;
    
        ctx.lineTo(x/dpi, y/dpi);
        ctx.strokeStyle = brushColor;
        ctx.lineJoin = 'round'; // Add this line
        ctx.lineCap = 'round';  // And this one
        ctx.stroke();
    
        ctx.beginPath();
        ctx.moveTo(x/dpi, y/dpi);
    }

    canvas.addEventListener('mousedown', startPainting);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', endPainting);
    canvas.addEventListener('mouseout', endPainting);

    const clearButton = widget.querySelector('.clearButton');
    clearButton.addEventListener('click', function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    const saveButton = widget.querySelector('.saveButton');
    saveButton.addEventListener('click', function() {
        const dataURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'my-sketchpad-image.png';
        link.href = dataURL;
        link.click();
    });

    const colorPicker = widget.querySelector('.colorPicker');
    colorPicker.addEventListener('change', function(e) {
        brushColor = e.target.value;
    });

    const brushIncreaseButton = widget.querySelector('.brushIncrease');
    brushIncreaseButton.addEventListener('click', function() {
        brushSize = Math.min(50, brushSize + 1);
        ctx.lineWidth = brushSize;
    });

    const brushDecreaseButton = widget.querySelector('.brushDecrease');
    brushDecreaseButton.addEventListener('click', function() {
        brushSize = Math.max(1, brushSize - 1);
        ctx.lineWidth = brushSize;
    });
});