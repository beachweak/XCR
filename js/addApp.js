const fs = require('fs');
const { net } = require('electron');
const path = require('path');

document.getElementById('addAppbutton').addEventListener('click', function() {
    const formContainer = document.getElementById('appFormContainer');
    formContainer.style.display = formContainer.style.display === 'flex' ? 'none' : 'flex';
    formContainer.style.flexDirection = 'row';
    formContainer.style.alignItems = 'center';
});

document.getElementById('addApp').addEventListener('click', function() {
    const title = document.getElementById('appTitle').value || 'App';
    const address = document.getElementById('appAddress').value;
    if (!address) {
        alert('Please enter an app address');
        return;
    }

    const faviconUrl = `https://s2.googleusercontent.com/s2/favicons?domain=${address}`;
    const appData = { title, address, faviconUrl: faviconUrl || 'path/to/default/icon.png' }; // Use default icon path if no favicon found
    saveApp(appData);
    createAppEntry(appData);

    document.getElementById('appTitle').value = '';
    document.getElementById('appAddress').value = '';
    document.getElementById('appFormContainer').style.display = 'none';
});

function saveApp(appData) {
    let apps = JSON.parse(fs.readFileSync('appDirectory.json', 'utf8') || '[]');
    apps.push(appData);
    fs.writeFileSync('appDirectory.json', JSON.stringify(apps, null, 2), 'utf8');
}

window.onload = function() {
    loadApps();
};

function createAppEntry(appData) {
    const appContainer = document.createElement('div');
    appContainer.classList.add('app-entry');

    const icon = new Image();
    icon.src = appData.faviconUrl;
    icon.onerror = () => icon.src = 'path/to/default/icon.png'; // Replace with actual path to default icon
    icon.classList.add('app-icon');

    const appTitle = document.createElement('span');
    appTitle.textContent = appData.title;
    appTitle.classList.add('app-title');

    const launchButton = document.createElement('button');
    launchButton.textContent = 'Launch';
    launchButton.classList.add('launch-button');
    launchButton.addEventListener('click', function() {
        window.open(appData.address, '_blank');
    });

    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
    deleteButton.classList.add('delete-button');
    deleteButton.addEventListener('click', function() {
        appContainer.remove();
        deleteApp(appData);
    });

    appContainer.appendChild(icon);
    appContainer.appendChild(appTitle);
    appContainer.appendChild(launchButton);
    appContainer.appendChild(deleteButton);
    
    distributeAppEntry(appContainer);
}

function distributeAppEntry(appContainer) {
    const columns = document.querySelectorAll('.column');
    let minColumn = columns[0];
    let minApps = Number.MAX_SAFE_INTEGER;
    for (let column of columns) {
        if (column.children.length < minApps) {
            minApps = column.children.length;
            minColumn = column;
        }
    }
    minColumn.appendChild(appContainer);
}

function loadApps() {
    let apps = JSON.parse(fs.readFileSync('appDirectory.json', 'utf8') || '[]');
    apps.forEach(appData => {
        createAppEntry(appData);
    });
}

function deleteApp(appDataToDelete) {
    let apps = JSON.parse(fs.readFileSync('appDirectory.json', 'utf8') || '[]');
    apps = apps.filter(app => app.title !== appDataToDelete.title || app.address !== appDataToDelete.address);
    fs.writeFileSync('appDirectory.json', JSON.stringify(apps, null, 2), 'utf8');
}