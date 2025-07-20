# Scope WS Inspector

**Scope WS Inspector** is a Postman-like tool for inspecting, testing, and debugging **WebSocket APIs**, built specifically for the **SCOPE Platform**. It supports both **web** and **desktop** environments using **React** and **Electron.js**.

## 🧩 Purpose

This app aims to provide an intuitive interface to:

- Test WebSocket endpoints
- Send/receive real-time messages
- Replay or script WebSocket workflows
- Debug requests and payloads within the SCOPE ecosystem

## 🚀 Tech Stack

- **Frontend**: React (with Vite)
- **Desktop**: Electron.js
- **State Management**: Zustand
- **Protocol Support**: WebSocket (WSS/WS)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI

## 📦 Goals

- 🧪 WebSocket API Testing
- 🧭 Real-time Message Inspector
- 💾 Collection & History Management (like Postman)
- 🗂️ Project-based Workspace (support SCOPE context)
- 🔌 Custom Headers & Authentication
- ⚡ Hot-reloading UI & message stream
- 🌐 Web/Desktop compatibility (PWA + Electron build)
- 📡 Subscribe / Unsubscribe to Message & Event Topics

## 📦 Planned Features

- 🗂️ **Workspaces**: Organize collections, environments, and history per workspace
- 🧪 **WebSocket Testing**: Connect, send, and receive messages over ws/wss
- 📦 **Collections**: Group and save reusable requests
- 🌎 **Environments**: Define variables (host, token, etc.) for different contexts
- 📜 **Request Documentation**: Add notes or metadata to saved requests
- 🔁 **Import / Export Collections**: JSON-based format for sharing or backup
- 🧾 **Request & Response Mappers**: Transform data before sending or after receiving
- 🧠 **Request History**: Automatically store recent messages
- 📋 **Console View**: Log sent/received messages and system events
- 🎨 **Responsive UI**: Sidebar, topbar, tabs, themes
- 🌐 **Web/Desktop Support**: React + Electron (PWA + desktop build)

## 📅 Roadmap

### 🛠️ Initial Setup

- [ ] Initialize project with **React + Vite**
- [ ] Set up **Electron.js** for desktop
- [ ] Configure shared codebase for web & desktop
- [ ] Setup basic routing & file structure

### 🎨 UI & Styling

- [ ] Install & configure **Tailwind CSS**
- [ ] Integrate **shadcn/ui** and **Radix UI**
- [ ] Define base theme tokens (light/dark mode)
- [ ] Build shared UI components: Button, Input, Card, etc.

### 🧱 Layout & Core UI

- [ ] Sidebar with workspace navigation
- [ ] Topbar with WebSocket connection controls
- [ ] Console panel (toggleable)
- [ ] Content area for message input/output

### 🔌 WebSocket Core (MVP)

- [ ] Connect/disconnect WebSocket endpoint
- [ ] Display connection status
- [ ] Send/receive text & JSON
- [ ] Format and pretty-print incoming messages

### 📁 Core Features

- [ ] Workspaces (create/switch/delete)
- [ ] Collections (CRUD)
- [ ] Request editor with metadata/docs
- [ ] Request history (auto-saved)
- [ ] Environment support (variable substitution)
- [ ] Console log for sent/received messages
- [ ] Request/response mappers (JS-based pre/post transforms)
- [ ] Import/export collections (JSON)
- [ ] i18n support

### 🧪 Future Enhancements

- [ ] Tabs or multi-connection interface
- [ ] Plugin system (custom message transformers, scripting)

## 📁 Project Status

> ✅ The project is currently in the **initial setup phase**.

## 🔗 Related

- [Electron](https://www.electronjs.org/)
- [React](https://reactjs.org/)
- [WebSocket Protocol (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
