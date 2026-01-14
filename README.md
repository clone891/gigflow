GigFlow 🚀

A Full-Stack Freelance Marketplace (MERN Stack)

GigFlow is a full-stack freelance marketplace where clients post gigs, freelancers place bids, and clients hire one bidder, closing the gig.
The project focuses on real backend business logic, secure authentication, and correct state transitions, rather than just UI.

This project was built as part of a Full-Stack Development Internship Assignment.

✨ Features
🔐 Authentication & Authorization

User signup & login

JWT authentication with HTTP-only cookies

Persistent login (refresh safe)

Role-based access control (Client / Freelancer)

📦 Gig Management

Clients can create gigs

Anyone can browse open gigs

Assigned gigs are automatically hidden from public listing

💼 Bidding System

Freelancers can place one bid per gig

Bids are blocked if a gig is already assigned

All bids are stored and validated in the database

🧑‍💼 Hiring Logic (Core Feature)

Only the gig owner can view bids

Client can hire exactly one bidder

On hiring:

Selected bid → hired

All other bids → rejected

Gig status → assigned

No new bids allowed after hiring

🧠 Business Rules Enforced

Owner-only bid visibility

Single bid per user per gig

Correct gig lifecycle (open → assigned)

Proper error handling (400, 401, 403, 404)

🛠 Tech Stack
Frontend

React (Vite)

Redux Toolkit

React Router

Tailwind CSS

Axios

Backend

Node.js

Express.js

MongoDB

Mongoose

JWT (JSON Web Tokens)

Cookie-based authentication

Tools

Postman (API testing)

MongoDB Compass

Git & GitHub

🗂 Database Schema
User

name

email

password (hashed)

role (owner | bidder)

Gig

title

description

budget

ownerId

status (open | assigned)

Bid

gigId

bidderId

amount

message

status (pending | hired | rejected)

🔗 API Endpoints
Authentication
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me

Gigs
POST   /api/gigs        (protected)
GET    /api/gigs        (public)

Bids
POST   /api/bids              (protected)
GET    /api/bids/:gigId       (owner only)
POST   /api/bids/hire         (owner only)

🔄 Application Flow

User registers as Client or Freelancer

Client creates a gig

Freelancers place bids on open gigs

Client views all bids for their gig

Client hires one bidder

Gig is closed and bidding is disabled

🧪 Testing

Backend APIs tested using Postman

Database verified using MongoDB Compass

Authentication and authorization tested across multiple users

Edge cases (duplicate bids, unauthorized access, closed gigs) handled correctly

🚀 Getting Started
1️⃣ Clone the Repository
git clone https://github.com/your-username/gigflow.git
cd gigflow

2️⃣ Install Dependencies
Backend
cd server
npm install

Frontend
cd client
npm install

3️⃣ Environment Variables (server/.env)
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

4️⃣ Run the App
Backend
cd server
npm run dev

Frontend
cd client
npm run dev

📌 Project Status

✔ Core requirements completed
✔ Backend business logic implemented
✔ Secure authentication & authorization
✔ Bidding and hiring workflow finished

Frontend bidding & hiring UI can be added incrementally (backend already supports it).

🧠 What This Project Demonstrates

Real-world backend design

Secure authentication practices

Role-based access control

Database relationship modeling

Clean REST API architecture

Strong debugging & problem-solving skills

📄 License

This project is for educational and evaluation purposes.

👤 Author

Vaibhav
Full-Stack Developer (Internship Project)