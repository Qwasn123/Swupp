# SWUPP Frontend

A modern web application built with Vue 3 and Vite, designed to provide a seamless user experience for second-hand product trading within university communities. The application features a robust authentication system, efficient file upload capabilities, and a clean, intuitive user interface powered by Element Plus.

## Features

### Core Functionality
- **User Authentication**
  - Secure login and registration system
  - JWT-based authentication
  - Password encryption and security measures
  - User profile management

- **Product Management**
  - Create and edit product listings
  - Multi-image upload support
  - Rich text description editor
  - Category and tag management

- **User Interface**
  - Responsive design for all devices
  - Modern and clean UI with Element Plus
  - Smooth animations and transitions
  - Intuitive navigation system

- **Search & Filter**
  - Advanced search functionality
  - Category-based filtering
  - Price range filtering
  - Sort by various criteria

## Tech Stack

### Core Technologies
- **Vue 3**: Latest Vue framework with Composition API for reactive and efficient UI
- **Vite**: Next-generation frontend build tool offering instant server start
- **Element Plus**: Premium UI components for a professional look
- **Pinia**: State management with devtools support and Vue 3 compatibility
- **Vue Router**: Official router with dynamic route matching
- **Tailwind CSS**: Utility-first CSS framework for custom designs
- **Axios**: Promise-based HTTP client for API requests

### Development Tools
- **ESLint**: JavaScript linting utility
- **Prettier**: Code formatter
- **PostCSS**: CSS transformation tool
- **Autoprefixer**: Automatic vendor prefix management

## Project Structure

```
src/
├── api/                  # API integration layers
│   ├── auth.js          # Authentication related APIs
│   └── upload.js        # File upload handling
├── assets/              # Static assets (images, fonts)
├── components/          # Reusable Vue components
│   ├── common/          # Generic UI components
│   └── product/         # Product-specific components
├── router/              # Route configurations
│   └── index.js         # Main router setup
├── stores/              # Pinia state stores
│   ├── auth.js          # Authentication state
│   └── product.js       # Product management state
├── utils/               # Utility functions
│   ├── request.js       # Axios configuration
│   └── validators.js    # Form validators
└── views/               # Page components
    ├── Login.vue        # User authentication
    ├── Mine.vue         # User profile
    └── Product/         # Product-related pages
```

## Getting Started

### Prerequisites

- Node.js (v16.0.0 or higher)
- npm (v7.0.0 or higher) or yarn
- Modern web browser with JavaScript enabled

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd swupp-frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

### Development

Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

### Production Build

Create a production build:
```bash
npm run build
# or
yarn build
```

Preview the production build:
```bash
npm run preview
# or
yarn preview
```

## Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=your_api_base_url
VITE_UPLOAD_URL=your_upload_endpoint
```

### Vite Configuration
The `vite.config.js` file contains build and development configurations:
- Path aliases
- Plugin configurations
- Build optimizations
- Development server settings

## Development Guidelines

### Component Development
- Use Vue 3 `<script setup>` syntax for cleaner component code
- Implement proper prop validation and documentation
- Use composables for reusable logic
- Follow Vue.js Style Guide recommendations

### State Management
- Use Pinia stores for global state
- Implement modular store design
- Use computed properties for derived state
- Handle async operations in actions

### API Integration
- Centralize API calls in the `api` directory
- Implement proper error handling
- Use interceptors for common request/response handling
- Cache responses when appropriate

### CSS/Styling
- Use Tailwind utility classes for custom styling
- Follow BEM methodology for custom CSS
- Maintain responsive design principles
- Use CSS variables for theming

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please contact the development team or open an issue in the repository.
