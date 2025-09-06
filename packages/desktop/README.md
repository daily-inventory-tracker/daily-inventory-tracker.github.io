# Daily Inventory Desktop App

A cross-platform desktop application for tracking daily spiritual inventory, built with Electron and React.

## Features

- **Cross-platform**: Runs on Windows, macOS, and Linux
- **Daily Inventory Tracking**: Complete daily spiritual inventory with 24 character traits
- **Progress Visualization**: Interactive charts and statistics
- **Data Management**: Export/import data, backup and restore
- **Modern UI**: Clean, responsive design with smooth animations
- **Local Storage**: All data stored locally using Electron Store
- **Native Notifications**: Desktop notifications for reminders

## Screenshots

- **Home Screen**: Overview with progress tracking and recent activity
- **Inventory Screen**: Daily inventory form with progress indicator
- **Charts Screen**: Interactive charts showing completion trends and item analysis
- **Settings Screen**: App configuration and data management

## Development Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the desktop package:
   ```bash
   cd packages/desktop
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run electron-dev
   ```

This will start both the React development server and Electron app in development mode.

### Available Scripts

- `npm start` - Start React development server only
- `npm run electron` - Start Electron app only (requires built React app)
- `npm run electron-dev` - Start both React dev server and Electron
- `npm run build` - Build React app for production
- `npm run dist` - Build and package for all platforms
- `npm run dist:win` - Build and package for Windows
- `npm run dist:mac` - Build and package for macOS
- `npm run dist:linux` - Build and package for Linux

## Building for Distribution

### Windows

```bash
npm run dist:win
```

This creates a Windows installer (.exe) in the `dist` folder.

### macOS

```bash
npm run dist:mac
```

This creates a macOS app bundle (.app) and installer (.dmg) in the `dist` folder.

### Linux

```bash
npm run dist:linux
```

This creates an AppImage and other Linux packages in the `dist` folder.

## Project Structure

```
packages/desktop/
├── public/
│   ├── electron.js          # Main Electron process
│   ├── preload.js           # Preload script for IPC
│   ├── index.html           # Main HTML file
│   └── icon.png             # App icon
├── src/
│   ├── App.js               # Main React component
│   ├── index.js             # React entry point
│   ├── index.css            # Global styles
│   ├── screens/             # Screen components
│   │   ├── HomeScreen.js
│   │   ├── InventoryScreen.js
│   │   ├── ChartsScreen.js
│   │   └── SettingsScreen.js
│   └── services/            # Platform-specific services
│       ├── StorageService.js
│       └── NotificationService.js
├── package.json             # Dependencies and scripts
└── README.md               # This file
```

## Data Storage

The app uses Electron Store for local data persistence:

- **Location**: `~/.config/daily-inventory-desktop/` (Linux/macOS) or `%APPDATA%/daily-inventory-desktop/` (Windows)
- **Format**: JSON files
- **Backup**: Data can be exported/imported via the Settings screen

## Shared Logic

The desktop app shares core logic with the mobile app through the `dailyinventory-shared` package:

- Inventory data structure
- Data models and utilities
- Chart data processing
- Date formatting utilities

## Troubleshooting

### Common Issues

1. **Build fails**: Make sure all dependencies are installed
2. **Electron won't start**: Check that React dev server is running on port 3000
3. **Data not saving**: Verify Electron Store permissions and file paths

### Development Tips

- Use `Ctrl+Shift+I` (or `Cmd+Option+I` on macOS) to open DevTools
- Check the console for error messages
- Use the React Developer Tools extension for debugging

## Contributing

1. Follow the existing code style
2. Test on multiple platforms when possible
3. Update documentation for new features
4. Ensure all scripts work correctly

## License

This project is part of the Daily Inventory application suite. 