# Daily Inventory - Cross-Platform App

A spiritual inventory tracking application available as both a **Progressive Web App (PWA)** and **React Native mobile app**. Track your daily personal characteristics and spiritual growth across web and mobile platforms.

## 🏗️ Project Structure

This is a **monorepo** containing three packages:

```
dailyinventory/
├── packages/
│   ├── shared/           # Shared business logic (works on both platforms)
│   ├── web/             # PWA version (React)
│   └── mobile/          # React Native app (iOS & Android)
├── package.json         # Root workspace configuration
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- **Node.js 16+** 
- **npm 7+** (for workspace support)
- **Git**

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <your-repo-url>
   cd dailyinventory
   npm install
   ```

2. **Start development:**
   ```bash
   # Web (PWA)
   npm run web:start
   
   # Mobile (React Native)
   npm run mobile:start
   ```

## 📱 Platform-Specific Setup

### 🌐 Web (PWA) - Ready to Use

The web version works immediately after installation:

```bash
npm run web:start
```

**Features:**
- ✅ PWA installation
- ✅ Offline support
- ✅ Browser notifications
- ✅ Chart.js integration
- ✅ Responsive design

### 📱 Mobile (React Native) - Requires Development Tools

#### **iOS Development Setup**

1. **Install Xcode:**
   ```bash
   # Open Mac App Store and search for "Xcode"
   open -a "App Store" "https://apps.apple.com/us/app/xcode/id497799835"
   ```

2. **Install Command Line Tools:**
   ```bash
   xcode-select --install
   ```

3. **Set Xcode as default developer tool:**
   ```bash
   sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
   ```

4. **Agree to Xcode license agreements:**
   ```bash
   sudo xcodebuild -license
   ```
   - This will prompt for your password
   - Press `space` to scroll through the license
   - Type `agree` and press `Enter` to accept

5. **Run Xcode first launch setup:**
   ```bash
   xcodebuild -runFirstLaunch
   ```

6. **Install iOS Simulator:**
   - Open Xcode (it should have opened automatically)
   - Go to **Xcode → Preferences → Components**
   - Download and install **iOS Simulator** (this may take a while)
   - Or use the command line: `xcrun simctl runtime install iOS`

7. **Install CocoaPods:**
   ```bash
   sudo gem install cocoapods
   ```

8. **Install iOS dependencies:**
   ```bash
   cd packages/mobile/ios
   pod install
   cd ../..
   ```

9. **Run iOS app:**
   ```bash
   npm run mobile:ios
   ```

**📖 For detailed iOS setup instructions and troubleshooting, see [IOS_SETUP_GUIDE.md](./IOS_SETUP_GUIDE.md)**

#### **Android Development Setup**

1. **Download Android Studio:**
   ```bash
   open "https://developer.android.com/studio"
   ```

2. **Install Android Studio:**
   - Download the `.dmg` file
   - Drag to Applications folder
   - Follow the setup wizard

3. **Set up Android SDK:**
   - Open Android Studio
   - Go to **Tools → SDK Manager**
   - Install:
     - **Android SDK Platform-Tools**
     - **Android SDK Build-Tools**
     - **Android SDK Platform** (API level 33+)
     - **Android Emulator**

4. **Set up environment variables:**
   Add to your `~/.zshrc` or `~/.bash_profile`:
   ```bash
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

5. **Reload shell:**
   ```bash
   source ~/.zshrc
   ```

6. **Run Android app:**
   ```bash
   npm run mobile:android
   ```

## 🛠️ Development Commands

### Root Level Commands

```bash
# Install all dependencies
npm install

# Start web development server
npm run web:start

# Build web for production
npm run web:build

# Start mobile Metro bundler
npm run mobile:start

# Run on iOS simulator
npm run mobile:ios

# Run on Android emulator
npm run mobile:android

# Build shared package
npm run shared:build

# Build all packages
npm run build:all

# Run development servers for both platforms
npm run dev

# Clean all packages
npm run clean

# Lint all packages
npm run lint

# Test all packages
npm run test
```

### Package-Specific Commands

```bash
# Web package
npm run start --workspace=dailyinventory-web
npm run build --workspace=dailyinventory-web

# Mobile package
npm run start --workspace=dailyinventory-mobile
npm run ios --workspace=dailyinventory-mobile
npm run android --workspace=dailyinventory-mobile

# Shared package
npm run build --workspace=dailyinventory-shared
```

## 📊 Features

### Shared Features (Both Platforms)
- ✅ **Daily inventory tracking** with 20 spiritual characteristics
- ✅ **Data persistence** with platform-appropriate storage
- ✅ **Chart visualization** of progress over time
- ✅ **Date-based navigation** and data management
- ✅ **Offline functionality** for continuous use

### Web-Specific Features
- ✅ **Progressive Web App** (PWA) installation
- ✅ **Browser notifications** for daily reminders
- ✅ **Responsive design** for all screen sizes
- ✅ **Chart.js integration** for data visualization

### Mobile-Specific Features
- ✅ **Native performance** and animations
- ✅ **Push notifications** via React Native
- ✅ **Touch-optimized** UI components
- ✅ **Offline-first** data storage
- ✅ **React Navigation** for smooth transitions

## 🏗️ Architecture

### Monorepo Benefits
- **Shared business logic** between platforms
- **Single source of truth** for inventory data
- **Consistent behavior** across platforms
- **Efficient development** workflow

### Code Organization
- **`packages/shared/`**: Core business logic, data models, utilities
- **`packages/web/`**: PWA implementation with React
- **`packages/mobile/`**: React Native app with native features

## 🔧 Troubleshooting

### Common Issues

#### Metro Bundler Issues
```bash
# Clear Metro cache
cd packages/mobile
npx react-native start --reset-cache
```

#### iOS Build Issues
```bash
# Clean and reinstall pods
cd packages/mobile/ios
pod deintegrate
pod install
```

#### Android Build Issues
```bash
# Clean Android build
cd packages/mobile/android
./gradlew clean
```

### Getting Help

1. **Check the logs** for specific error messages
2. **Clear caches** (Metro, npm, pods)
3. **Reinstall dependencies** if needed
4. **Check platform-specific setup guides**

## 📱 Platform Status

- ✅ **Web PWA**: Fully functional
- ✅ **Mobile iOS**: Functional with React Native
- ✅ **Mobile Android**: Ready for development
- ✅ **Shared Logic**: Complete business logic extraction

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on both platforms
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License. 