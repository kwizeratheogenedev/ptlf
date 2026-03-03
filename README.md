# Professional IT Portfolio

A full-stack MERN (MongoDB, Express, React, Node.js) portfolio application for IT professionals. Features a public portfolio site and a hidden admin dashboard for managing content.

## Features

### Public Portfolio
- **Home Page**: Hero section, skills, services preview, achievements preview
- **Services Page**: Browse all services with category filtering
- **Achievements Page**: View certifications, awards, projects
- **Contact Form**: Send messages to the portfolio owner

### Hidden Admin Dashboard
- Access directly via: `http://localhost:3000/admin`
- **Dashboard**: Overview of all content with quick actions
- **Manage Services**: Add, edit, delete services
- **Manage Achievements**: Add, edit, delete achievements with document uploads
- **Messages**: View and manage contact form submissions
- **Profile**: Update personal information, skills, and social links

## Tech Stack

- **Frontend**: React 18, React Router, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Styling**: Custom CSS

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)

### Installation

1. **Install Backend Dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Install Frontend Dependencies:**
   ```bash
   cd ../client
   npm install
   ```

3. **Configure Environment:**

   Backend (backend/.env):
   ```env
   MONGODB_URI=mongodb://localhost:27017/portfolio
   JWT_SECRET=your_super_secret_key_change_this
   PORT=5000
   FRONTEND_URL=http://localhost:3000
   ```

   Frontend (client/.env):
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

### Seeding Default Data

Populate the database with sample services, achievements, and an admin user:

```bash
cd backend
npm run seed
```

This creates:
- 6 sample services
- 6 sample achievements
- 1 admin user (credentials below)

### Running the Application

1. **Start Backend:**
   ```bash
   cd backend
   npm start
   ```

2. **Start Frontend:**
   ```bash
   cd client
   npm start
   ```

### Admin Access

- **URL:** `http://localhost:3000/admin` (not linked publicly)
- **Email:** admin@example.com
- **Password:** admin123

⚠️ **Change the admin password after first login!**

## Project Structure

```
ptfl/
├── backend/
│   ├── config/db.js              # MongoDB connection
│   ├── middleware/auth.js       # JWT authentication
│   ├── models/                  # Mongoose schemas
│   ├── routes/                  # API endpoints
│   ├── seed.js                  # Database seeder
│   ├── .env.example
│   └── server.js
├── client/
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   ├── context/             # React contexts
│   │   ├── pages/               # Page components
│   │   │   └── admin/          # Hidden admin pages
│   │   └── styles/             # CSS styles
│   └── .env.example
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Profile
- `GET /api/profile` - Get profile
- `PUT /api/profile` - Update profile (protected)

### Services
- `GET /api/services` - Get all active services
- `POST /api/services` - Create service (protected)
- `PUT /api/services/:id` - Update service (protected)
- `DELETE /api/services/:id` - Delete service (protected)

### Achievements
- `GET /api/achievements` - Get all achievements
- `POST /api/achievements` - Create achievement (protected)
- `PUT /api/achievements/:id` - Update achievement (protected)
- `DELETE /api/achievements/:id` - Delete achievement (protected)

### Messages
- `POST /api/messages` - Send message
- `GET /api/messages` - Get all messages (protected)
- `DELETE /api/messages/:id` - Delete message (protected)

## Customization

Edit the seed file or use the admin dashboard to customize:
- Profile information (name, title, bio, social links)
- Services offered
- Achievements and certifications
- Skills list

## License

MIT License
