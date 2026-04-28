async function updateRDS() {
    const display = document.getElementById("trackDisplay");
    const proxy = "https://api.allorigins.win/get?url=";
    const sources = [
        "https://stats.revma.com/v1/stats/s/gzwc1xcq042vv",
        "https://onlineradiobox.com/json/pl/muzyczneradio/play"
    ];

    for (let url of sources) {
        try {
            const response = await fetch(`${proxy}${encodeURIComponent(url)}&t=${Date.now()}`);
            const data = await response.json();
            const json = JSON.parse(data.contents);

            let title = json.current_track ? json.current_track.title : json.title;

            if (title && title.length > 3 && !title.toLowerCase().includes("muzyczne radio")) {
                display.innerText = "+++ " + title.toUpperCase() + " +++";
                if (title.length > 25) display.classList.add("marquee");
                else display.classList.remove("marquee");
                return;
            }
        } catch (e) { console.error("Źródło zawiodło:", url); }
    }
    
    // Jeśli nic nie działa - zegar
    const now = new Date().toLocaleTimeString('pl-PL', {hour: '2-digit', minute:'2-digit'});
    display.innerText = `+++ MUZYCZNE RADIO | ${now} +++`;
    display.classList.remove("marquee");
}

// Startuj i odświeżaj co 20s
updateRDS();
setInterval(updateRDS, 20000);
