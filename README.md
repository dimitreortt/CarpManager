# 🏗️ CarpManager

**Professional Carpentry ERP System** - A comprehensive business management solution designed specifically for carpentry and woodworking companies.

[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.9.0-2D3748.svg)](https://www.prisma.io/)
[![Cypress](https://img.shields.io/badge/Cypress-13.17.0-17202C.svg)](https://www.cypress.io/)

## 📋 Overview

CarpManager is a modern, full-stack ERP system built for carpentry businesses. It streamlines operations from client management to financial tracking, providing a complete solution for woodworking professionals to manage their business efficiently. The system is built with a three-tier architecture, ensuring scalability, maintainability, and comprehensive test coverage.

## 🏗️ Architecture

The project follows a modular monorepo structure with clear separation of concerns:

-   **Backend API** - RESTful services built with Express.js, providing secure and scalable business logic
-   **Frontend Application** - React-based single-page application with responsive design
-   **E2E Testing Suite** - Comprehensive end-to-end testing with Cypress for quality assurance

This architecture enables independent development, testing, and deployment of each layer while maintaining a cohesive system.

## ✨ Key Features

### 🎯 **Core Business Management**

-   **Client Relationship Management** - Comprehensive client database and relationship tracking
-   **Inventory Management** - Material and supply tracking with supplier integration
-   **Quote & Estimate Generation** - Professional quote creation with automated cost calculations
-   **Financial Control** - Complete accounting system with income and expense tracking
-   **Project & Service Management** - Service delivery tracking with cost analysis
-   **Supplier Management** - Supplier database and relationship management

### 🚀 **Advanced Capabilities**

-   **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
-   **Real-time Data Synchronization** - Live updates across all devices and users
-   **Automated Calculations** - Automatic cost calculations for materials, labor, and services
-   **Workflow Management** - Complete status tracking and workflow automation
-   **Multi-company Support** - Support for multiple companies with isolated data

## 🛠️ Technology Stack

| Category               | Technology        | Version | Notes                                   |
| ---------------------- | ----------------- | ------- | --------------------------------------- |
| **Backend Runtime**    | Node.js           | Latest  | Server-side execution environment       |
| **Backend Framework**  | Express.js        | 4.18+   | RESTful API framework                   |
| **Backend Language**   | TypeScript        | 5.8+    | Type-safe development                   |
| **Database ORM**       | Prisma            | 6.9.0   | Database access and migrations          |
| **Backend Testing**    | Jest              | Latest  | Unit and integration testing            |
| **Authentication**     | Firebase Admin    | 13.5+   | Server-side authentication              |
| **Security**           | JWT, Helmet, CSRF | Latest  | Authentication and security middleware  |
| **Frontend Framework** | React             | 19.1.0  | User interface library                  |
| **Frontend Language**  | TypeScript        | 5.0+    | Type-safe development                   |
| **Build Tool**         | Vite              | 5.0+    | Fast build tool and dev server          |
| **UI Framework**       | Bootstrap         | 5.3+    | Responsive component library            |
| **Styling**            | SCSS              | Latest  | Enhanced CSS with variables and nesting |
| **State Management**   | Jotai             | 2.12+   | Atomic state management                 |
| **Data Fetching**      | React Query       | 5.90+   | Server state management                 |
| **Form Management**    | React Hook Form   | 7.61+   | Form handling and validation            |
| **Form Validation**    | Zod               | 4.0+    | Schema validation                       |
| **E2E Testing**        | Cypress           | 13.17+  | End-to-end testing framework            |
| **E2E Build Tool**     | Vite              | 7.1+    | Test utilities build tool               |
| **Infrastructure**     | Firebase          | Latest  | Hosting and authentication services     |

## 📁 Project Structure

The project is organized as a monorepo with three main directories:

-   **`backend/`** - Express.js API server with Prisma ORM, business logic, and REST endpoints
-   **`frontend/`** - React application with Bootstrap UI, state management, and user interfaces
-   **`e2e/`** - Cypress test suite with comprehensive end-to-end test coverage

All components share TypeScript configuration and follow consistent development practices, ensuring code quality and maintainability across the entire system.

## 📱 Core Modules

### 👥 **Client Management**

-   Client relationship management and profile tracking
-   Project history and relationship analytics
-   Multi-company client organization

### 📦 **Material Management**

-   Comprehensive inventory tracking and management
-   Supplier integration and pricing information
-   Material categorization and organization

### 💰 **Estimates & Quoting**

-   Professional estimate and quote generation
-   Automated cost calculations and pricing
-   Quote workflow and status management

### 📊 **Financial Control**

-   Income and expense tracking
-   Financial categorization and reporting
-   Payment and installment management

### 🚗 **Trip & Service Management**

-   Service trip planning and scheduling
-   Cost tracking and analysis
-   Service delivery management

### 🏢 **Supplier Management**

-   Supplier database and relationship management
-   Product catalog integration
-   Supplier performance tracking

## 🔐 Authentication & Security

-   **JWT-based Authentication** - Secure token-based authentication system
-   **Firebase Admin Integration** - Server-side authentication and user management
-   **Role-based Access Control** - Granular permissions and access management
-   **Secure Data Transmission** - HTTPS and secure API communication
-   **Session Management** - Secure user session handling
-   **Multi-company Data Isolation** - Company-specific data segregation
-   **Security Middleware** - Helmet, CSRF protection, and rate limiting

## 📱 Frontend Design System

The frontend application features a modern, responsive design system:

-   **Bootstrap 5** as the foundation for responsive components
-   **Custom SCSS** for specialized components and theming
-   **Mobile-first approach** with responsive sidebar navigation
-   **Touch-friendly interfaces** optimized for mobile devices
-   **Cross-device compatibility** ensuring consistent experience
-   **Progressive Web App ready** for enhanced mobile experience
-   **Accessibility compliant** following WCAG guidelines

## 🧪 Testing & Quality Assurance

-   **Unit Testing** - Jest for backend unit and integration tests
-   **E2E Testing** - Cypress for comprehensive end-to-end test coverage
-   **Type Safety** - TypeScript strict mode across all projects
-   **Code Quality** - ESLint configuration for consistent code standards
-   **Form Validation** - Zod schema validation for data integrity

## 💻 Code Standards

-   **TypeScript strict mode** across all projects
-   **ESLint configuration** for code quality and consistency
-   **Component-based architecture** for frontend development
-   **Service-oriented architecture** for backend development
-   **RESTful API design** following industry best practices
-   **Modular monorepo structure** for maintainability

## 📄 License

This project is proprietary software. All rights reserved.

---

**Built with ❤️ for the carpentry industry**

_CarpManager - Streamlining woodworking business operations since 2025_
