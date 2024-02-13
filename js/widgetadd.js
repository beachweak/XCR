const fs = require('fs');
const path = require('path');

const widgetConfigPath = path.join(__dirname, 'widgetConfigs.json');

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
        // do not change this from fixed. whatever you do.
        // from a 3am coding spree, setting this from anything other than fixed causes the gui to break entirely
        // i do not know why. i do not care why. but setting the style to fixed makes it work. keep this in mind
        widgetSelectionGui.style.top = '42%';
        widgetSelectionGui.style.left = '50%';
        widgetSelectionGui.style.transform = 'translate(-50%, -50%)';
    }

    function saveWidgetConfig(widget) {
        let widgetConfigs = [];

        if (fs.existsSync(widgetConfigPath)) {
            widgetConfigs = JSON.parse(fs.readFileSync(widgetConfigPath, 'utf8'));
        }

        if (!widget.id) {
            widget.id = `widget-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        }

        widgetConfigs.push(widget);

        fs.writeFileSync(widgetConfigPath, JSON.stringify(widgetConfigs));
    }

    function removeWidgetConfig(widgetId) {
        let widgetConfigs = [];

        try {
            if (fs.existsSync(widgetConfigPath)) {
                widgetConfigs = JSON.parse(fs.readFileSync(widgetConfigPath, 'utf8'));

                const index = widgetConfigs.findIndex(w => w.id === widgetId);

                if (index !== -1) {
                    widgetConfigs.splice(index, 1);
                    fs.writeFileSync(widgetConfigPath, JSON.stringify(widgetConfigs));
                    console.log(`Widget with ID ${widgetId} has been removed.`);
                } else {
                    console.log(`Widget with ID ${widgetId} was not found.`);
                }
            } else {
                console.log("widgetConfigs.json does not exist.");
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

        const widgetHtmlContent = fs.readFileSync(path.join(__dirname, widget.html), 'utf8');
        widgetEl.insertAdjacentHTML('beforeend', widgetHtmlContent);

        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = path.join(__dirname, widget.css);
        widgetEl.appendChild(cssLink);

        widgetContainer.appendChild(widgetEl);

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
