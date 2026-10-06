# Rabbit House 🐰

**A forever home for every rabbit.**

Rabbit House is a rabbit rescue and adoption website. It gathers rabbits that are looking for a home, rabbits that have already been adopted, and the residents who live with us permanently, so people can get to know each rabbit and apply to adopt or sponsor one.

The idea started as a high school project to help an animal shelter in Chiang Mai. Years later, as a programmer with four rabbits of my own and inspired by a rabbit café that rescues and rehomes rabbits, I finally built it.

🔗 **Live demo:** _coming soon_

## Features

- **Rabbit listings** for rabbits looking for a home, adopted rabbits, and permanent residents
- **Filters and sorting** by gender, neutered status, breed (multi-select), status, and date, using one reusable component across pages
- **Rabbit profile pages** with a photo gallery, instant image switching, and a fullscreen viewer (keyboard and arrow navigation)
- **Adoption / sponsorship form** with validation by React Hook Form, preselecting the rabbit when opened from its profile
- **Live data from Firebase**: content and photos are managed in Firestore and Storage, and pages revalidate every 60 seconds
- **Responsive design** for mobile, tablet, and desktop

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router, Server Components)
- TypeScript
- Tailwind CSS
- React Hook Form
- Firebase Firestore and Firebase Storage
- Firebase App Hosting
- lucide-react (icons)

## Project Structure

```txt
app/            Pages (App Router)
components/     Reusable UI components (RabbitCard, RabbitFilter, RabbitGallery, AdoptionForm, ...)
lib/            Firebase setup, data fetching (rabbit-service), and display helpers
types/          TypeScript types
```

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file with your Firebase config:

   ```txt
   NEXT_PUBLIC_FIREBASE_API_KEY=
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
   NEXT_PUBLIC_FIREBASE_APP_ID=
   ```

3. Run the development server and open http://localhost:3000:

   ```bash
   npm run dev
   ```

## Roadmap

- [x] Rabbit listings, profiles, and filters
- [x] Adoption / sponsorship form (frontend)
- [ ] Save form submissions to Firestore
- [ ] Admin login with Firebase Authentication
- [ ] Admin dashboard to review applications and update rabbit status

## About

Built as a personal portfolio project by [Sarocha Chang](https://www.linkedin.com/in/sarocha-chang-833172274/).
