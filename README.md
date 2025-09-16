<p align="center">

  <h2 align="center">Snippy</h2>

  <p align="center">
        A minimal and efficient URL shortener.
  </p>
</p>

## Introduction

A fast, minimal, and modern URL shortener built with Next.js, TypeScript, and Prisma. Designed for simplicity, speed, and extensibility.

## Features

### 🔐 Password Protection

- Secure your links with optional password protection
- Bcrypt hashing with 12 salt rounds
- Clean password input with visibility toggle
- Password verification before redirect

### 🌍 Geo Targeting

- Country-based redirects using IP geolocation
- Support for 10+ countries with visual flag indicators
- Easy setup through intuitive modal interface
- Powered by geoip-lite for accurate detection

### 📱 Device Targeting

- OS/Device-based redirects (Windows, macOS, Linux, Android, iOS)
- User-agent parsing for device detection
- Visual device icons in the targeting interface
- Seamless integration with existing workflow

### 🎯 Advanced Targeting

- Combined geo and device targeting rules
- Priority-based targeting (geo first, then device)
- Fallback to default URL if no rules match
- Real-time rule management (add/remove/edit)

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
