# QuickBook - Meeting Room Booking System

A comprehensive meeting room booking system with separate frontend applications for users and administrators. The system is built using Spring Boot for the backend and React (Vite) for the frontend applications.

## Project Structure

```
QuickBook/
├── Backend/            # Spring Boot backend application
├── Frontend for Admin/ # Admin dashboard application
└── Frontend for Users/ # User-facing application
```

## Features

### User Application
- User authentication and registration with OTP verification
- Room browsing and booking functionality
- Personal dashboard for managing bookings
- Real-time chat bot assistance
- Feedback submission system
- Profile management
- Responsive design for all devices

### Admin Application
- Secure admin authentication
- Comprehensive dashboard with statistics
- User management
- Room management
- Reservation oversight
- Feedback management
- Advanced booking analytics

### Backend
- RESTful API endpoints
- Secure authentication and authorization
- Database management
- Email notifications
- Business logic implementation

## Technology Stack

### Backend
- Java Spring Boot
- Spring Security
- Spring Data JPA
- Maven for dependency management
- MySQL/PostgreSQL (Database)

### Frontend (Both Admin & User)
- React 18+
- Vite as build tool
- Modern JavaScript (ES6+)
- CSS Modules for styling
- Custom hooks for state management
- Responsive design components

## Getting Started

### Prerequisites
- Java 17 or higher
- Node.js 16 or higher
- npm/yarn
- MySQL/PostgreSQL database

### Backend Setup
1. Navigate to the Backend directory:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   ./mvnw install
   ```
3. Configure application.properties with your database settings
4. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```

### Frontend Setup (Admin)
1. Navigate to the Admin frontend directory:
   ```bash
   cd "Frontend for Admin"
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup (Users)
1. Navigate to the Users frontend directory:
   ```bash
   cd "Frontend for Users"
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Development

### Backend Development
- API endpoints are documented using Swagger/OpenAPI
- Follow standard Spring Boot best practices
- Write unit tests for new features
- Keep the code modular and maintainable

### Frontend Development
- Follow React best practices
- Use component-based architecture
- Implement responsive design
- Write clean, maintainable code
- Use CSS modules for styling

## Production Deployment

### Backend
1. Build the application:
   ```bash
   ./mvnw clean package
   ```
2. Deploy the generated JAR file

### Frontend
1. Build the production version:
   ```bash
   npm run build
   ```
2. Deploy the contents of the dist directory

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details

## Support
For support, please contact the development team or raise an issue in the repository.
