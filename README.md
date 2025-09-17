<p align="center">

  <h2 align="center">Snippy</h2>

  <p align="center">
        A minimal and efficient URL shortener.
  </p>
</p>

## Introduction

A fast, minimal, and modern URL shortener built with Next.js, TypeScript, and Prisma. Designed for simplicity, speed, and extensibility.

## Tech Stack

- [Next.js](https://nextjs.org/) – framework
- [TypeScript](https://www.typescriptlang.org/) – language
- [Tailwind](https://tailwindcss.com/) – CSS
- [MongoDB](https://www.mongodb.com/) – database
- [Prisma](https://www.prisma.io/) – ORM
- [shadcn/ui](https://ui.shadcn.com/) – UI components
- [better-auth](https://www.better-auth.com/) – Authentication
- [TanStack Query](https://tanstack.com/query/latest) – Data fetching

## Roadmap

- User Authentication & Authorization
    - [x] Email & Password
    - [x] Sign up
    - [x] Sign in
    - [x] Log in
    - [ ] Forget password
- Dashboard - Links
    - Create
        - [x] Destination URL
        - [x] Short URL key (optional input + [Generate Random] button)
        - [x] Availability check for custom key
        - [x] Expire time (optional date, time picker)
        - [x] Password
        - [x] Geo Targeting (country-based redirect)
        - [x] Device Targeting (OS-based redirect)
        - [x] Metadata (title, description, image)
        - [x] QR code generation
    - [x] Search
    - [ ] Sorting
    - [x] Display all [ pagination or infinite scrolling ]
    - [x] Edit
    - [x] Delete
    - [ ] Display all time clicks
    - [x] QR Code
- URL Redirect
    - [ ] Record analytics record
    - [ ] redirect
- Dashboard - Analytics
    - [ ] Clicks over time (graphs): Last 24h, 7d, 30d, 3m, 12m, MTD, QTD, YTD, All Time
    - [ ] Clicks over time short link and long url (table)
    - [ ] Location-wise breakdown ( country, city, region, continents)
    - [ ] Device breakdown
    - [ ] OS breakdown
    - [ ] Browsers breakdown
    - [ ] Triggers breakdown (QR Code, link click)
    - [ ] Per link analytics + All links analytics
    - [ ] Filter for all params
- Landing Page
    - [ ] Navbar
    - [ ] Hero section
    - [ ] Features section
    - [ ] Frequently asked questions
    - [ ] Footer
