
// --- 1. LOCAL DATA (Instant Load, No API Delay) ---
const recentSongs = [
    { id: 1, title: "Top 50 - Global", artist: "Daily Updates", img: "./assets/card1img.jpeg", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" }
];

const trendingSongs = [
    { id: 2, title: "Mahiye Jinna Sohna", artist: "Darshan Raval", img: "./assets/card2img.jpeg", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
    { id: 3, title: "Mere Pass Tum Ho", artist: "Lofi Mix", img: "./assets/card3img.jpeg", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
    { id: 4, title: "Leo", artist: "Anirudh Ravichander", img: "./assets/card4img.jpeg", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" }
];

const chartSongs = [
    { id: 5, title: "Top Global Songs", artist: "Weekly Music Charts", img: "./assets/card5img.jpeg", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" },
    { id: 6, title: "Top Indian Songs", artist: "Weekly Music Charts", img: "./assets/card6img.jpeg", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3" },
    { id: 7, title: "Top 50 - Global", artist: "Daily Updates", img: "./assets/card1img.jpeg", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3" }
];

// Combine for search
const allSongs = [...recentSongs, ...trendingSongs, ...chartSongs];

// --- 2. VARIABLES & SELECTORS ---
let audio = new Audio();
let isPlaying = false;
let currentId = null;

const containers = {
    recent: document.getElementById('recent-container'),
    trending: document.getElementById('trending-container'),
    charts: document.getElementById('charts-container')
};

// UPDATED SELECTORS FOR DESIGN UI
const playerTitle = document.querySelector('.song');
const playerArtist = document.querySelector('.singer');
const playerImg = document.querySelector('.album-img');
const playBtn = document.querySelector('.play-pause'); // We must add this class to the icon in HTML
const progressBar = document.querySelector('.progress-bar');
const searchInput = document.getElementById('search-input');
const currentTimeEl = document.querySelector('.curr-time');
const totalTimeEl = document.querySelector('.tot-time');
const playerSection = document.querySelector('.music-player');

// --- 3. RENDER FUNCTIONS (Restores the Full Look) ---
function renderSection(songs, container) {
    if (!container) return;
    container.innerHTML = '';
    songs.forEach(song => {
        const html = `
            <div class="card" data-id="${song.id}" onclick="playMusic(${song.id})">
                <img src="${song.img}" class="card-img" onerror="this.src='./assets/card1img.jpeg'">
                <p class="card-title">${song.title}</p>
                <p class="card-info">${song.artist}</p>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', html);
    });
}

function renderAll() {
    renderSection(recentSongs, containers.recent);
    renderSection(trendingSongs, containers.trending);
    renderSection(chartSongs, containers.charts);
}

// --- 4. PLAYBACK LOGIC ---
// --- 10. LIKED SONGS (Heart System) ---
const likeBtn = document.getElementById('like-btn');
let likedSongsId = []; // Stores IDs of liked songs

// Initialize Liked Songs Playlist
function initLikedSongs() {
    likedSongsId = JSON.parse(localStorage.getItem('likedSongsId')) || [];

    // Ensure "Liked Songs" is in myPlaylists
    const likedPlIndex = myPlaylists.findIndex(pl => pl.name === 'Liked Songs');
    if (likedPlIndex === -1) {
        myPlaylists.unshift({ name: 'Liked Songs', ids: likedSongsId });
        savePlaylists();
    } else {
        myPlaylists[likedPlIndex].ids = likedSongsId;
        savePlaylists();
    }
}

// Update Icon State
function updateLikeIcon(id) {
    if (!likeBtn) return;
    if (likedSongsId.includes(id)) {
        likeBtn.classList.remove('fa-regular');
        likeBtn.classList.add('fa-solid');
        likeBtn.style.color = '#1bd760'; // Green
    } else {
        likeBtn.classList.remove('fa-solid');
        likeBtn.classList.add('fa-regular');
        likeBtn.style.color = 'white';
    }
}

// Toggle Like
if (likeBtn) {
    likeBtn.addEventListener('click', () => {
        if (!currentId) return; // No song playing
        const index = likedSongsId.indexOf(currentId);
        if (index === -1) {
            likedSongsId.push(currentId);
            updateLikeIcon(currentId);
        } else {
            likedSongsId.splice(index, 1);
            updateLikeIcon(currentId);
        }
        localStorage.setItem('likedSongsId', JSON.stringify(likedSongsId));

        // Sync with Playlist "Liked Songs"
        const likedPlIndex = myPlaylists.findIndex(pl => pl.name === 'Liked Songs');
        if (likedPlIndex !== -1) {
            myPlaylists[likedPlIndex].ids = likedSongsId;
            savePlaylists();
            renderPlaylists();
        }
    });
}

// --- 4. PLAYBACK LOGIC ---
window.playMusic = (id) => {
    const song = allSongs.find(s => s.id === id);
    if (!song) return;

    // 1. Update UI IMMEDIATELY
    playerTitle.innerText = song.title;
    playerArtist.innerText = song.artist;
    playerImg.src = song.img;

    // Toggle Icon Class
    playBtn.classList.remove('fa-circle-play');
    playBtn.classList.add('fa-circle-pause');
    playBtn.style.opacity = "1";

    // 2. Audio Logic
    if (currentId === id && isPlaying) {
        audio.pause();
        isPlaying = false;
        playBtn.classList.remove('fa-circle-pause');
        playBtn.classList.add('fa-circle-play');
        playBtn.style.opacity = "0.7";
    } else {
        if (currentId !== id) {
            audio.src = song.src;
            currentId = id;
            // Highlight the card
            highlightCard(id);
        }
        audio.play().catch(e => console.log("Playback error:", e));
        isPlaying = true;
    }

    // 3. Update Heart Status
    updateLikeIcon(id);
}

// Helper function to highlight the active card
function highlightCard(id) {
    // 1. Remove 'active-song' class from ALL cards
    document.querySelectorAll('.card').forEach(card => {
        card.classList.remove('active-song');
    });

    // 2. Add 'active-song' to the clicked card using data-id
    const activeCard = document.querySelector(`.card[data-id="${id}"]`);
    if (activeCard) {
        activeCard.classList.add('active-song');
    }
}

// --- 5. SEARCH LOGIC ---
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        if (query === "") {
            renderAll();
            if (currentId) highlightCard(currentId); // Re-highlight if playing
        } else {
            const filtered = allSongs.filter(s => s.title.toLowerCase().includes(query));
            renderSection(filtered, containers.recent);
            containers.trending.innerHTML = '';
            containers.charts.innerHTML = '';
        }
    });
}

// --- 6. PLAYER EVENTS ---
// Buttons
const shuffleBtn = document.getElementById('shuffle-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const loopBtn = document.getElementById('loop-btn');

let isShuffle = false;
let isLoop = false;

// Play/Pause
if (playBtn) {
    playBtn.addEventListener('click', () => {
        if (currentId) playMusic(currentId);
        else playMusic(allSongs[0].id);
    });
}

// Next Song
function nextSong() {
    if (isShuffle) {
        // Pick random ID
        const randomId = allSongs[Math.floor(Math.random() * allSongs.length)].id;
        playMusic(randomId);
    } else {
        // Find current index
        const currIndex = allSongs.findIndex(s => s.id === currentId);
        const nextIndex = (currIndex + 1) % allSongs.length; // Loop back to start
        playMusic(allSongs[nextIndex].id);
    }
}

// Prev Song
function prevSong() {
    const currIndex = allSongs.findIndex(s => s.id === currentId);
    // If > 2 seconds in, restart song. Else go to prev.
    if (audio.currentTime > 2) {
        audio.currentTime = 0;
    } else {
        const prevIndex = (currIndex - 1 + allSongs.length) % allSongs.length;
        playMusic(allSongs[prevIndex].id);
    }
}

if (nextBtn) nextBtn.addEventListener('click', nextSong);
if (prevBtn) prevBtn.addEventListener('click', prevSong);

// Shuffle Toggle
if (shuffleBtn) {
    shuffleBtn.addEventListener('click', () => {
        isShuffle = !isShuffle;
        if (isShuffle) {
            shuffleBtn.classList.add('control-active');
        } else {
            shuffleBtn.classList.remove('control-active');
        }
    });
}

// Loop Toggle
if (loopBtn) {
    loopBtn.addEventListener('click', () => {
        isLoop = !isLoop;
        if (isLoop) {
            loopBtn.classList.add('control-active');
        } else {
            loopBtn.classList.remove('control-active');
        }
    });
}

// Audio Time Update & Auto-Next
audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressBar.value = progress;
        // Search bar 'fill' effect
        progressBar.style.background = `linear-gradient(to right, #1bd760 ${progress}%, #4d4d4d ${progress}%)`;

        // Update Time Text
        const curMins = Math.floor(audio.currentTime / 60);
        const curSecs = Math.floor(audio.currentTime % 60);
        const totMins = Math.floor(audio.duration / 60);
        const totSecs = Math.floor(audio.duration % 60);

        if (currentTimeEl) currentTimeEl.innerText = `${curMins}:${curSecs < 10 ? '0' : ''}${curSecs}`;
        if (totalTimeEl && !isNaN(audio.duration)) totalTimeEl.innerText = `${totMins}:${totSecs < 10 ? '0' : ''}${totSecs}`;
    }
});

// Audio Ended Event (Crucial for playlist flow)
audio.addEventListener('ended', () => {
    if (isLoop) {
        audio.currentTime = 0;
        audio.play();
    } else {
        nextSong();
    }
});

if (progressBar) {
    progressBar.addEventListener('input', () => {
        const value = progressBar.value;
        audio.currentTime = (value / 100) * audio.duration;
        // Update fill immediately on drag
        progressBar.style.background = `linear-gradient(to right, #1bd760 ${value}%, #4d4d4d ${value}%)`;
    });
}

// --- 7. VOLUME CONTROLS ---
const volBar = document.getElementById('vol-bar');
const volIcon = document.getElementById('vol-icon');
let lastVol = 1; // Default volume (100%)

if (volBar) {
    // Set initial match
    volBar.value = 100;

    volBar.addEventListener('input', (e) => {
        const val = e.target.value;
        audio.volume = val / 100;
        lastVol = audio.volume;

        // Visual Fill
        volBar.style.background = `linear-gradient(to right, #1bd760 ${val}%, #4d4d4d ${val}%)`;

        // Icon Update based on level
        updateVolIcon(val);
    });
}

if (volIcon) {
    volIcon.addEventListener('click', () => {
        if (audio.volume > 0) {
            // Mute
            lastVol = audio.volume; // Save previous volume
            audio.volume = 0;
            volBar.value = 0;
            volBar.style.background = `linear-gradient(to right, #1bd760 0%, #4d4d4d 0%)`;
            volIcon.classList.remove('fa-volume-high', 'fa-volume-low');
            volIcon.classList.add('fa-volume-xmark');
        } else {
            // Unmute (restore last volume)
            // If lastVol was 0 (e.g. they dragged to 0 then clicked mute), default to 50%
            let restore = lastVol > 0 ? lastVol : 0.5;
            audio.volume = restore;
            const val = restore * 100;
            volBar.value = val;
            volBar.style.background = `linear-gradient(to right, #1bd760 ${val}%, #4d4d4d ${val}%)`;
            updateVolIcon(val);
        }
    });
}

function updateVolIcon(val) {
    // Reset classes
    volIcon.classList.remove('fa-volume-high', 'fa-volume-low', 'fa-volume-xmark');

    if (val == 0) {
        volIcon.classList.add('fa-volume-xmark');
    } else if (val < 50) {
        volIcon.classList.add('fa-volume-low');
    } else {
        volIcon.classList.add('fa-volume-high');
    }
}

// --- 8. PLAYLIST LOGIC (Advanced: Songs & Context Menu) ---
const createPlaylistBtn = document.getElementById('create-playlist-btn');
const playlistContainer = document.getElementById('user-playlists');

// Schema: { name: "Name", ids: [1, 2] }
// Migration: If we find strings, convert them.
let stored = JSON.parse(localStorage.getItem('myPlaylists')) || [];
let myPlaylists = stored.map(item => {
    if (typeof item === 'string') return { name: item, ids: [] };
    return item;
});

// Save Helper
const savePlaylists = () => localStorage.setItem('myPlaylists', JSON.stringify(myPlaylists));

function renderPlaylists() {
    if (!playlistContainer) return;
    playlistContainer.innerHTML = '';
    myPlaylists.forEach((pl, index) => {
        const div = document.createElement('div');
        div.className = 'nav-options';
        div.style.paddingLeft = '0';
        div.style.height = '2rem';
        div.style.display = 'flex';
        div.style.alignItems = 'center';
        div.innerHTML = `
            <a href="#" style="font-size: 0.9rem; margin-left: 0; flex:1;" onclick="openPlaylist(${index})">${pl.name}</a>
            <span style="font-size: 0.7rem; opacity: 0.5; margin-right: 10px;">${pl.ids.length} songs</span>
            <i class="fa-solid fa-trash" style="font-size: 0.8rem; cursor: pointer; opacity: 0.5;" 
               onclick="deletePlaylist(${index})" title="Delete Playlist"></i>
        `;
        playlistContainer.appendChild(div);
    });
}

// Open Playlist (Filter View)
window.openPlaylist = (index) => {
    const pl = myPlaylists[index];
    const playlistSongs = pl.ids.map(id => allSongs.find(s => s.id === id)).filter(Boolean);

    // Clear other containers
    containers.trending.innerHTML = '';
    containers.charts.innerHTML = '';

    // Render in 'Recent' (or a main area)
    const titleHeader = document.querySelector('h2');
    if (titleHeader) titleHeader.innerText = pl.name;

    if (playlistSongs.length === 0) {
        containers.recent.innerHTML = '<p style="padding:1rem;">This playlist is empty. Right-click a song to add it!</p>';
    } else {
        renderSection(playlistSongs, containers.recent);
    }
}

// Add Playlist - INSTANT (No Popup)
if (createPlaylistBtn) {
    createPlaylistBtn.addEventListener('click', () => {
        const name = `My Playlist ${myPlaylists.length + 1}`;
        myPlaylists.push({ name: name, ids: [] });
        savePlaylists();
        renderPlaylists();
    });
}

// Delete Playlist - INSTANT (No Confirm)
window.deletePlaylist = (index) => {
    myPlaylists.splice(index, 1);
    savePlaylists();
    renderPlaylists();
    // If we were viewing it, reset to home? Optional.
    renderAll();
}

// --- CONTEXT MENU (Right Click) ---
const contextMenu = document.createElement('div');
contextMenu.className = 'context-menu';
document.body.appendChild(contextMenu);

let contextMenuTargetId = null;

// Global click to close menu
document.addEventListener('click', () => {
    contextMenu.style.display = 'none';
});

// Attach Context Menu Logic to Cards
// We need to re-attach this every time we render cards. 
// So let's override 'renderSection' slightly or just use event delegation.
// Event Delegation on Containers:
[containers.recent, containers.trending, containers.charts].forEach(cont => {
    if (!cont) return;
    cont.addEventListener('contextmenu', (e) => {
        const card = e.target.closest('.card');
        if (card) {
            e.preventDefault();
            const id = parseInt(card.dataset.id);
            contextMenuTargetId = id;
            showContextMenu(e.pageX, e.pageY);
        }
    });
});

function showContextMenu(x, y) {
    contextMenu.innerHTML = '';

    // Header
    const header = document.createElement('div');
    header.className = 'context-menu-item';
    header.style.cursor = 'default';
    header.style.opacity = '0.7';
    header.style.borderBottom = '1px solid #444';
    header.innerText = 'Add to Playlist';
    contextMenu.appendChild(header);

    if (myPlaylists.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'context-menu-item';
        empty.innerText = '(No playlists)';
        contextMenu.appendChild(empty);
    } else {
        myPlaylists.forEach((pl, index) => {
            const item = document.createElement('div');
            item.className = 'context-menu-item';
            item.innerText = pl.name;
            item.onclick = () => addToPlaylist(index, contextMenuTargetId);
            contextMenu.appendChild(item);
        });
    }

    contextMenu.style.left = `${x}px`;
    contextMenu.style.top = `${y}px`;
    contextMenu.style.display = 'block';
}

function addToPlaylist(playlistIndex, songId) {
    const pl = myPlaylists[playlistIndex];
    if (!pl.ids.includes(songId)) {
        pl.ids.push(songId);
        savePlaylists();
        renderPlaylists(); // Update count
        alert(`Added to ${pl.name}`);
    } else {
        alert('Song already in playlist!');
    }
}

// --- 9. KEYBOARD SHORTCUTS ---
document.addEventListener('keydown', (e) => {
    // Ignore if typing in search input or other text fields
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    switch (e.code) {
        case 'Space':
            e.preventDefault(); // Prevent scroll
            if (currentId) {
                // Toggle Play/Pause mechanism
                if (isPlaying) {
                    audio.pause();
                    isPlaying = false;
                    playBtn.classList.remove('fa-circle-pause');
                    playBtn.classList.add('fa-circle-play');
                    playBtn.style.opacity = "0.7";
                } else {
                    audio.play();
                    isPlaying = true;
                    playBtn.classList.remove('fa-circle-play');
                    playBtn.classList.add('fa-circle-pause');
                    playBtn.style.opacity = "1";
                }
            } else {
                // If nothing played yet, play first
                playMusic(allSongs[0].id);
            }
            break;

        case 'ArrowRight':
            e.preventDefault();
            audio.currentTime = Math.min(audio.currentTime + 5, audio.duration || 0);
            updateProgressBar(); // Helper to sync UI
            break;

        case 'ArrowLeft':
            e.preventDefault();
            audio.currentTime = Math.max(audio.currentTime - 5, 0);
            updateProgressBar();
            break;

        case 'ArrowUp':
            e.preventDefault();
            const newVolUp = Math.min(audio.volume + 0.1, 1);
            audio.volume = newVolUp;
            syncVolumeUI(newVolUp);
            break;

        case 'ArrowDown':
            e.preventDefault();
            const newVolDown = Math.max(audio.volume - 0.1, 0);
            audio.volume = newVolDown;
            syncVolumeUI(newVolDown);
            break;
    }
});

function updateProgressBar() {
    if (progressBar && audio.duration) {
        const val = (audio.currentTime / audio.duration) * 100;
        progressBar.value = val;
        progressBar.style.background = `linear-gradient(to right, #1bd760 ${val}%, #4d4d4d ${val}%)`;
    }
}

function syncVolumeUI(vol) {
    if (volBar) {
        const val = vol * 100;
        volBar.value = val;
        volBar.style.background = `linear-gradient(to right, #1bd760 ${val}%, #4d4d4d ${val}%)`;
        updateVolIcon(val);
    }
}

// --- 11. AUDIO VISUALIZER (Simulated) ---
const visualizerBars = document.querySelectorAll('#visualizer .bar');
let visualizerInterval = null;

function startVisualizer() {
    if (visualizerInterval) clearInterval(visualizerInterval);
    visualizerInterval = setInterval(() => {
        visualizerBars.forEach(bar => {
            // Random height between 10% and 100%
            const height = Math.floor(Math.random() * 90) + 10;
            bar.style.height = `${height}%`;
        });
    }, 100); // 100ms beat
}

function stopVisualizer() {
    if (visualizerInterval) {
        clearInterval(visualizerInterval);
        visualizerInterval = null;
    }
    // Reset to low
    visualizerBars.forEach(bar => {
        bar.style.height = '10%';
    });
}

// Hook into Play/Pause logic 
// (We could modify playMusic again, or simpler: just check isPlaying in a separate sensitive loop? 
//  No, better to patch the existing audio events).

// We'll attach to the 'play' and 'pause' events of the AUDIO element directly for robustness.
audio.addEventListener('play', startVisualizer);
audio.addEventListener('pause', stopVisualizer);
audio.addEventListener('ended', stopVisualizer);

// --- INIT ---
initLikedSongs();
savePlaylists(); // Save migration if happened
renderPlaylists();
renderAll();
