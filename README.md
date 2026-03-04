# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Social Media React App

> A simple social media feed application built with React and Vite.

## Features

- View a list of posts with title, body, tags, and reactions
- Create a new post with user ID, title, body, tags, and reactions
- Delete posts
- Responsive UI with Bootstrap styling
- Sidebar navigation and header/footer components

## Tech Stack

- [React 19](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Bootstrap 5](https://getbootstrap.com/)
- [React Icons](https://react-icons.github.io/react-icons/)
- [ESLint](https://eslint.org/) for linting

## Project Structure

```
social-media/
├── public/
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   ├── assets/
│   ├── components/
│   │   ├── CreatePost.jsx
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── Post.jsx
│   │   ├── PostList.jsx
│   │   ├── Sidebar.jsx
│   └── store/
│       └── post-list-store.jsx
├── index.html
├── package.json
├── vite.config.js
├── eslint.config.js
└── README.md
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository:
   ```sh
   git clone <repo-url>
   cd social-media
   ```
2. Install dependencies:
   ```sh
   npm install
   # or
   yarn install
   ```

### Running the App

Start the development server:

```sh
npm run dev
# or
yarn dev
```

The app will be available at [http://localhost:5173](http://localhost:5173) by default.

### Build for Production

```sh
npm run build
# or
yarn build
```

### Linting

```sh
npm run lint
# or
yarn lint
```

## Usage

- **Home Tab:** View all posts. Each post displays its title, body, tags, and number of reactions. You can delete a post using the trash icon.
- **Create Post Tab:** Add a new post by filling out the form. Enter user ID, title, body, tags (space-separated), and reactions count.

## Folder Details

- `src/components/` – UI components (Header, Footer, Sidebar, Post, PostList, CreatePost)
- `src/store/post-list-store.jsx` – React context and reducer for managing post state
- `src/App.jsx` – Main app component with routing between Home and Create Post

## License

This project is licensed under the MIT License.
