/**
 * ECHO MUSIC PLAYER - Vanilla JS Core
 * Features: Play/Pause, LocalStorage Playlists, Search Filter, Progress Control
 */

const songs = [
    { id: 0, title: "Bachke Bachke", artist: "Karan Aujla", cover: "img/image.png", url: "songs/bachke.mp3" },
    { id: 1, title: "For A Reason", artist: "Karan Aujla", cover: "img/image2.png", url: "songs/for_a_reason.mp3" },
    { id: 2, title: "Wavy", artist: "Karan Aujla", cover: "img/image3.png", url: "songs/wavy.mp3" },
    { id: 3, title: "52 Bars", artist: "Karan Aujla", cover: "img/image4.png", url: "songs/wavy.mp3" },
    { id: 4, title: "BoyFriend", artist: "Karan Aujla", cover: "img/image5.png", url: "songs/boyfriend.mp3" },
    { id: 5, title: "I Really Do", artist: "Karan Aujla", cover: "image6.png", url: "songs/i_really_do.mp3" },
    { id: 6, title: "Softly", artist: "Karan Aujla", cover: "img/image7.png", url: "songs/softly.mp3" },
    { id: 7, title: "Admirin You", artist: "Karan Aujla", cover: "img/image8.png", url: "songs/admirin.mp3" },
    { id: 8, title: "Winning Speech", artist: "Karan Aujla", cover: "img/image9.png", url: "songs/winning.mp3" },

];
let recentlyPlayed = JSON.parse(localStorage.getItem("recent_songs")) || [];
const recentGrid = document.getElementById("recent-grid");

let currentSongIndex = 0;
let isPlaying = false;
let audio = new Audio();
let playlists = JSON.parse(localStorage.getItem('echo_playlists')) || ["My Favorites"];

// DOM Elements
const songGrid = document.getElementById('song-grid');
const playBtn = document.getElementById('play-pause-btn');
const progressBar = document.getElementById('progress-bar-fill');
const progressContainer = document.getElementById('progress-bar-bg');
const volumeSlider = document.getElementById('volume-slider');
const searchInput = document.getElementById('search-input');

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    renderSongs(songs);
    renderPlaylists();
    loadSong(songs[0]);
    window.addEventListener('DOMContentLoaded', () => {
    renderSongs(songs);
    renderPlaylists();
    loadSong(songs[0]);
    renderRecentlyPlayed();
});
});

// Render Song Cards
function renderSongs(songsToRender) {
    songGrid.innerHTML = '';
    songsToRender.forEach((song, index) => {
        const card = document.createElement('div');
        card.className = 'song-card';
        card.innerHTML = `
            <img src="${song.cover}" alt="${song.title}">
            <h4>${song.title}</h4>
            <p style="color: #b3b3b3; font-size: 13px;">${song.artist}</p>
        `;
        card.onclick = () => {
            currentSongIndex = song.id;
            loadSong(songs[currentSongIndex]);
            playSong();
        };
        songGrid.appendChild(card);
    });
}

// Load & Play Logic
function loadSong(song) {
    audio.src = song.url;
    document.getElementById('now-playing-title').innerText = song.title;
    document.getElementById('now-playing-artist').innerText = song.artist;
    document.getElementById('now-playing-img').src = song.cover;
}

function playSong() {
    isPlaying = true;
    audio.play();
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';

    updateRecentlyPlayed(songs[currentSongIndex]);
}

function pauseSong() {
    isPlaying = false;
    audio.pause();
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
}

// Event Listeners
playBtn.addEventListener('click', () => isPlaying ? pauseSong() : playSong());

document.getElementById('next-btn').addEventListener('click', () => {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(songs[currentSongIndex]);
    playSong();
});

document.getElementById('prev-btn').addEventListener('click', () => {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(songs[currentSongIndex]);
    playSong();
});

// Progress Bar Update
audio.addEventListener('timeupdate', () => {
    const { duration, currentTime } = audio;
    const progressPercent = (currentTime / duration) * 100;
    progressBar.style.width = `${progressPercent}%`;
    
    // Time formatting
    document.getElementById('current-time').innerText = formatTime(currentTime);
    if(duration) document.getElementById('duration').innerText = formatTime(duration);
});

// Seek functionality
progressContainer.addEventListener('click', (e) => {
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
});

function formatTime(time) {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
}

// Volume
volumeSlider.addEventListener('input', (e) => {
    audio.volume = e.target.value;
});

// Search Filter
searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = songs.filter(s => 
        s.title.toLowerCase().includes(term) || 
        s.artist.toLowerCase().includes(term)
    );
    renderSongs(filtered);
});

// Playlists (LocalStorage)
function renderPlaylists() {
    const list = document.getElementById('playlist-list');
    list.innerHTML = playlists.map(p => `
        <div class="nav-item"><i class="fas fa-music"></i> ${p}</div>
    `).join('');
}

document.getElementById('create-playlist').addEventListener('click', () => {
    const name = prompt("Enter playlist name:");
    if(name) {
        playlists.push(name);
        localStorage.setItem('echo_playlists', JSON.stringify(playlists));
        renderPlaylists();
    }
});

// Keyboard Shortcuts
window.addEventListener('keydown', (e) => {
    if(e.code === 'Space') {
        e.preventDefault();
        isPlaying ? pauseSong() : playSong();
    }
});



function updateGreeting() {
  const greetingElement = document.getElementById("greeting");
  const currentHour = new Date().getHours();

  let greetingText = "";

  if (currentHour >= 5 && currentHour < 12) {
    greetingText = "Good Morning ☀️";
  } 
  else if (currentHour >= 12 && currentHour < 17) {
    greetingText = "Good Afternoon 🌤️";
  } 
  else if (currentHour >= 17 && currentHour < 21) {
    greetingText = "Good Evening 🌆";
  } 
  else {
    greetingText = "Good Night 🌙";
  }

  greetingElement.textContent = greetingText;
}

// Run function when page loads
updateGreeting();


function updateRecentlyPlayed(song) {
    // Remove if already exists (to avoid duplicate)
    recentlyPlayed = recentlyPlayed.filter(s => s.id !== song.id);

    // Add to beginning
    recentlyPlayed.unshift(song);

    // Keep only last 3 songs
    if (recentlyPlayed.length > 3) {
        recentlyPlayed.pop();
    }

    // Save to localStorage
    localStorage.setItem("recent_songs", JSON.stringify(recentlyPlayed));

    renderRecentlyPlayed();
}

function renderRecentlyPlayed() {
    recentGrid.innerHTML = "";

    recentlyPlayed.forEach(song => {
        const card = document.createElement("div");
        card.className = "song-card";
        card.innerHTML = `
            <img src="${song.cover}" alt="${song.title}">
            <h4>${song.title}</h4>
            <p style="color: #b3b3b3; font-size: 13px;">${song.artist}</p>
        `;

        card.onclick = () => {
            currentSongIndex = song.id;
            loadSong(song);
            playSong();
        };

        recentGrid.appendChild(card);
    });
}


