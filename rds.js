async function updateRDS() {
    const display = document.getElementById("trackDisplay");
    // Używamy stabilnego proxy
    const proxy = "https://api.allorigins.win/get?url=";
    
    // Lista źródeł: 
    // 1. Muzyczne Radio (Revma) - Twoje główne źródło
    // 2. OpenFM (Testowe) - Nadaje 24/7, idealne do sprawdzenia czy kod działa
    const sources = [
        {
            name: "Muzyczne Radio",
            url: "https://stats.revma.com/v1/stats/s/gzwc1xcq042vv",
            type: "revma"
        },
        {
            name: "OpenFM Test",
            url: "https://open.fm/api/api-ext/v2/channels/6.json", // Kanał Radio Zet dla testu RDS
            type: "openfm"
        }
    ];

    for (let source of sources) {
        try {
            const response = await fetch(`${proxy}${encodeURIComponent(source.url)}&t=${Date.now()}`);
            if (!response.ok) continue;
            
            const data = await response.json();
            const json = JSON.parse(data.contents);
            let title = "";

            if (source.type === "revma") {
                title = json.current_track?.title || "";
            } else if (source.type === "openfm") {
                // Specyficzny format OpenFM dla testu
                const track = json.tracks?.[0];
                if (track) title = `${track.artist} - ${track.title}`;
            }

            // Sprawdzamy czy tekst nie jest "śmieciem" lub nazwą radia
            if (title && title.length > 3 && !title.toLowerCase().includes("muzyczne radio")) {
                display.innerText = "+++ " + title.toUpperCase() + " +++";
                
                // Automatyczny Marquee dla długich nazw
                if (title.length > 25) {
                    display.classList.add("marquee");
                } else {
                    display.classList.remove("marquee");
                }
                return; // Sukces - wychodzimy z funkcji
            }
        } catch (e) {
            console.warn(`Źródło ${source.name} nie odpowiedziało.`);
        }
    }

    // AWARYJNY ZEGAR (jeśli wszystkie źródła milczą)
    const now = new Date().toLocaleTimeString('pl-PL', {hour: '2-digit', minute:'2-digit'});
    display.innerText = `+++ MUZYCZNE RADIO | JELENIA GÓRA | ${now} +++`;
    display.classList.remove("marquee");
}

// Uruchomienie przy starcie
updateRDS();

// Odświeżanie co 20 sekund
setInterval(updateRDS, 20000);
