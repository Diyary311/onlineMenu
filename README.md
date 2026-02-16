# Online Menu - Full Stack Application

A modern online menu application with QR code generation and interactive 3D item viewing capabilities.

## 🚀 Features

### Frontend (React + Vite)
- **QR Code Generation** - Share menu items via scannable QR codes
- **3D Item Viewer** - Interactive 3D visualization of menu items using React Three Fiber
- **Responsive Design** - Works seamlessly on desktop and mobile
- **Menu Categories** - Foods, Drinks, and Sweets
- **User Authentication** - Login/Registration system
- **Admin Panel** - Manage menu items and categories

### Backend (.NET Core + EF Core)
- **RESTful API** - Well-structured endpoints for menu management
- **Entity Framework Core** - Database ORM with migrations
- **Authentication** - JWT-based authentication
- **CRUD Operations** - Full Create, Read, Update, Delete for menu items
- **Category Management** - Dynamic categories for menu organization

## 📁 Project Structure

```
onlinemenu/
├── frontend/          # React application
│   ├── src/
│   │   ├── Components/
│   │   │   ├── QRCodeGenerator.jsx      # QR code generation
│   │   │   ├── ItemViewer3D.jsx         # 3D item viewer
│   │   │   ├── Foods/                   # Food items components
│   │   │   ├── Drinks/                  # Drink items components
│   │   │   └── Sweets/                  # Sweet items components
│   │   └── config.js                    # API configuration
│   └── package.json
│
└── backend/           # .NET Core API
    ├── Controllers/   # API controllers
    ├── Model/         # Data models & DTOs
    ├── data/          # DbContext
    └── Program.cs
```

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool
- **React Router** - Navigation
- **React Three Fiber** - 3D rendering
- **@react-three/drei** - 3D helpers
- **qrcode.react** - QR code generation
- **Tailwind CSS** - Styling
- **Motion** - Animations

### Backend
- **.NET Core** - Web framework
- **Entity Framework Core** - ORM
- **PostgreSQL/SQL Server** - Database
- **JWT** - Authentication

## 📦 Installation

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`

### Backend Setup

```bash
cd backend
dotnet restore
dotnet ef database update
dotnet run
```

The backend API will run on `http://localhost:5256`

## 🌐 Deployment

### Frontend Deployment (Vercel/Netlify)
1. Push this repo to GitHub
2. Connect to Vercel or Netlify
3. Set build directory to `frontend`
4. Build command: `npm run build`
5. Output directory: `dist`

### Backend Deployment (Railway/Render)
1. Create new service from GitHub repo
2. Set root directory to `backend`
3. Add PostgreSQL database
4. Set environment variables:
   - `DATABASE_URL` (provided by Railway/Render)
5. Deploy!

## 🔧 Configuration

Update the API URL in `frontend/src/config.js`:

```javascript
// For development
export const API_BASE_URL = "http://localhost:5256";

// For production (after deployment)
export const API_BASE_URL = "https://your-backend-url.com";
```

## 📱 QR Code Feature

1. **Navbar QR Code**: Click the QR button to share the current page
2. **Item QR Codes**: Hover over any menu item and click "QR Code"
3. **Scan to View**: Scan with phone camera to view item in 3D

## 🎮 3D Viewer Controls

- **Click + Drag**: Rotate view
- **Scroll/Pinch**: Zoom in/out
- **Right-click + Drag**: Pan view
- **Auto-rotate**: Enabled by default

## 👥 User Roles

- **Guest**: Browse menu items
- **User**: Browse + access 3D views
- **Admin**: Full CRUD operations on menu items

## 🔗 API Endpoints

### Foods
- `GET /api/food` - Get all foods
- `GET /api/food/{id}` - Get food by ID
- `POST /api/food` - Create food (Admin)
- `PUT /api/food/{id}` - Update food (Admin)
- `DELETE /api/food/{id}` - Delete food (Admin)

### Drinks
- `GET /api/drink` - Get all drinks
- `GET /api/drink/{id}` - Get drink by ID
- `POST /api/drink` - Create drink (Admin)
- `PUT /api/drink/{id}` - Update drink (Admin)
- `DELETE /api/drink/{id}` - Delete drink (Admin)

### Sweets
- `GET /api/sweet` - Get all sweets
- `GET /api/sweet/{id}` - Get sweet by ID
- `POST /api/sweet` - Create sweet (Admin)
- `PUT /api/sweet/{id}` - Update sweet (Admin)
- `DELETE /api/sweet/{id}` - Delete sweet (Admin)

## 📄 License

MIT

## 👨‍💻 Author

Diyary - [GitHub](https://github.com/Diyary311)

---

**Built with ❤️ using React, .NET Core, and Three.js**
