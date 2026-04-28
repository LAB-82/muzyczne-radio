async function updateRDS() {
    const display = document.getElementById("trackDisplay");
    if (!display) return;

    // Używamy AllOrigins - to "tunel", który pozwala obejść blokady bezpieczeństwa przeglądarki
    const proxy = "https://api.allorigins.win/get?url=";
    
    // Główne źródło: Muzyczne Radio (Revma Stats)
    const targetUrl = "https://stats.revma.com/v1/stats/s/gzwc1xcq042vv";
    
    try {
        // Dodajemy timestamp (&t=...), żeby przeglądarka nie serwowała starych danych z pamięci
        const response = await fetch(`${proxy}${encodeURIComponent(targetUrl)}&t=${Date.now()}`);
        
        if (!response.ok) throw new Error('Błąd połączenia');

        const data = await response.json();
        
        // Dane z AllOrigins przychodzą w polu .contents jako tekst (JSON string)
        const stats = JSON.parse(data.contents);

        if (stats && stats.current_track && stats.current_track.title) {
            let title = stats.current_track.title.toUpperCase();
            
            // Usuwamy nazwę radia z tytułu, jeśli tam jest
            title = title.replace("MUZYCZNE RADIO - ", "").trim();

            display.innerText = "+++ " + title + " +++";
            
            // Logika animacji: jeśli tekst jest długi, dodajemy klasę marquee
            if (title.length > 25) {
                display.classList.add("marquee");
            } else {
                display.classList.remove("marquee");
            }
        } else {
            throw new Error('Brak tytułu w JSON');
        }

    } catch (error) {
        // Jeśli jest noc i API milczy, albo proxy padło - pokazujemy zegar
        const now = new Date();
        const timeStr = now.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
        display.innerText = `+++ MUZYCZNE RADIO | JELENIA GÓRA | ${timeStr} +++`;
        display.classList.remove("marquee");
        console.log("RDS Sync Info: Tryb zegara (brak danych z serwera)");
    }
}

// Odświeżanie co 20 sekund
setInterval(updateRDS, 20000);
// Pierwsze wywołanie od razu po wejściu na stronę
updateRDS();
