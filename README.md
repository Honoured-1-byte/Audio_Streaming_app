# Audio Streaming App (Spotify Clone)

A highly responsive and interactive music streaming web application inspired by Spotify's design. This Single Page Application (SPA) features a robust audio playback engine, dynamic playlist management, and a sleek, dark-themed UI.

## 🚀 Features

*   **Audio Playback Engine:**
    *   Play, Pause, Next, Previous controls.
    *   Shuffle and Repeat (Loop) functionality.
    *   Real-time progress bar (seekable) and volume control.
    *   Simulated Audio Visualizer.
*   **Playlist Management:**
    *   **Create & Delete Playlists:** Users can manage their own custom playlists.
    *   **Context Menu System:** Right-click any song to add it to a specific playlist.
    *   **Persistence:** All playlists and "Liked Songs" are saved locally using `LocalStorage`, so you don't lose your data on refresh.
*   **Dynamic UI:**
    *   Responsive Sidebar and Main Content area.
    *   Hover effects and transitions for a premium feel.
    *   "Liked Songs" heart system that syncs across the app.
*   **Search Functionality:**
    *   Real-time filtering of songs by title.

## 🛠️ Tech Stack

*   **HTML5:** Semantic structure.
*   **CSS3:** Flexbox/Grid for layout, Custom variables, specific styling for scrollbars and inputs.
*   **JavaScript (ES6+):**
    *   `Audio()` API for playback.
    *   `LocalStorage` API for data persistence.
    *   DOM manipulation for dynamic rendering.

## 📂 Project Structure

```
/
├── assets/              # Icons and Images used in the UI
├── index.html     # Main entry point
├── style.css      # All styling logic
├── app.js         # Core application logic
└── README.md            # Project documentation
```

## 💿 How to Run

1.  Clone the repository:
    ```bash
    git clone https://github.com/Honoured-1-byte/Audio_Streaming_app.git
    ```
2.  Navigate to the directory.
3.  Open `index.html` in your browser.

## 🔮 Future Improvements

*   Integration with a real backend (Node.js/Express) for cloud storage.
*   User Authentication.
*   Mobile-specific view optimizations.

---
*Built with ❤️ by [Honoured-1-byte]*
