document.getElementById('addWidgetButton').addEventListener('click', function() {
    var widgetGui = document.getElementById('widgetSelectionGui');
    var buttonBounds = this.getBoundingClientRect();

    if (widgetGui.style.display === 'block') {
        widgetGui.style.display = 'none';
    } else {
        widgetGui.style.display = 'block';
        widgetGui.style.position = 'absolute';
        widgetGui.style.left = buttonBounds.left + 'px'; // Aligns GUI's left edge with button's left
        // Adjust 'top' so it appears directly below the button irrespective of scroll position
        widgetGui.style.top = (window.scrollY + buttonBounds.bottom) + 'px'; 
    }
});