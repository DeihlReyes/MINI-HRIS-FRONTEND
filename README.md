# Mini HRIS Frontend

A comprehensive Human Resource Information System (HRIS) frontend application demonstrating modern web development practices with role-based access control, advanced data tables, and real-time leave management.

## 📋 Project Overview

This is a full-featured HRIS frontend application that manages:
- **Employee Management** - Create, read, update, delete employee records
- **Department Management** - Organize employees by departments
- **Leave Management** - Track leave requests, approvals, and allocations
- **Leave Types** - Define and manage different types of leave
- **Role-Based Access Control** - Separate HR and Employee roles with appropriate permissions

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm or yarn package manager

### Installation & Running

1. **Clone or extract the project**
   ```bash
   cd mini-hris-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - The application will auto-reload as you make changes

### Build for Production

```bash
npm run build
npm start
```

## 🔐 Demo Users

### HR User
- **Role**: HR Admin
- **Permissions**: Full access to all features
- **Demo**: System detects role from localStorage (demo implementation)

### Employee User
- **Role**: Employee
- **Permissions**: View own profile, apply for leave, view leave status
- **Demo**: System detects role from localStorage (demo implementation)

**Note**: Role switching is managed in localStorage for demo purposes. In production, this would be handled by your authentication backend.

## 📱 Features

### Core Functionality

#### Employees
- View all employees with advanced filtering and search
- Create new employee records
- Edit employee information
- Delete employee records
- Mobile-responsive employee list

#### Departments
- Manage company departments
- Assign managers to departments
- Track active/inactive status
- Inline edit and delete with confirmation

#### Leave Types
- Create different types of leave (Annual, Sick, Casual, etc.)
- Set default allocation days
- Configure paid/unpaid status
- Require approval settings

#### Leave Management
- **Apply for Leave** - Employees can request leave
- **Approve/Reject** - HR can review and approve/reject requests
- **Leave Allocations** - View allocated days per employee per year
- **Auto-Allocate** - HR can bulk allocate default leave to all employees
- **Year Filtering** - View allocations by year

#### Advanced Data Tables
All data tables feature:
- **Sorting** - Click column headers to sort
- **Searching** - Filter by employee name, leave type, etc.
- **Pagination** - Navigate pages with customizable page sizes (10, 20, 30, 40, 50)
- **Column Visibility** - Show/hide columns via view options
- **Mobile Responsive** - Optimized for all screen sizes
- **Custom Filters** - Status filters, year filters, and more

### Role-Based Features

**HR Features:**
- Access to all employee data
- Create/edit/delete employees and departments
- Approve or reject leave requests
- Auto-allocate leave to all employees
- View all leave requests (not just their own)

**Employee Features:**
- View only own profile (if implemented)
- Apply for leave
- View own leave requests and status
- Check remaining leave balance

## 🛠 Tech Stack

- **Framework**: Next.js 16.1.6
- **Runtime**: React 19.2.3
- **Language**: TypeScript (strict mode)
- **Table Library**: TanStack React Table (@tanstack/react-table)
- **UI Components**: Shadcn UI (Radix UI + Tailwind CSS)
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Styling**: Tailwind CSS
- **Date Handling**: date-fns

## 📁 Project Structure

```
src/
├── app/                          # Next.js app router
│   ├── (dashboard)/              # Protected routes
│   │   ├── employees/            # Employee pages
│   │   ├── departments/          # Department pages
│   │   ├── leaves/               # Leave pages
│   │   └── leave-allocations/    # Allocation pages
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
├── components/
│   ├── employees/                # Employee components
│   ├── departments/              # Department components
│   ├── leaves/                   # Leave components
│   ├── forms/                    # Form components
│   ├── layout/                   # Layout components
│   ├── ui/                       # Shadcn UI components
│   │   ├── data-table.tsx        # Main data table
│   │   ├── data-table-toolbar.tsx
│   │   ├── data-table-pagination.tsx
│   │   └── ...
│   └── auth/                     # Auth/role guard components
├── lib/
│   ├── api/                      # API client functions
│   └── validations/              # Zod validation schemas
├── types/                        # TypeScript interfaces
└── contexts/                     # React contexts (user, auth)
```

## 🔌 API Integration

The application connects to a backend API for:
- Employee CRUD operations
- Department management
- Leave request handling
- Leave allocation tracking
- Leave type management

**Backend Configuration**: Update API endpoints in `/lib/api/client.ts`

## 📝 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Type checking
npm run type-check
```

## 🎯 Usage Examples

### View Leave Allocations
1. Navigate to `/leave-allocations`
2. See all employees with their allocated and remaining days
3. Filter by year using the year selector
4. HR can click "Auto-Allocate" to bulk allocate leave

### Apply for Leave (Employee)
1. Go to `/leaves/new`
2. Select leave type, start date, and end date
3. Add optional remarks
4. Submit the form

### Approve Leave (HR)
1. Go to `/leaves`
2. See all pending leave requests
3. Click view icon on a request
4. Accept or reject with optional comments

### Manage Employees
1. Go to `/employees`
2. Use search to find employees
3. Click edit to modify details
4. Click delete to remove employee (requires confirmation)

## 🚦 Status Colors

- **Badge Colors**: 
  - Green (Active/Approved/Paid)
  - Gray (Inactive/Pending/Unpaid)
  - Red (Rejected/Terminated)
  - Blue (On Leave)

## 📱 Mobile Responsiveness

All pages and components are fully responsive:
- **Mobile**: Optimized for touch, stacked layouts
- **Tablet**: Medium layouts with side-by-side elements
- **Desktop**: Full width, multiple columns

## 🤝 Demo Features

- **Local Storage Role** - Toggle between HR and Employee roles (check browser console or localStorage)
- **Sample Data** - Pre-loaded with demo employees and departments
- **Real-time Updates** - Data updates reflected immediately in the UI

## ⚠️ Important Notes

1. **Authentication**: This is a demo. In production, implement proper JWT/OAuth authentication
2. **Role Management**: Currently uses localStorage for demo purposes
3. **API Connection**: Ensure backend is running before starting the frontend
4. **Environment Variables**: Add `.env.local` for API base URL if needed

## 🔍 Testing Workflows

### Test Leave Allocation Flow
1. Create employees
2. Create leave types
3. Use Auto-Allocate to assign leaves
4. Create leave requests
5. Approve/reject requests
6. Verify remaining days update

### Test Role-Based Access
1. Switch to HR role → See all features
2. Switch to Employee role → See limited features
3. Verify leave approval only shows for HR