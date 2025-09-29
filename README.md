# MantraSetu Frontend

A modern, responsive React application for the MantraSetu spiritual platform, built with TypeScript, styled-components, and Redux Toolkit.

## 🚀 Features

- **Modern UI/UX**: Beautiful, responsive design with traditional Indian aesthetics
- **Authentication**: Complete login/register system with JWT tokens
- **State Management**: Redux Toolkit for predictable state management
- **Type Safety**: Full TypeScript support throughout the application
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Component Library**: Reusable UI components with consistent styling
- **Routing**: React Router for seamless navigation
- **Animations**: Framer Motion for smooth animations and transitions

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe JavaScript development
- **Styled Components** - CSS-in-JS styling solution
- **Redux Toolkit** - State management with RTK Query
- **React Router** - Client-side routing
- **Framer Motion** - Animation library
- **React Hook Form** - Form handling and validation
- **Axios** - HTTP client for API calls
- **React Hot Toast** - Notification system

## 📦 Installation

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env.local
   ```

4. **Configure environment variables:**
   ```env
   REACT_APP_API_URL=http://localhost:3001/api
   REACT_APP_WS_URL=ws://localhost:3001
   REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
   ```

## 🚀 Development

1. **Start the development server:**
   ```bash
   npm start
   ```

2. **Build for production:**
   ```bash
   npm run build
   ```

3. **Run tests:**
   ```bash
   npm test
   ```

4. **Lint code:**
   ```bash
   npm run lint
   ```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── UI/             # Basic UI components (Button, Input, etc.)
│   ├── Layout/         # Layout components (Header, Footer, Layout)
│   ├── Home/           # Homepage-specific components
│   └── Auth/           # Authentication components
├── pages/              # Page components
├── store/              # Redux store and slices
├── services/           # API services and utilities
├── styles/             # Global styles and theme
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## 🎨 Design System

### Colors
- **Primary**: Orange (#ff6b35) - Main brand color
- **Secondary**: Gold (#ffd700) - Accent color
- **Success**: Green (#4caf50)
- **Error**: Red (#f44336)
- **Warning**: Orange (#ff9800)

### Typography
- **Primary Font**: Inter - Modern, clean sans-serif
- **Secondary Font**: Poppins - Friendly, approachable sans-serif

### Spacing
- Consistent 8px grid system
- Responsive spacing with theme-based values

### Components
- **Button**: Multiple variants (primary, secondary, outline, ghost, danger)
- **Input**: Form inputs with validation and icons
- **Logo**: Animated temple logo with ornamental borders
- **Cards**: Consistent card design with hover effects

## 🔧 Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm run lint` - Lint code
- `npm run type-check` - TypeScript type checking

## 📱 Responsive Design

The application is built with a mobile-first approach:

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔐 Authentication

- JWT-based authentication
- Refresh token support
- Protected routes
- Role-based access control
- Social login (Google) support

## 🌐 Internationalization

- Multi-language support (Hindi, English, Tamil, Telugu, Sanskrit)
- RTL support ready
- Cultural sensitivity in design

## 📊 State Management

- **Auth Slice**: User authentication and profile
- **User Slice**: User preferences and settings
- **Booking Slice**: Service bookings and management
- **UI Slice**: Global UI state (modals, notifications)

## 🎭 Animations

- Framer Motion for smooth transitions
- Hover effects on interactive elements
- Loading states with spinners
- Page transitions

## 🧪 Testing

- Jest for unit testing
- React Testing Library for component testing
- Cypress for end-to-end testing (planned)

## 📦 Build & Deployment

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Deploy to your hosting platform:**
   - Netlify
   - Vercel
   - AWS S3 + CloudFront
   - Firebase Hosting

## 🔧 Configuration

### Environment Variables

```env
# API Configuration
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_WS_URL=ws://localhost:3001

# Google OAuth
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id

# Analytics
REACT_APP_GA_TRACKING_ID=your_ga_tracking_id

# Feature Flags
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_DEBUG=false
```

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use:**
   ```bash
   PORT=3001 npm start
   ```

2. **TypeScript errors:**
   ```bash
   npm run type-check
   ```

3. **Build failures:**
   ```bash
   npm run build --verbose
   ```

## 📚 Resources

- [React Documentation](https://reactjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Styled Components](https://styled-components.com/docs)
- [Redux Toolkit](https://redux-toolkit.js.org/introduction/getting-started)
- [React Router](https://reactrouter.com/docs/en/v6)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**MantraSetu Frontend** - Bringing traditional spirituality to the modern web.
