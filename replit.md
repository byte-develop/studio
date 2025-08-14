# Overview

This is a modern full-stack web application built with a React frontend and Express.js backend. The application is a portfolio/agency website for "VERTEX Studio," a comprehensive digital development company. It features a futuristic dark theme design with CSS-based 3D effects, particle animations, and interactive elements. The site showcases a full range of development services from web development to 3D/WebGL, mobile apps, backend solutions, AI/ML, and DevOps. The project uses TypeScript throughout and implements modern web technologies including Framer Motion for animations, and a comprehensive UI component library based on shadcn/ui.

# User Preferences

Preferred communication style: Simple, everyday language.
Preferred language: Russian (русский язык)

# Recent Changes

**August 14, 2025** - Complete Admin Interface Redesign and Migration
- ✓ Полностью переработан дизайн модальных окон (темная тема с градиентами)
- ✓ Убраны все фиктивные данные из статистики (+2 сегодня, активные проекты)
- ✓ Добавлена полная мобильная адаптивность с бургер-меню
- ✓ Исправлены проблемы с навигацией на маленьких экранах
- ✓ Добавлено объяснение статуса системы (API отвечает, данные загружаются)
- ✓ Улучшены цветовые градиенты и общий дизайн интерфейса
- ✓ Завершена миграция проекта в среду Replit
- ✓ Добавлено мобильное меню с анимациями и оверлеем
- ✓ Адаптивные размеры для карточек, кнопок и текста
- ✓ Полная мобильная адаптивность админки (карточки, диалоги, таблицы)
- ✓ Исправлены размеры элементов и отступов на мобильных устройствах
- ✓ Добавлен горизонтальный скролл для табов на узких экранах
- ✓ Исправлена проблема с кнопками на мобильных устройствах (размеры иконок и текста)
- ✓ Адаптивные заголовки разделов для лучшего отображения на всех устройствах

**August 12, 2025** - Project Migration to Replit Environment
- ✓ Successfully migrated from Replit Agent to standard Replit environment
- ✓ Verified all dependencies and TypeScript build tools working correctly
- ✓ Configured Telegram Bot integration with proper environment variables
- ✓ Fixed Telegram message formatting with Markdown escaping
- ✓ Ensured client/server separation and security best practices
- ✓ Express server running properly on port 5000 with Vite integration

**August 12, 2025** - Mobile Responsiveness Improvements
- ✓ Fixed process section mobile layout with single-column design
- ✓ Improved footer layout with stacked elements for mobile
- ✓ Enhanced navigation bar width and positioning on mobile
- ✓ Added responsive typography scaling across all sections
- ✓ Optimized padding and spacing for small screens
- ✓ Enhanced select dropdown hover effects with neon gradients
- ✓ Added CSS media queries for mobile and small mobile devices
- ✓ Improved form elements sizing for better touch interaction

**August 12, 2025** - Added Telegram Bot Integration
- ✓ Created TelegramService for sending notifications
- ✓ Integrated contact form submissions with Telegram alerts
- ✓ Added environment variables: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
- ✓ Formatted contact messages with Russian localization
- ✓ Non-blocking notification sending (doesn't fail form submission)

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **3D Graphics**: Three.js with React Three Fiber for 3D scenes and animations
- **Animations**: Framer Motion for page transitions and interactive animations
- **Form Handling**: React Hook Form with Zod validation

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API endpoints for contact form submissions
- **Notifications**: Telegram Bot integration for instant contact form notifications
- **Development**: Hot reload with Vite integration in development mode
- **Production**: Built and served as static files with API routes

## Data Storage Solutions
- **Database**: PostgreSQL configured with Drizzle ORM
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Development Storage**: In-memory storage implementation for development
- **Database Provider**: Neon Database (serverless PostgreSQL)

## Authentication and Authorization
- **Current State**: No authentication system implemented
- **Session Storage**: Basic session infrastructure with connect-pg-simple (currently unused)
- **User Model**: Database schema includes users table but no active authentication flow

## Component Structure
- **Design System**: Comprehensive UI component library with consistent styling
- **3D Components**: Dedicated Three.js components for particle systems and floating geometry
- **Page Sections**: Modular components for different website sections (Hero, Services, Portfolio, etc.)
- **Responsive Design**: Mobile-first approach with custom hooks for device detection

## Development Workflow
- **Build System**: Vite for fast development and optimized production builds
- **Type Safety**: Comprehensive TypeScript configuration with strict mode
- **Code Quality**: ESLint integration with Replit-specific error handling
- **Hot Reload**: Development server with automatic refresh and error overlay

# External Dependencies

## Core Technologies
- **React Ecosystem**: React 18, React DOM, React Hook Form, TanStack Query
- **Build Tools**: Vite, esbuild for production builds, TypeScript compiler
- **Backend Framework**: Express.js with middleware for JSON parsing and CORS

## Database and ORM
- **Database**: Neon Database (serverless PostgreSQL)
- **ORM**: Drizzle ORM with Drizzle Kit for schema management
- **Validation**: Zod for runtime type validation and schema validation

## UI and Styling
- **Component Library**: Radix UI primitives (30+ components)
- **Styling**: Tailwind CSS with PostCSS and Autoprefixer
- **Icons**: Lucide React icon library
- **Utilities**: class-variance-authority, clsx, tailwind-merge

## 3D Graphics and Animation
- **3D Engine**: Three.js with React Three Fiber and Drei utilities
- **Animation**: Framer Motion for page transitions and micro-interactions
- **WebGL**: Direct Three.js integration for custom 3D scenes

## Development Tools
- **Package Manager**: npm with lockfile version 3
- **Development Server**: Vite with Replit-specific plugins
- **Error Handling**: Runtime error modal for development
- **Build Target**: ES modules with Node.js compatibility

## Fonts and Assets
- **Typography**: Google Fonts (Inter, JetBrains Mono, Architects Daughter, DM Sans, Fira Code, Geist Mono)
- **Images**: Unsplash integration for portfolio images
- **Static Assets**: Vite-managed asset pipeline with alias resolution