# SocialSphere — Modern React 19 Social Media Platform

[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.3.1-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.8-7952B3?logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **SocialSphere** is a modern, responsive social media web application built with **React 19**, **Vite**, and an ultra-refined **glassmorphic dark UI**. It features dynamic feeds, interactive posts, 24-hour ephemeral stories, real-time simulated messaging, customizable user profiles, and contextual search.

---

## 📸 Overview & Key Highlights

SocialSphere brings together essential social platform mechanics with fluid micro-interactions and contemporary aesthetics:

- 🌟 **Dynamic Multi-Tab Feed**: Seamlessly toggle between *For You*, *Trending*, *Following*, and *Bookmarks* views.
- ⚡ **24-Hour Ephemeral Stories**: Interactive stories carousel with multi-segment timed progress bars, pause on hold/hover, like reactions, and a custom story creator.
- 💬 **Omnipresent Messaging System**: Full-page `/Messages` conversation center plus a dockable floating chat drawer for messaging from any view.
- 👤 **Customizable User Profile**: Live profile editor with customizable bio, avatar seeds ([DiceBear](https://dicebear.com/)), banner wallpapers, follower statistics, and persistent `localStorage` support.
- 🔍 **Real-Time Global Search & Tag Filtering**: Instant search across post titles, bodies, authors, and hashtags with filter pills.
- 🪄 **Interactive Post Engagements**: Animated heart likes, reposting, bookmarks, expandable threaded comments with live reply input, and post deletion.
- 🎨 **Glassmorphism Design System**: Dark OLED palette (`#0f0f1a`), vibrant indigo-violet-cyan gradients, backdrop-blur surfaces, and custom-styled scrollbars.

---

## ✨ Features in Detail

### 1. 📰 Feed & Post Interactions
- **Infinite Pagination**: Load more posts on demand with animated loading skeletons and smooth transitions.
- **Quick Compose**: Share thoughts instantly directly from the top of the feed without leaving the page.
- **Dedicated Create Post Page**: Full-screen post creation with title, body, hashtag generation, mood tag selection, and live image URL preview.
- **Threaded Commenting**: Expand comments on any post, view timestamps, and post replies with live feedback.
- **Toast Feedback System**: Real-time toast notifications for actions like publishing, liking, bookmarking, and deleting posts.

### 2. ⏳ Ephemeral Stories
- **Stories Bar**: Horizontal scrollable stories shelf with unread gradient rings and creator avatars.
- **Interactive Story Viewer**: Fullscreen modal with auto-advancing slides, multi-segment progress timers, tap-to-skip, hover/press-to-pause, and direct message reply shortcuts.
- **Story Creator Modal**: Upload image URLs or generate dynamic gradient slides with custom tags and captions.

### 3. 💬 Direct Messaging & Chat Drawer
- **Full-Page Messages View**: Multi-conversation thread list, message history, timestamp formatting, active search, and unread badges.
- **Floating Chat Drawer**: Collapsible floating widget at the bottom-right corner of every screen with unread indicators and quick messaging capabilities.
- **Simulated Real-Time Replies**: Automated intelligent responses simulate live conversation for an engaging demo experience.

### 4. 👤 Profile & Activity Hub
- **Profile Customization**: Edit display name, handle, bio, location, and website with immediate `localStorage` persistence.
- **Avatar & Banner Presets**: Switch between multiple DiceBear avatar styles and Unsplash gradient wallpapers.
- **Activity Metrics**: Live counts for authored posts, bookmarks, likes received, followers, and following.
- **Segmented History**: Tabbed browsing for authored posts, liked posts, saved bookmarks, and media.

### 5. 🧭 Explore & Discover Sidebar
- **Trending Topics**: Live hashtags with post counts and click-to-filter functionality.
- **Who to Follow**: Recommended creators with interactive follow/unfollow states.
- **Network Status**: Platform activity counters and system status indicator.

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **React 19** | Modern UI library utilizing Context API, `useReducer`, and modern hooks |
| **Vite 7** | Ultra-fast development server and optimized build tool |
| **Bootstrap 5** | Responsive layout scaffolding and utility primitives |
| **React Icons** | Iconography from Feather, Remix, Bootstrap, and Ionicons libraries |
| **DiceBear API** | Dynamic SVG avatar generation |
| **CSS3 Glassmorphism** | Custom dark mode design tokens, backdrop filters, and keyframe animations |
| **ESLint 9** | Code quality and linting |

---

## 📁 Project Structure

```
social-media/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/                 # Static media and assets
│   ├── components/             # Reusable UI components
│   │   ├── CreatePost.jsx      # Dedicated full-page post creator
│   │   ├── CreateStoryModal.jsx# Modal to publish image or gradient stories
│   │   ├── FloatingChatDrawer.jsx # Global dockable floating messenger
│   │   ├── Footer.jsx          # App footer with copyright and navigation links
│   │   ├── Header.jsx          # Sticky header with search bar and user menu
│   │   ├── LoadingSpinner.jsx  # Loading state spinner and skeletons
│   │   ├── MessagesView.jsx    # Full-screen conversation center
│   │   ├── Post.jsx            # Individual post card with comments & reactions
│   │   ├── PostList.jsx        # Feed with stories, tabs, filters, and pagination
│   │   ├── QuickCompose.jsx    # Inline quick post composer for the feed
│   │   ├── RightSidebar.jsx    # Trending hashtags, creator suggestions & stats
│   │   ├── Sidebar.jsx         # Left navigation sidebar with active tab links
│   │   ├── StoriesBar.jsx      # Horizontal carousel of active user stories
│   │   ├── StoryViewerModal.jsx# Fullscreen timed story player modal
│   │   ├── Toast.jsx           # Global toast notification container & context
│   │   ├── UserProfile.jsx     # Profile dashboard with edit modal & tabs
│   │   └── WelcomeMessage.jsx  # Zero-state empty feed placeholder
│   ├── store/                  # Global Context state management
│   │   ├── ChatContext.jsx     # Direct messaging, conversations & bot replies
│   │   ├── post-list-store.jsx # Posts, likes, reposts, comments, and filters
│   │   ├── SearchContext.jsx   # Global search input & query provider
│   │   ├── StoriesContext.jsx  # Stories data, active slides, timer & views
│   │   └── UserProfileContext.jsx # Profile information & local storage sync
│   ├── App.css                 # Comprehensive glassmorphic stylesheet & animations
│   ├── App.jsx                 # App root layout, routing, and context wrappers
│   └── main.jsx                # React application entry point
├── index.html                  # HTML entry point with Inter font & meta tags
├── package.json                # Project dependencies and npm scripts
├── vite.config.js              # Vite bundler configuration
├── eslint.config.js            # ESLint rules and plugins configuration
└── README.md                   # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v9.0.0 or higher) or **yarn** / **pnpm**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/shubhamax7/social-media.git
   cd social-media
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

### Running Locally

Start the Vite local development server:

```bash
npm run dev
```

Open your browser and navigate to [http://localhost:5173](http://localhost:5173).

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server with Hot Module Replacement (HMR). |
| `npm run build` | Bundles the application for production in the `dist/` directory. |
| `npm run preview` | Locally serves the production build to preview performance and assets. |
| `npm run lint` | Runs ESLint to inspect codebase for syntax and style issues. |

---

## 🧠 State Architecture

SocialSphere organizes application state into modular, decoupled React Context providers:

```
<PostListProvider>          // Feed items, likes, bookmarks, comment threads
  <UserProfileProvider>     // User profile, bio, avatars, local storage
    <SearchProvider>        // Global search query, tag filtering
      <ChatProvider>        // Conversations, unread badges, simulated responses
        <StoriesProvider>   // Active stories, progression timer, seen states
          <ToastProvider>   // Interactive notifications across components
            <App />
          </ToastProvider>
        </StoriesProvider>
      </ChatProvider>
    </SearchProvider>
  </UserProfileProvider>
</PostListProvider>
```

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.
