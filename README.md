# SACCOS Management System

A comprehensive Savings and Credit Cooperative Society (SACCOS) management system built with Node.js, Express, React, and SQLite.

## Features

- **User Management**: Create and manage users with role-based access
- **Membership Management**: Track member memberships and monthly contributions
- **Payment Processing**: Record and track payments for monthly contributions
- **Dashboard**: View system overview and statistics
- **RESTful API**: Clean, organized API structure following best practices

## Project Structure

```
saccos/
├── src/                    # Backend source code
│   ├── config/             # Configuration files
│   │   ├── database.js     # Database connection
│   │   └── env.js          # Environment configuration
│   ├── controllers/        # Request handlers
│   │   ├── UserController.js
│   │   ├── RoleController.js
│   │   ├── MembershipController.js
│   │   ├── MonthlyContributionController.js
│   │   └── PaymentController.js
│   ├── services/           # Business logic
│   │   ├── UserService.js
│   │   ├── RoleService.js
│   │   ├── MembershipService.js
│   │   ├── MonthlyContributionService.js
│   │   └── PaymentService.js
│   ├── models/             # Data access layer
│   │   ├── UserModel.js
│   │   ├── RoleModel.js
│   │   ├── MembershipModel.js
│   │   ├── MonthlyContributionModel.js
│   │   └── PaymentModel.js
│   ├── middleware/         # Express middleware
│   │   ├── errorHandler.js
│   │   └── validator.js
│   ├── routes/             # API routes
│   │   ├── index.js
│   │   ├── userRoutes.js
│   │   ├── roleRoutes.js
│   │   ├── membershipRoutes.js
│   │   ├── contributionRoutes.js
│   │   └── paymentRoutes.js
│   └── db/                 # Database initialization
│       └── init-db.js
├── front-end/              # Frontend React application
│   └── src/
│       ├── components/     # React components
│       ├── services/       # API service layer
│       ├── hooks/          # Custom React hooks
│       └── utils/          # Utility functions
├── app.js                  # Main application entry point
├── database.sqlite         # SQLite database (generated)
└── package.json
```

## Architecture

The project follows a **layered architecture** pattern:

1. **Routes Layer**: Define API endpoints and map them to controllers
2. **Controller Layer**: Handle HTTP requests/responses
3. **Service Layer**: Implement business logic and validation
4. **Model Layer**: Handle database operations
5. **Middleware**: Error handling, validation, and cross-cutting concerns

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd saccos
```

2. Install backend dependencies:
```bash
npm install
```

3. Install frontend dependencies:
```bash
cd front-end
npm install
cd ..
```

4. Initialize the database:
```bash
npm run init-db
```

### Running the Application

1. Start the backend server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

The backend will run on `http://localhost:3000`

2. Start the frontend development server (in a new terminal):
```bash
cd front-end
npm run dev
```

The frontend will run on `http://localhost:5173`

## API Endpoints

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create a new user

### Roles
- `POST /api/roles` - Create a new role

### Memberships
- `GET /api/memberships` - Get all memberships
- `POST /api/memberships` - Create a new membership

### Monthly Contributions
- `GET /api/monthly_contributions` - Get all contributions
- `POST /api/monthly_contributions` - Create a new contribution

### Payments
- `GET /api/payments` - Get all payments
- `POST /api/payments` - Create a new payment

## Database Schema

The system uses SQLite with the following main tables:
- `roles` - User roles (admin, member, etc.)
- `users` - System users
- `memberships` - Member memberships
- `monthly_contributions` - Monthly contribution records
- `payments` - Payment transactions

## Development

### Code Organization

- **Backend**: Follows MVC-like pattern with clear separation of concerns
- **Frontend**: Uses React hooks and service layer for API calls
- **Error Handling**: Centralized error handling middleware
- **Validation**: Input validation in service layer

### Best Practices Implemented

- ✅ Separation of concerns (Controllers, Services, Models)
- ✅ Error handling middleware
- ✅ Input validation
- ✅ Environment configuration
- ✅ Database connection management
- ✅ RESTful API design
- ✅ React hooks for data fetching
- ✅ Centralized API service layer

## Environment Variables

Create a `.env` file (optional) to customize:
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `CORS_ORIGIN` - Frontend origin (default: http://localhost:5173)

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

