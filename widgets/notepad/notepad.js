window.onload = function () {
    let notepadData = localStorage.getItem('notepad_data') ||
        document.cookie.replace(/(?:(?:^|.*;\s*)notepad_data\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    document.getElementById('notepad').value = notepadData || '';

    let notepad = document.getElementById('notepad');
    notepad.addEventListener('input', saveNotepadData);
    notepad.addEventListener('change', saveNotepadData);

    function saveNotepadData(event) {
        localStorage.setItem('notepad_data', event.target.value);

        let d = new Date();
        d.setTime(d.getTime() + (7 * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = 'notepad_data' + '=' + event.target.value + ';' + expires + ';path=/';
    }
};

document.getElementById('openFile').addEventListener('click', function () {
    document.getElementById('fileOpener').click();
});

document.getElementById('fileOpener').addEventListener('change', function (e) {
    const file = e.target.files[0];

    if (!file) {
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const contents = e.target.result;
        document.getElementById('notepad').value = contents;
        saveNotepadData({ target: { value: contents } });
    };
    reader.readAsText(file);
});
