const fs = require('fs');
const { net } = require('electron');
const path = require('path');

// Function to determine the app data folder path
function getAppDataPath() {
    const appDataPath = path.join(os.homedir(), '.XCR');
    // Create the directory if it does not exist
    if (!fs.existsSync(appDataPath)) {
        fs.mkdirSync(appDataPath, { recursive: true });
    }
    return appDataPath;
}

// Function to get the full path of appDirectory.json
function getAppDirectoryPath() {
    return path.join(getAppDataPath(), 'appDirectory.json');
}

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
    const appData = { title, address, faviconUrl: faviconUrl || 'path/to/default/icon.png' };
    saveApp(appData);
    createAppEntry(appData);

    document.getElementById('appTitle').value = '';
    document.getElementById('appAddress').value = '';
    document.getElementById('appFormContainer').style.display = 'none';
});

function saveApp(appData) {
    let apps = JSON.parse(fs.readFileSync(getAppDirectoryPath(), 'utf8') || '[]');
    apps.push(appData);
    fs.writeFileSync(getAppDirectoryPath(), JSON.stringify(apps, null, 2), 'utf8');
}

window.onload = function() {
    loadApps();
};

function createAppEntry(appData) {
    const appContainer = document.createElement('div');
    appContainer.classList.add('app-entry');
    
    const icon = new Image();
    icon.src = appData.faviconUrl;
    icon.onerror = () => icon.src = 'path/to/default/icon.png';
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
    let apps;
    try {
        apps = JSON.parse(fs.readFileSync(getAppDirectoryPath(), 'utf8'));
    } catch (error) {
        if (error.code === 'ENOENT') {
            // The file does not exist. You may log this info or handle it as needed
            console.log('App directory file does not exist, creating a new one.');
            apps = []; // Initialize with an empty list
            // Optionally, you can create an empty file here
            fs.writeFileSync(getAppDirectoryPath(), JSON.stringify(apps, null, 2), 'utf8');
        } else {
            throw error; // An unexpected error occurred, rethrow it
        }
    }
    
    apps.forEach(appData => {
        createAppEntry(appData);
    });
}

function deleteApp(appDataToDelete) {
    let apps = JSON.parse(fs.readFileSync(getAppDirectoryPath(), 'utf8') || '[]');
    apps = apps.filter(app => app.title !== appDataToDelete.title || app.address !== appDataToDelete.address);
    fs.writeFileSync(getAppDirectoryPath(), JSON.stringify(apps, null, 2), 'utf8');
}