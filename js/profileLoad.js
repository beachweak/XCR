const os = require('os');

function getProfilePath() {
    const appDataPath = path.join(os.homedir(), '.yourAppName');
    if (!fs.existsSync(appDataPath)) {
        fs.mkdirSync(appDataPath, { recursive: true });
    }
    return path.join(appDataPath, 'profileInfo.json');
}

function ensureProfileExists() {
    const profilePath = getProfilePath();
    if (!fs.existsSync(profilePath)) {
        const defaultProfile = {
            name: "User",
            image: "images/icon.png",
            backgroundColor: "#ffffff",
            backgroundImage: "",
            navbarColor: "",
            bannerColor: ""
        };
        fs.writeFileSync(profilePath, JSON.stringify(defaultProfile, null, 2), 'utf8');
    }
}

function loadAndApplyProfileSettings() {
    ensureProfileExists();
    const profilePath = getProfilePath();
    const profile = JSON.parse(fs.readFileSync(profilePath, 'utf8'));
    applyProfileSettings(profile);
}

function applyProfileSettings(profile) {
    const bodyStyle = document.body.style;
    if (profile.backgroundColor) bodyStyle.backgroundColor = profile.backgroundColor;
    if (profile.backgroundImage) bodyStyle.backgroundImage = `url(${profile.backgroundImage})`;

    const banner = document.getElementById('banner');
    const navbar = document.getElementById('navbar');
    if (banner && profile.bannerColor) banner.style.backgroundColor = profile.bannerColor;
    if (navbar && profile.navbarColor) navbar.style.backgroundColor = profile.navbarColor;

    const profilePictureElement = document.getElementById('profile-picture');
    if (profilePictureElement && profile.image) {
        profilePictureElement.style.backgroundImage = `url(${profile.image})`;
    }

    const nameElement = document.getElementById('name');
    if (nameElement) {
        nameElement.textContent = profile.name || 'User';
    }
}

document.addEventListener('DOMContentLoaded', loadAndApplyProfileSettings);