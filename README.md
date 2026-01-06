# Bookxpert Employee Management Dashboard

A React.js web application for managing employee data with authentication, CRUD operations, and modern UI design.

##  Tech Stack

- **Frontend Framework**: React.js 18+ with TypeScript
- **Routing**: React Router DOM v6
- **State Management**: React Context API
- **Styling**: Custom CSS with CSS Variables
- **Data Persistence**: localStorage
- **ID Generation**: UUID

##  Features

### Authentication
- Mock login system with email/password
- Protected routes for authenticated users only
- Session persistence using localStorage

### Employee Management
- **Create**: Add new employees with profile image upload
- **Read**: View all employees in a sortable, filterable table
- **Update**: Edit existing employee information
- **Delete**: Remove employees with confirmation modal

### Dashboard Features
- Statistics cards showing total, active, and inactive employee counts
- Search functionality across employee names
- Filter by gender (Male/Female/Other)
- Filter by status (Active/Inactive)
- Print individual employee details

### UI/UX
- Modern, responsive design
- Clean and intuitive interface
- Loading states and error handling
- Confirmation modals for destructive actions

##  Data Model

### Employee Fields
| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier (UUID) |
| fullName | string | Employee's full name |
| gender | string | Male, Female, or Other |
| dateOfBirth | string | Date of birth (YYYY-MM-DD) |
| profileImage | string | Base64 encoded image |
| state | string | Indian state |
| isActive | boolean | Employment status |

## Login Credentials

For testing purposes, use these mock credentials:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@company.com | admin123 |
| User | user@company.com | user123 |

##  Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Steps

1. **Navigate to project directory**
   ```bash
   cd employee-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

##  Project Structure

```
employee-dashboard/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── DashboardStats.tsx
│   │   ├── DeleteModal.tsx
│   │   ├── EmployeeFilters.tsx
│   │   ├── EmployeeList.tsx
│   │   └── ProtectedRoute.tsx
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   └── EmployeeContext.tsx
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── EmployeeForm.tsx
│   │   └── Login.tsx
│   ├── styles/
│   │   └── index.css
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   └── index.tsx
├── package.json
├── tsconfig.json
└── README.md
```

##  Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Runs the app in development mode |
| `npm build` | Builds the app for production |
| `npm test` | Runs the test suite |

## Responsive Design

The application is fully responsive and works on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

##  Data Persistence

All data is stored in the browser's localStorage:
- `auth`: Authentication state and user information
- `employees`: Array of employee records

##  Key Implementation Details

1. **Context API**: Used for global state management (Auth & Employee data)
2. **Protected Routes**: Dashboard and employee forms require authentication
3. **Image Handling**: Profile images are converted to Base64 for storage
4. **Form Validation**: Client-side validation for all input fields
5. **Print Feature**: Opens new window with formatted employee details

##  License

This project was created as part of a web development assignment.

---

Built by Guduru Lakshmi Tanuja using React.js and TypeScript
