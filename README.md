# CarePoint Health

**A Full-Stack Hospital Management System**

CarePoint Health is a web-based hospital management platform designed to simplify interactions between patients, doctors. It provides appointment booking, doctor availability management, and consultation records through role-based access.

## Project Highlights

- **Concurrency-Safe Booking**: Used pessimistic database locking to prevent duplicate bookings during simultaneous appointment requests.
- **Dynamic Slot Generation**: Enabled doctors to generate future appointment slots based on their working hours and consultation duration.
- **Appointment Lifecycle Management**: Implemented booking, cancellation, and rescheduling with consistent slot availability and conflict prevention.
- **Database Versioning**: Used Flyway migrations to manage incremental schema changes across development and production environments.
  
## ✨ Features

### 👤 Authentication & Authorization
- Patient and doctor registration and login.
- JWT-based authentication.
- Role-based access control for Patients, Doctors.

### 🧑‍⚕️ Doctor Features
- Manage doctor profiles.
- Create individual appointment slots.
- Generate multiple appointment slots for a selected date.
- View and manage appointments.
- Add consultation details for completed appointments.

### 🧑 Patient Features
- Search doctors by specialization.
- View doctor profiles and available appointment slots.
- Book appointments.
- Reschedule or cancel appointments.
- View appointment history and consultation records.

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, TypeScript, Tailwind CSS, shadcn/ui |
| State & Data Fetching | TanStack Query |
| HTTP Client | Axios |
| Backend | Java, Spring Boot |
| Security | Spring Security, JWT |
| Database | PostgreSQL |
| ORM | Spring Data JPA, Hibernate |
| Database Migrations | Flyway |
| API Documentation | Swagger / OpenAPI |
| Deployment | Vercel, Render, Aiven |

## 🏗️ Architecture

The application follows a client-server architecture.

```text
React + TypeScript Frontend
          |
          | REST APIs (Axios)
          | JWT Authentication
          v
Spring Boot Backend
          |
          | Spring Data JPA
          v
    PostgreSQL Database
```

## 🔐 Security

- JWT-based stateless authentication.
- Password hashing using BCrypt.
- Endpoint authorization based on user roles.
- Protected resources and role-specific operations.
- Backend validation for critical business operations.

## 🌐 Live Demo

- **Frontend:** [Vercel deployment URL](https://care-point-health-eta.vercel.app)
- **API Documentation:** [Swagger URL](https://carepoint-health-rkl9.onrender.com/swagger-ui/index.html#/)

## 👨‍💻 Author

Developed as a full-stack project to demonstrate REST API development, authentication, database management, and modern frontend development.
