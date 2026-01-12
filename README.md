# Chrollo

<p align="center">
  <img src="./resources/app-logo.png" height="120" alt="Chrollo Logo">
</p>

**Chrollo** is a powerful, modern, open-source tool designed for inspecting, testing, and debugging **WebSocket APIs**. Featuring a modern, user-friendly interface inspired by Postman, Chrollo simplifies the complex process of working with persistent connections, especially STOMP and plain WebSockets.

## ✨ Features

- **🚀 WebSocket & STOMP Support**: Seamlessly connect, send messages, and monitor incoming traffic for both plain WebSockets and STOMP protocols.
- **� Interception Scripts**: Advanced manipulation of WebSocket traffic. Write scripts to intercept, modify, or block messages in real-time before they reach the server or client.
- **�📂 Collection Management**: Organize your workspace with a familiar nested structure of collections and folders.
- **🌍 Environment Variables**: Manage dynamic variables across different environments (Development, Staging, Production).
- **🎨 Modern UI/UX**: A highly responsive, sleek design built with modern aesthetics, featuring dark mode, glassmorphism, and smooth micro-animations.
- **💾 Persistent Storage**: All your collections, environments, and UI preferences (like column visibility) are persisted locally using LevelDB and localStorage.
- **🖥️ Advanced Code Editor**: Full-featured message editing with syntax highlighting, auto-formatting, and linting powered by CodeMirror 6.

## 🛠️ Tech Stack

Chrollo is built with cutting-edge technologies to ensure performance and reliability:

- **Core Framework**: [Electron](https://www.electronjs.org/) & [Vite](https://vitejs.dev/)
- **Frontend Environment**: [React 19](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/)
- **Styling & UI**: [Tailwind CSS v4](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/), and [Lucide Icons](https://lucide.dev/)
- **State Management**: [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)
- **Data Handling**: [TanStack Table v8](https://tanstack.com/table/v8) & [LevelDB](https://github.com/Level/level)
- **Editor Integration**: [CodeMirror 6](https://codemirror.net/)

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v18+) and [pnpm](https://pnpm.io/) installed on your machine.

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/numankaf/chrollo.git
   cd chrollo
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Run in development mode:**
   ```bash
   pnpm dev
   ```

### Building for Production

To create a production-ready package for your current OS:

```bash
pnpm build
```

The output will be found in the `dist` or `out` directory depending on your configuration.

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
