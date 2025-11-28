# CarpManager Sistemas de Gestão

## Project Overview

This is a React TypeScript project using Bootstrap for styling and Vite as the build tool. The application is a Carpentry ERP system with a comprehensive navigation structure and responsive design.

## Tech Stack

-   React 19.1.0 with TypeScript
-   Bootstrap 5 for UI components
-   Vite for build tooling
-   ESLint for code linting

## Application Structure

### Navigation & Layout

The application features a **responsive left sidebar navigation** with the following sections:

-   **Dashboard** (`/`) - Main dashboard with navigation cards
-   **Clientes** (`/clients`) - Client management
-   **Produtos** (`/products`) - Product catalog management
-   **Orçamentos** (`/estimates`) - Estimate creation and management
-   **Contabilidade** (`/accountability`) - Financial control and accounting
-   **Viagens** (`/trips`) - Travel and logistics management
-   **Fornecedores** (`/suppliers`) - Supplier management
-   **Funcionários** (`/employees`) - Employee and HR management

#### Responsive Behavior

-   **Desktop (≥992px)**: Sidebar is always visible and fixed
-   **Mobile/Tablet (<992px)**: Sidebar is collapsible with hamburger menu
-   **Mobile overlay**: Dark overlay when sidebar is open on mobile
-   **Auto-close**: Sidebar automatically closes when navigating on mobile
-   **Smooth transitions**: CSS transitions for opening/closing animations

### Components

#### Layout Components

-   `Layout` - Main layout wrapper with responsive sidebar and top navigation
-   `Sidebar` - Responsive left navigation sidebar with mobile support
-   `Logo` - Application logo component

#### Page Components

-   `Home` - Dashboard with responsive navigation cards
-   `Clients` - Client management page
-   `Products` - Product catalog page
-   `Estimates` - Estimate management page
-   `Accountability` - Financial control page
-   `Trips` - Travel management page
-   `Suppliers` - Supplier management page
-   `Employees` - Employee and HR management page

### Styling

The application uses Bootstrap 5 with custom SCSS for:

-   Responsive sidebar behavior
-   Mobile overlay and transitions
-   Sidebar hover effects
-   Dashboard card hover animations
-   Primary gradient backgrounds
-   Responsive design with mobile-first approach

## Coding Standards

### TypeScript

-   Use strict TypeScript with proper type annotations
-   Import types using `import type` when `verbatimModuleSyntax` is enabled
-   Use React.FC for functional components
-   Prefer explicit typing over inference when it improves clarity

### React

-   Use functional components with hooks
-   Use proper event handling with TypeScript
-   Implement proper error boundaries and loading states
-   Don't do export default components
-   Use useState and useEffect for responsive state management

### Styling

-   Use Bootstrap classes as the primary styling approach
-   Only use custom SCSS when Bootstrap doesn't provide the needed functionality
-   Keep custom CSS minimal and focused on specific overrides
-   Use responsive design principles with Bootstrap's grid system
-   This app is about Carpentry ERP, so provide elegant robust layouts to match this
-   Implement mobile-first responsive design

### Code Style

-   Arrow function parentheses only when needed
-   In Zod, don't do "z.string().email(" instead do: "z.email("

### File Organization

-   Components in src/presentation/components/ for reusable components
-   Pages in src/presentation/pages/ for page-level components
-   Styles in src/styles/ for custom SCSS
-   Main app logic in src/main/App.tsx

## Development Guidelines

-   Always handle loading and error states
-   Implement proper form validation
-   Use semantic HTML with proper accessibility
-   Follow Bootstrap's component patterns
-   Keep components focused and single-purpose
-   Use proper TypeScript interfaces for props and state
-   Test responsive behavior across different screen sizes

## Common Patterns

-   Authentication state management with useEffect and onAuthStateChanged
-   Form handling with controlled components
-   Error display with Bootstrap alerts
-   Loading states with Bootstrap spinners
-   Responsive design with Bootstrap classes
-   Layout wrapper pattern for consistent page structure
-   Responsive sidebar state management with useState and useEffect

## Dependencies

-   bootstrap: UI framework
-   sass: SCSS preprocessing
-   All other dependencies as specified in package.json

## Build and Development

-   Use `npm run dev` for development
-   Use `npm run build` for production builds
-   Use `npm run lint` for code linting
-   Vite handles hot module replacement and build optimization

## Database Schema

### Outgoing (Saídas)

The Outgoing entity represents financial outflows and expenses in the system:

#### Fields:

-   `id` (string): Unique identifier
-   `date` (string): Date of the transaction (ISO format)
-   `reference` (string): Reference information (payroll, order number, etc.)
-   `purchaseMethod` (enum): Payment method - 'card', 'pix', 'boleto', 'automatic_debit'
-   `installments` (number): Number of installments
-   `totalAmount` (number): Total invoice amount
-   `installmentAmount` (number): Amount per installment
-   `description` (string): Detailed description of the expense
-   `purpose` (enum): Destination - 'client' or 'internal'
-   `category` (enum): Category - 'light', 'fixed', 'other'
-   `clientId` (string, optional): Client ID if applicable
-   `clientName` (string, optional): Client name if applicable
-   `supplierId` (string, optional): Supplier ID
-   `supplierName` (string, optional): Supplier name
-   `purchaseAmount` (number): Purchase amount
-   `dueDate` (string): Due date (ISO format)
-   `paidAmount` (number): Amount being paid
-   `accountType` (string): Type of account
-   `status` (enum): Status - 'pending', 'paid', 'overdue', 'posted'
-   `createdAt` (string): Creation timestamp (ISO format)

#### Status Values:

-   `pending`: Pending payment
-   `paid`: Payment completed
-   `overdue`: Payment overdue
-   `posted`: Transaction posted

#### Category Values:

-   `light`: Electricity expenses
-   `fixed`: Fixed expenses (Prolabori, employee, fuel, etc.)
-   `other`: Other expenses

#### Purpose Values:

-   `client`: Expense for client
-   `internal`: Internal company expense

#### Purchase Method Values:

-   `card`: Credit/debit card
-   `pix`: PIX transfer
-   `boleto`: Bank slip
-   `automatic_debit`: Automatic debit

### Trips (Viagens)

The Trips entity represents travel and logistics management in the system:

#### Fields:

-   `id` (string): Unique identifier
-   `name` (string): Trip title/name
-   `destination` (string): Trip destination
-   `date` (string): Trip date (ISO format)
-   `numberOfTolls` (number): Number of tolls encountered
-   `costOfTolls` (number): Total cost of tolls
-   `numberOfLunches` (number): Number of lunches during the trip
-   `costOfLunches` (number): Total cost of lunches
-   `costOfFuel` (number): Fuel cost for the trip
-   `numberOfServices` (number): Number of services performed during the trip
-   `totalCost` (number): Total trip cost
-   `notes` (string, optional): Additional notes about the trip
-   `createdAt` (string): Creation timestamp (ISO format)

#### Calculated Fields:

-   `costPerService` (calculated): Total cost divided by number of services (totalCost / numberOfServices)

### Employees (Funcionários)

The Employees entity represents employee management and human resources in the system:

#### Fields:

-   `id` (string): Unique identifier
-   `name` (string): Full name of the employee
-   `code` (string): Employee code/ID number
-   `email` (string): Employee email address
-   `phone` (string): Employee phone number
-   `position` (string): Job position/title
-   `department` (string): Department the employee belongs to
-   `hireDate` (string): Date when employee was hired (ISO format)
-   `salary` (number): Employee salary amount
-   `status` (enum): Employment status - 'active', 'inactive', 'on_leave'
-   `address` (string, optional): Employee address
-   `city` (string): City where employee lives
-   `state` (string): State where employee lives
-   `emergencyContact` (string, optional): Emergency contact person name
-   `emergencyPhone` (string, optional): Emergency contact phone number
-   `bankAccount` (string, optional): Bank account number
-   `bankBranch` (string, optional): Bank branch number
-   `bankCode` (string, optional): Bank code
-   `notes` (string, optional): Additional notes about the employee
-   `createdAt` (string): Creation timestamp (ISO format)

#### Status Values:

-   `active`: Employee is currently working
-   `inactive`: Employee is no longer working
-   `on_leave`: Employee is temporarily away (vacation, sick leave, etc.)

### IMPORTANT:

-   Always read carpmanager.md before writing any code.
-   After adding a major feature or completing a milestone, update carpmanager.md.
-   Document the entire database schema in carpmanager.md.
-   For new migrations, make sure to add them to the same file.
-   This app is meant to be in portuguese, so do all the Typography in Portuguese language
