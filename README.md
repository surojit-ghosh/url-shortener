<p align="center">

  <h3 align="center">Snippy</h3>

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

## Roadmap

- User Authentication & Authorization
    - [x] Email & Pass
    - [ ] Google
    - [x] Sign up
    - [x] Sign in
    - [x] Log in
    - [ ] Forget password
    - [ ] Change email
    - [ ] Change Name
- Dashboard - Links
    - Create
        - [ ] Destination URL
        - [ ] Short URL key (optional input + [Generate Random] button)
        - [ ] Availability check for custom key
        - [ ] Expire time (optional date, time picker)
        - [ ] Password
        - [ ] Geo Targeting (country-based redirect)
        - [ ] Device Targeting (OS-based redirect)
        - [ ] Metadata (title, description, image)
        - [ ] QR code generation
    - [ ] Search
    - [ ] Sorting
    - [ ] Display all [ pagination or infinite scrolling ]
    - [ ] Edit
    - [ ] Delete
    - [ ] Display all time clicks
    - [ ] QR Code
    - [ ] Folder
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
