Brief
I built a full-stack app to track and visualise carbon footprints. After finding no suitable volunteering APIs, I pivoted to integrating a real-time environmental news feed to provide immediate user value.

Deployment Links
Frontend GitHub - https://github.com/sdg877/carbon_calculator_fe
Backend GitHub - https://github.com/sdg877/carbon_calculator_be
Deployed Site - https://carbon-calculator-fe-pi.vercel.app/

Timeframe
Developed iteratively over six months. Started as a personal challenge during injury recovery, evolving from a prototype into a production-standard full-stack application

Technologies Used
React
FastAPI
Python
PostgreSQL
Supabase
NewsAPI
Vercel (deployment)
Render (deployment)
CSS
JavaScript

Code Process
Environment Setup: Configured environment variables and established a connection between a FastAPI backend and PostgreSQL via Supabase.
Custom Authentication: Implemented a secure, self-managed user registration and login system with password hashing and session management.
Data Logic: Developed a calculation engine to process user inputs into carbon footprint metrics, storing historical data for trend tracking.
Front End Development: Created a responsive React interface for data entry and visualising footprint results.
External API Integration: Integrated NewsAPI to fetch and display a real-time environmental news feed on the dashboard.

Challenges
Feature Pivot: Originally designed to suggest volunteering opportunities via API. After extensive research revealed no viable production-ready APIs, I pivoted the architecture to integrate NewsAPI. This ensured the dashboard remained data-driven while providing immediate, relevant value to the user.
Custom Authentication: Opted to build a self-managed authentication system from scratch rather than using third-party providers. This required implementing secure password hashing and session management to ensure data privacy and system integrity.

