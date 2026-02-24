# Sakny - Roommate Matching Platform 🏠

A modern roommate matching platform built with React, JavaScript, and Vite. Designed for the Egyptian market with same-gender matching support.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📁 Project Structure

```
sakny/
├── components/          # Reusable React components
│   ├── cards/          # Card components (ProfileCompletionCard, RoommateCard)
│   ├── common/         # Common components
│   │   ├── Badge.jsx           # Status badges
│   │   ├── Button.jsx          # Custom buttons with animations
│   │   ├── Input.jsx           # Form inputs
│   │   ├── PageTransition.jsx  # Page transition animations
│   │   ├── SkeletonLoader.jsx   # Loading states
│   │   └── WelcomeMessage.jsx  # Welcome toast message
│   └── layout/         # Layout components
│       ├── Navbar.jsx          # Navigation bar
│       └── Footer.jsx          # Footer
├── pages/              # Page components
│   ├── Auth/           # Login & Signup pages
│   ├── Landing.jsx     # Landing page
│   ├── Dashboard.jsx   # User dashboard
│   ├── Search.jsx      # Roommate search
│   ├── MyProfile.jsx   # User profile
│   ├── ProfileSetup.jsx # Profile setup wizard
│   └── ...
├── slices/             # Redux slices
│   ├── authSlice.js    # Authentication state
│   ├── roommateSlice.js # Roommate data
│   └── notificationSlice.js # Notifications
├── styles/             # Modular CSS files
├── utils/              # Utility functions
│   └── animations.js   # Animation variants
├── data/               # Mock data
```

## 🎨 CSS Architecture

The project uses Tailwind CSS with a modular approach:

- `styles/index.css` - Main stylesheet
- `styles/base.css` - Base styles & typography
- `styles/variables.css` - CSS variables
- `styles/animations.css` - Animation keyframes
- `styles/components/` - Component-specific styles
- `styles/pages/` - Page-specific styles

## 🛠️ Tech Stack

- **React** - UI library
- **JavaScript** - Programming language
- **Vite** - Build tool
- **Redux Toolkit** - State management
- **Framer Motion** - Animations
- **React Router** - Routing
- **Lucide React** - Icons
- **Tailwind CSS** - Styling

## ✨ Features

### Profile Setup Wizard

- 6-step profile completion process
- Step validation (can't proceed without required fields)
- Edit profile functionality
- Same-gender matching (Egyptian market)

### User Dashboard

- Profile completion tracking
- Quick actions (Find Roommates, Saved Profiles)
- Stats overview (Profile views, Matches, Response rate)

### Roommate Search

- Advanced filtering (Age, Budget, Location, Personality)
- Save favorite profiles
- View match percentages

### Authentication

- Login/Signup forms
- Form validation
- Welcome message on login
- Profile data persistence

## 📱 Responsive Design

The platform is fully responsive:

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- No horizontal scroll issues

## 🎬 Animations

- Page transitions using Framer Motion
- Card hover effects
- Button interactions
- Welcome toast notifications
- Smooth scroll reveal animations
