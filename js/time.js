function updateClock() {
    var now = new Date();
    var hours = now.getHours().toString().padStart(2, '0');
    var minutes = now.getMinutes().toString().padStart(2, '0');
    var seconds = now.getSeconds().toString().padStart(2, '0');

    var timeString = hours + ':' + minutes + ':' + seconds;

    document.getElementById('time').textContent = timeString;

    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var dateString = new Intl.DateTimeFormat('en-US', options).format(now);

    document.getElementById('date').textContent = dateString;
}

// Initial call to set the clock and date
updateClock();

// Update the clock and date every second
setInterval(updateClock, 1000);