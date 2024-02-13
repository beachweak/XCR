function getProfilePath() {
    return path.join(__dirname, 'profileInfo.json');
}

function loadAndApplyProfileSettings() {
    const profilePath = getProfilePath();
    if (fs.existsSync(profilePath)) {
        const profile = JSON.parse(fs.readFileSync(profilePath, 'utf8'));
        applyProfileSettings(profile);
    }
}

function applyProfileSettings(profile) {
    const bodyStyle = document.body.style;
    if (profile.backgroundColor) bodyStyle.backgroundColor = profile.backgroundColor;
    if (profile.backgroundImage) bodyStyle.backgroundImage = `url(${profile.backgroundImage})`;
    
    const banner = document.getElementById('banner');
    const navbar = document.getElementById('navbar');
    if (banner && profile.bannerColor) banner.style.backgroundColor = profile.bannerColor;
    if (navbar && profile.navbarColor) navbar.style.backgroundColor = profile.navbarColor;

    // Handle profile picture
    const profilePictureElement = document.getElementById('profile-picture');
    if (profilePictureElement && profile.image) {
        profilePictureElement.style.backgroundImage = `url(${profile.image})`;
    }

    // Handle profile name
    const nameElement = document.getElementById('name');
    if (nameElement) {
        nameElement.textContent = profile.name || 'User';
    }
}

document.addEventListener('DOMContentLoaded', loadAndApplyProfileSettings);