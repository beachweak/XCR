const fs = require('fs');
const path = require('path');

// Function to determine the path for the .XCR folder.
function getAppDataPath() {
    const appDataPath = path.join(os.homedir(), '.XCR');
    if (!fs.existsSync(appDataPath)) {
        fs.mkdirSync(appDataPath, { recursive: true });
    }
    return appDataPath;
}

// Adjusted widgetConfigPath to point to the .XCR directory.
const widgetConfigPath = path.join(getAppDataPath(), 'widgetConfigs.json');

document.addEventListener('DOMContentLoaded', function () {
    const addWidgetButton = document.getElementById('addWidgetButton');
    const widgetContainer = document.getElementById('widgetContainer');

    loadWidgets();

    addWidgetButton.addEventListener('click', function () {
        const widgetSelectionGui = document.getElementById('widgetSelectionGui');

        if (!widgetSelectionGui) {
            createWidgetSelectionGui();
        } else {
            toggleWidgetSelectionGui(widgetSelectionGui);
        }
    });

    function loadWidgets() {
        if (fs.existsSync(widgetConfigPath)) {
            const widgetConfigs = JSON.parse(fs.readFileSync(widgetConfigPath, 'utf8'));

            widgetConfigs.forEach(config => {
                addWidget(config);
            });
        }
    }

    function createWidgetSelectionGui() {
        // widgetManifestPath remains unchanged as specified.
        const widgetManifestPath = path.join(__dirname, 'widgetManifest.json');
        const widgetManifest = JSON.parse(fs.readFileSync(widgetManifestPath, 'utf8'));
        const selectionGui = document.createElement('div');
        selectionGui.id = 'widgetSelectionGui';
        document.body.appendChild(selectionGui);

        widgetManifest.forEach(widget => {
            const widgetButton = document.createElement('button');
            widgetButton.textContent = widget.name;
            widgetButton.addEventListener('click', () => {
                addWidget(widget);
                toggleWidgetSelectionGui(selectionGui);
                saveWidgetConfig(widget);
            });
            selectionGui.appendChild(widgetButton);
        });

        positionAndCenterWidgetSelectionGui();
    }

    function toggleWidgetSelectionGui(guiElement) {
        guiElement.style.display = guiElement.style.display === 'none' || guiElement.style.display === '' ? 'flex' : 'none';
        positionAndCenterWidgetSelectionGui();
    }

    function positionAndCenterWidgetSelectionGui() {
        const widgetSelectionGui = document.getElementById('widgetSelectionGui');
        widgetSelectionGui.style.position = 'fixed';
        widgetSelectionGui.style.top = '42%';
        widgetSelectionGui.style.left = '50%';
        widgetSelectionGui.style.transform = 'translate(-50%, -50%)';
    }

    function saveWidgetConfig(widget) {
        let widgetConfigs = [];

        try {
            widgetConfigs = JSON.parse(fs.readFileSync(widgetConfigPath, 'utf8'));
        } catch (e) {
            widgetConfigs = [];
        }

        if (!widget.id) {
            widget.id = `widget-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        }

        widgetConfigs.push(widget);

        fs.writeFileSync(widgetConfigPath, JSON.stringify(widgetConfigs, null, 2));
    }

    function removeWidgetConfig(widgetId) {
        let widgetConfigs = [];

        try {
            widgetConfigs = JSON.parse(fs.readFileSync(widgetConfigPath, 'utf8'));

            const index = widgetConfigs.findIndex(w => w.id === widgetId);

            if (index !== -1) {
                widgetConfigs.splice(index, 1);
                fs.writeFileSync(widgetConfigPath, JSON.stringify(widgetConfigs, null, 2));
                console.log(`Widget with ID ${widgetId} has been removed.`);
            } else {
                console.log(`Widget with ID ${widgetId} was not found.`);
            }
        } catch (error) {
            console.error("An error occurred while trying to remove a widget config:", error);
        }
    }

    function addWidget(widget) {
        const widgetEl = document.createElement('div');
        widgetEl.classList.add('widget-element');
        widgetEl.setAttribute('data-widget-id', widget.id);

        const closeBtn = document.createElement('button');
        closeBtn.className = 'widget-delete';
        const icon = document.createElement('i');
        icon.className = 'fa-solid fa-trash';
        closeBtn.appendChild(icon);
        widgetEl.appendChild(closeBtn);

        // Ensure the paths to widget files are correct given their locations.
        const widgetHtmlContent = fs.readFileSync(path.join(__dirname, widget.html), 'utf8');
        widgetEl.insertAdjacentHTML('beforeend', widgetHtmlContent);

        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = path.join(__dirname, widget.css);
        widgetEl.appendChild(cssLink);

        widgetContainer.appendChild(widgetEl);

        // Similar to HTML and CSS, ensure the JS file path is correct.
        const widgetScriptContent = fs.readFileSync(path.join(__dirname, widget.js), 'utf8');
        const scriptTag = document.createElement('script');
        scriptTag.textContent = widgetScriptContent;
        document.body.appendChild(scriptTag);
    }

    widgetContainer.addEventListener('click', function (event) {
        if (event.target.className.includes('widget-delete')) {
            const widgetToDelete = event.target.closest('.widget-element');
            if (widgetToDelete) {
                const widgetId = widgetToDelete.getAttribute('data-widget-id');
                widgetContainer.removeChild(widgetToDelete);
                removeWidgetConfig(widgetId);
            }
        }
    });
});