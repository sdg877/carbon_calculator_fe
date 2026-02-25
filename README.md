Brief

A production-ready React dashboard that calculates, visualises, and contextualises personal carbon impact in real time. It features a complex, dynamic calculation form, interactive data visualisations via Recharts, and a curated environmental news feed.


Deployment Links

Frontend GitHub - https://github.com/sdg877/carbon_calculator_fe
Deployed Site - https://carbon-calculator-fe-pi.vercel.app/


Timeframe

Developed iteratively over six months. Started as a personal challenge during injury recovery, evolving from a prototype into a production-standard full-stack application

Technologies Used

Library: React

State/Logic: JavaScript (ES6+), Hooks

Charts: Recharts (Pie & Trend Analysis)

Styling: CSS3 (Custom Modules)

Deployment: Vercel


Code Process

Dynamic Form Logic: Created a conditional form system that dynamically updates inputs and validation depending on activity category. Supports 20+ activity types while keeping state predictable and payloads structured.

Data Visualisation: Implemented Recharts to transform raw backend data into interactive Pie charts for global and personal comparisons.

Content Sanitisation: Engineered a refined fetch logic for NewsAPI using Boolean search operators and domain exclusion to filter out holiday adverts and tabloids.

State Management: Utilised a centralised state for form details to ensure clean, unified JSON payloads for the API.


Challenges

Data Noise: Overcame NewsAPI noise by implementing strict domain filtering and mandatory keyword matching to ensure article relevancy.

Conditional UI: Managing complex state transitions within the carbon form to hide/show fields dynamically without breaking the user flow.


Wins

UX Precision: Successfully created a form that handles 20+ distinct activity types within a single, intuitive interface.

Curation Logic: Built a robust news engine that provides high-quality, relevant data to the dashboard.


Key Learnings

Data Presentation: Mastered the translation of complex database metrics into user-friendly visual insights.

Asynchronous UX: Improved knowledge of handling loading states and error handling for external API integrations.


Bugs

Hydration Sync: Occasional delays in syncing chart data with updated form submissions (currently being optimised).

Image Fallbacks: Some NewsAPI articles occasionally return broken image links.


Future Improvements

Advanced Analytics: Migrating to D3.js for deeper, multi-variable data visualisations.

Personalisation: Implementing a Personal Goal tracker based on the global average data.


