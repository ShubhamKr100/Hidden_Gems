# Hidden Gems

**Hidden Gems** is a comprehensive full-stack web application designed to connect users with local culinary hosts. The platform allows users to discover authentic, home-hosted dining experiences, book meals, and leave reviews, while empowering hosts to manage their kitchen profiles and incoming bookings.

## 🚀 Key Features

*   **User Authentication & Security:** Secure registration, login, password reset, and forgotten password workflows utilizing JWT tokens (`generateToken.js`) and secure middleware (`authMiddleware.js`).
*   **Host Management:** Dedicated interfaces for users to become hosts (`BecomeHostPage.jsx`), manage their kitchen (`MyKitchenPage.jsx`), edit host details (`HostEditPage.jsx`), and track reservations (`HostBookingsPage.jsx`).
*   **Discovery & Booking System:** Interactive discovery of meals (`FindMealsPage.jsx`) and a complete booking lifecycle from reservation to payment confirmation (`PaymentSuccessPage.jsx`, `MyBookingsPage.jsx`)[cite: 1].
*   **Review & Rating Engine:** Integrated review system (`ReviewForm.jsx`) mapped to database models (`Review.js`) for community trust and feedback[cite: 1].
*   **AI Integration:** Embedded artificial intelligence features handled via backend controllers (`aiController.js`, `test-ai.js`) to enhance user experience or search capabilities[cite: 1].
*   **Automated Notifications:** Built-in email service (`sendEmail.js`) for sending transactional updates and alerts[cite: 1].

## 🛠 Tech Stack

*   **Frontend:** React, Vite, HTML/CSS[cite: 1]
*   **Backend:** Node.js, Express.js[cite: 1]
*   **Database:** (Implied Document/SQL Database via Mongoose/Sequelize models)[cite: 1]
*   **Architecture:** RESTful API with distinct client-server separation[cite: 1]

## 🏗 System Architecture

The project follows a standard decoupled Client-Server architecture[cite: 1]. 

1.  **Presentation Tier (React Client):** Handles state management, UI rendering, and client-side routing. All external API communications are centralized through `api.js`[cite: 1].
2.  **Application Tier (Node.js/Express Backend):** Handles business logic, request validation (`errorMiddleware.js`), and authentication routing (`index.js`)[cite: 1].
3.  **Data Tier (Models):** Maps application objects to database collections/tables (`User.js`, `HostProfile.js`, `Booking.js`, `Review.js`)[cite: 1].

### Directory Structure

```text
Hidden_Gems/
├── backend/                        # Node.js Express API Server[cite: 1]
│   ├── controllers/                # Request handlers and business logic[cite: 1]
│   │   └── aiController.js         # AI feature integration[cite: 1]
│   ├── middleware/                 # Custom Express middlewares[cite: 1]
│   │   ├── authMiddleware.js       # JWT validation and route protection[cite: 1]
│   │   └── errorMiddleware.js      # Global error handling[cite: 1]
│   ├── models/                     # Database schema definitions[cite: 1]
│   │   ├── Booking.js              # Booking transaction schema[cite: 1]
│   │   ├── HostProfile.js          # Host/Kitchen metadata schema[cite: 1]
│   │   ├── Review.js               # User rating/review schema[cite: 1]
│   │   └── User.js                 # Core user account schema[cite: 1]
│   ├── utils/                      # Helper functions[cite: 1]
│   │   ├── generateToken.js        # JWT generation utility[cite: 1]
│   │   └── sendEmail.js            # SMTP/Email service wrapper[cite: 1]
│   ├── index.js                    # Backend application entry point[cite: 1]
│   └── test-ai.js                  # AI utility testing script[cite: 1]
│
└── hidden-gems-app/                # React (Vite) Frontend Application[cite: 1]
    ├── src/
    │   ├── api.js                  # Centralized Axios/Fetch API client[cite: 1]
    │   ├── components/             # Reusable UI components[cite: 1]
    │   │   ├── AppDownload.jsx     # Mobile app promotion banner[cite: 1]
    │   │   ├── Footer.jsx          # Global footer[cite: 1]
    │   │   ├── ImageSlider.jsx     # Carousel for meal/kitchen photos[cite: 1]
    │   │   ├── Navbar.jsx          # Global navigation[cite: 1]
    │   │   └── ReviewForm.jsx      # Input form for submitting reviews[cite: 1]
    │   ├── pages/                  # Route-level view components[cite: 1]
    │   │   ├── HomePage.jsx        # Landing page[cite: 1]
    │   │   ├── LoginPage.jsx, RegisterPage.jsx # Authentication flows[cite: 1]
    │   │   ├── FindMealsPage.jsx   # Search and filtering interface[cite: 1]
    │   │   ├── HostDetailsPage.jsx # Public profile view for a host[cite: 1]
    │   │   ├── MyBookingsPage.jsx  # Consumer booking history[cite: 1]
    │   │   └── MyProfilePage.jsx   # User account management[cite: 1]
    │   ├── App.jsx                 # Root React component & router setup[cite: 1]
    │   └── main.jsx                # React DOM rendering entry point[cite: 1]
    ├── index.html                  # HTML template[cite: 1]
    └── vite.config.js              # Vite bundler configuration[cite: 1]
