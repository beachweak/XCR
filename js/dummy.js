function adjustDummyWidgets() {
    const widgetContainer = document.getElementById('widgetContainer');
    const widgets = widgetContainer.querySelectorAll('.widget-element');
    const dummyWidgets = widgetContainer.querySelectorAll('.dummy-widget');
    
    // Remove existing dummy widgets
    dummyWidgets.forEach(dummy => widgetContainer.removeChild(dummy));
    
    // Calculate the number of widgets needed to fill the row - in this case, we assume 2 widgets per row
    const missingWidgets = (2 - (widgets.length % 2)) % 2;
    
    // Add the necessary number of dummy widgets
    for (let i = 0; i < missingWidgets; i++) {
        const dummyWidget = document.createElement('div');
        dummyWidget.classList.add('widget-element', 'dummy-widget');
        dummyWidget.style.visibility = 'hidden';
        // Set the dimensions to match your real widgets
        dummyWidget.style.width = '100%'; // Adjust based on your real widget's width
        dummyWidget.style.height = '0'; // Adjusting height to 0 to not add unnecessary space
        widgetContainer.appendChild(dummyWidget);
    }
}