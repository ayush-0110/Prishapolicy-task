# HR Dashboard

## Overview
HR Dashboard is a comprehensive human resources management system designed to facilitate HR operations including employee management, bulk import of employee data, and handling dependents. Built with React, TypeScript, and tRPC, it utilizes Prisma as an ORM for efficient database management.

## Features
- **Employee Management**: Employees can add, update, and delete their dependents, while HR can add, update and delete employees.
- **Bulk Import**: Upload employee data in bulk using a CSV file.
- **Authentication**: Manage session-based authentication for HR managers and employees.
- **Real-Time Updates**: Utilize tRPC for real-time updates without the need for additional polling or configuration.

## Tech Stack
- **Frontend**: React with typescript, React Toastify for notifications.
- **Backend**: Node, Express with TypeScript, tRPC for API management.
- **Database**: PostgreSQL with Prisma ORM.
- **Styling**: CSS Modules for scoped and maintainable CSS.

## Project Structure
```plaintext
/project-root
|-- client/
    |-- public/
    |-- src/
    |   |-- components/        # Reusable components like Modal, Layout, etc.
    |   |-- pages/             # Application pages
    |   |-- utils/             # Utility functions including tRPC setup
|-- server/
   |-- middleware/           # tRPC routers
   |-- routes/           # tRPC routers
   |-- prisma/            # Prisma schema
    -- .env                   # Environment variables
    -- tsconfig.json          # TypeScript configuration
```
### Installation

Make sure you have PostgreSQL database, VSCode installed and properly configured.

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Install backend dependencies.
     ```javascript
     npm install
     ```
    If some error occurs, add --force flag.
3. Run the Prisma migrations:
  ```javascript
  npx prisma migrate dev --init
  ```
4. Install frontend dependencies.
     ```javascript
     npm install
     ```
     again, add --force flag for error case.
5. Set up your environment variables in `.env` file for backend (Create it inside server folder).
     ```bash
     DATABASE_URL= your postgreSQL database URL.
     JWT_SECRET= your own secret
     
     ```
6. Start the backend server with npm start.
7. Start the frontend application in another terminal with npm start.

### Usage
- HR Manager: Log in as an HR manager to add, edit, or delete employee records and manage bulk imports.
- Employee: Log in as an employee to view and manage personal and dependent details.

### References:
  - React Documentation
  - Prisma Docs
  - tRPC docs

### Images:

1. Login Page : ![image](https://github.com/ayush-0110/Prishapolicy-task/assets/85434037/ac7794be-8121-46b7-9333-6e941ba119c8)
2. Register Page: ![image](https://github.com/ayush-0110/Prishapolicy-task/assets/85434037/b1b6294e-718f-4a0f-a917-e1e0d0c6cfe5)
3. Login as HR: ![image](https://github.com/ayush-0110/Prishapolicy-task/assets/85434037/d2bd83c1-c237-4110-a622-dbf921c6067a)
4. HR Dashboard: ![image](https://github.com/ayush-0110/Prishapolicy-task/assets/85434037/95016297-a006-4da2-8ff5-8f094677b9a9)
5. HR Dashboard Employee details: ![image](https://github.com/ayush-0110/Prishapolicy-task/assets/85434037/8b30c25d-b0f0-4496-985e-0ab5e0c058a8)
6. Add Employee in HR dashboard: ![image](https://github.com/ayush-0110/Prishapolicy-task/assets/85434037/e607ee37-3442-4301-a6c6-2ce1a9891a03)
7. Bulk import: ![image](https://github.com/ayush-0110/Prishapolicy-task/assets/85434037/704e4acb-ddf7-4947-8b1b-0c6b4596768c)
8. After logout, back to login screen: ![image](https://github.com/ayush-0110/Prishapolicy-task/assets/85434037/34dc5275-d577-4dde-9f88-3137a78e8da2)
9. Employee page: ![image](https://github.com/ayush-0110/Prishapolicy-task/assets/85434037/7ff41c37-33b6-491b-88a1-46906971ea6c)
10. Add dependent: ![image](https://github.com/ayush-0110/Prishapolicy-task/assets/85434037/4ffff2c3-575f-4937-8877-bd0447f78faa)
11. Update dependent: ![image](https://github.com/ayush-0110/Prishapolicy-task/assets/85434037/d9f7d94d-7df1-496d-a354-1ea8e474629f)










