const fs = require('fs');
const path = require('path');

function getProfilePath() {
    return path.join(__dirname, 'profileInfo.json');
}

function loadProfile() {
    const profilePath = getProfilePath();
    if (fs.existsSync(profilePath)) {
        const profile = JSON.parse(fs.readFileSync(profilePath, 'utf8'));
        if (document.getElementById('name')) {
            document.getElementById('name').textContent = profile.name || "User";
        }
        updateProfileStyle(profile);
        const imageUrl = profile.image || 'icon.png';
        updateProfilePicture('profile-picture', imageUrl); // Update small profile picture
        updateProfilePicture('largeProfilePicture', imageUrl); // Update large profile picture
    }
}

function updateProfilePicture(elementId, imageUrl) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.backgroundImage = `url(${imageUrl})`;
    }
}

function updateProfileStyle(profile) {
    const bodyStyle = document.body.style;
    if (profile.backgroundColor) bodyStyle.backgroundColor = formatColor(profile.backgroundColor);
    if (profile.backgroundImage) bodyStyle.backgroundImage = `url(${profile.backgroundImage})`;
    if (profile.bannerColor && document.getElementById('banner')) {
        document.getElementById('banner').style.backgroundColor = formatColor(profile.bannerColor);
    }
    if (profile.navbarColor && document.getElementById('navbar')) {
        document.getElementById('navbar').style.backgroundColor = formatColor(profile.navbarColor);
    }
}

function formatColor(color) {
    return color.startsWith('#') ? color : `#${color}`;
}

function resetProfile() {
    const defaultProfile = {
        name: "User",
        image: "images/icon.png",
        backgroundColor: "",
        backgroundImage: "",
        navbarColor: "",
        bannerColor: ""
    };
    fs.writeFileSync(getProfilePath(), JSON.stringify(defaultProfile));
    loadProfile();
}

window.addEventListener('DOMContentLoaded', (event) => {
    loadProfile();

    const settingsContent = document.getElementById('settingsContent');
    
    if (settingsContent) {
        document.getElementById('profileBtn').addEventListener('click', () => {
            settingsContent.innerHTML = `
                <div>
                    <h2>Name</h2>
                    <input type="text" id="nameInput">
                    <button id="submitName">Submit</button>
                    
                    <h2>Profile Picture</h2>
                    <input type="text" id="imageInput" placeholder="Image URL">
                    <button id="submitImage">Submit</button>
                </div>
                <div id="largeProfilePicture" class="profile-picture"></div>
            `;
            const profile = JSON.parse(fs.readFileSync(getProfilePath(), 'utf8'));
            updateProfilePicture('largeProfilePicture', profile.image || 'images/icon.png');

            document.getElementById('submitName').addEventListener('click', () => {
                const newName = document.getElementById('nameInput').value;
                const currentProfile = JSON.parse(fs.readFileSync(getProfilePath(), 'utf8'));
                currentProfile.name = newName;
                fs.writeFileSync(getProfilePath(), JSON.stringify(currentProfile));
                loadProfile();
            });

            document.getElementById('submitImage').addEventListener('click', () => {
                const newImage = document.getElementById('imageInput').value;
                const currentProfile = JSON.parse(fs.readFileSync(getProfilePath(), 'utf8'));
                currentProfile.image = newImage;
                fs.writeFileSync(getProfilePath(), JSON.stringify(currentProfile));
                loadProfile();
                updateProfilePicture('largeProfilePicture', newImage);
                updateProfilePicture('profile-picture', newImage); // Update small profile picture
            });
        });

        document.getElementById('themeSettingsBtn').addEventListener('click', () => {
            settingsContent.innerHTML = `
                <div style="display: flex; justify-content: center;">
                    <div style="flex: 1;">
                        <h2>Background Color</h2>
                        <input type="text" id="backgroundColorInput" placeholder="e.g., #ffffff">
                        <button id="submitBackgroundColor">Submit</button>
                        
                        <h2>Background Image</h2>
                        <input type="text" id="backgroundImageInput" placeholder="Image URL">
                        <button id="submitBackgroundImage">Submit</button>
                        
                        <h2>Banner Color</h2>
                        <input type="text" id="bannerColorInput" placeholder="e.g., #123456">
                        <button id="submitBannerColor">Submit</button>
                    </div>
        
                    <div style="flex: 1; display: flex; flex-direction: column; justify-content: flex-start; align-items: center;">
                        <div style="text-align: left;">
                            <h2>Navbar Color</h2>
                            <div style="display: flex; align-items: center;">
                                <input type="text" id="navbarColorInput" placeholder="e.g., #654321" style="margin-right: 8px;">
                                <button id="submitNavbarColor">Submit</button>
                            </div>
                        </div>
                    </div>
        
                    <div style="flex: 1;">
                        <!-- Placeholder for future settings or for symmetry -->
                    </div>
                </div>
            `;

            document.getElementById('submitBackgroundColor').addEventListener('click', () => {
                const color = document.getElementById('backgroundColorInput').value;
                const currentProfile = JSON.parse(fs.readFileSync(getProfilePath(), 'utf8'));
                currentProfile.backgroundColor = formatColor(color);
                fs.writeFileSync(getProfilePath(), JSON.stringify(currentProfile));
                loadProfile();
            });

            document.getElementById('submitBackgroundImage').addEventListener('click', () => {
                const imageUrl = document.getElementById('backgroundImageInput').value;
                const currentProfile = JSON.parse(fs.readFileSync(getProfilePath(), 'utf8'));
                currentProfile.backgroundImage = imageUrl;
                fs.writeFileSync(getProfilePath(), JSON.stringify(currentProfile));
                loadProfile();
            });

            document.getElementById('submitBannerColor').addEventListener('click', () => {
                const color = document.getElementById('bannerColorInput').value;
                const currentProfile = JSON.parse(fs.readFileSync(getProfilePath(), 'utf8'));
                currentProfile.bannerColor = formatColor(color);
                fs.writeFileSync(getProfilePath(), JSON.stringify(currentProfile));
                loadProfile();
            });

            document.getElementById('submitNavbarColor').addEventListener('click', () => {
                const color = document.getElementById('navbarColorInput').value;
                const currentProfile = JSON.parse(fs.readFileSync(getProfilePath(), 'utf8'));
                currentProfile.navbarColor = formatColor(color);
                fs.writeFileSync(getProfilePath(), JSON.stringify(currentProfile));
                loadProfile();
            });
        });

        document.getElementById('userDataBtn').addEventListener('click', () => {
            settingsContent.innerHTML = `
                <div>
                    <h2>Reset Data</h2>
                    <button id="confirmResetDataBtn">Confirm</button>
                </div>
            `;
            document.getElementById('confirmResetDataBtn').addEventListener('click', resetProfile);
        });
        document.getElementById('profileBtn').click();
    }
});