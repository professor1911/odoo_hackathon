<div align="left" style="position: relative;">
<h1>Skill Swap Platform</h1>
<p align="left">
</p>
<p align="left">
	<img src="https://img.shields.io/github/license/professor1911/odoo_hackathon?style=default&logo=opensourceinitiative&logoColor=white&color=1b86f3" alt="license">
	<img src="https://img.shields.io/github/last-commit/professor1911/odoo_hackathon?style=default&logo=git&logoColor=white&color=1b86f3" alt="last-commit">
	<img src="https://img.shields.io/github/languages/top/professor1911/odoo_hackathon?style=default&color=1b86f3" alt="repo-top-language">
	<img src="https://img.shields.io/github/languages/count/professor1911/odoo_hackathon?style=default&color=1b86f3" alt="repo-language-count">
</p>
<p align="left"><!-- default option, no dependency badges. -->
</p>
<p align="left">
	<!-- default option, no dependency badges. -->
</p>
</div>
<br clear="right">

## 🔗 Table of Contents

- [📍 Overview](#-overview)
- [👾 Features](#-features)
- [📁 Project Structure](#-project-structure)
  - [📂 Project Index](#-project-index)
- [🚀 Getting Started](#-getting-started)
  - [☑️ Prerequisites](#-prerequisites)
  - [⚙️ Installation](#-installation)
  - [🤖 Usage](#🤖-usage)
  - [🧪 Testing](#🧪-testing)
- [📌 Project Roadmap](#-project-roadmap)
- [🔰 Contributing](#-contributing)
- [🎗 License](#-license)
- [🙌 Acknowledgments](#-acknowledgments)

---

## 📍 Overview

Skillshare is a full-stack web application built with Next.js that allows users to connect with each other to trade or "swap" skills. The platform is designed to foster a community of learning and sharing, where users can both teach what they know and learn something new from others. The application features a complete user authentication system, profile management, a skill discovery dashboard, an AI-powered recommendation engine, and a real-time messaging system for coordinating swaps.

---

## 👾 Features

🔐 User Authentication: Secure sign-up and login functionality powered by Firebase Authentication

👤 User Profile Management: Create and manage comprehensive profiles including bio, profile picture, skills offered, skills wanted, and availability preferences

🔍 Skill Discovery: Searchable and filterable dashboard to discover other users based on specific skills or names

🤖 AI Recommendations: Dedicated "For You" page leveraging Google's Gemini model via Genkit to provide personalized recommendations for potential skill swap partners

📨 Swap Request System: Send, receive, accept, or reject skill swap requests with seamless request management

💬 Real-time Swap Sessions: Private chat sessions for coordinating skill swaps using real-time messaging powered by Firestore

⭐ Rating and Feedback: Community-based reputation system allowing users to rate their swap partners and build trust

📱 Responsive Design: Fully responsive design optimized for seamless user experience across desktop and mobile devices

---

## 📁 Project Structure

```sh
└── skill_swap_platform/
    ├── README.md
    ├── apphosting.yaml
    ├── components.json
    ├── docs
    ├── firebase.json
    ├── firestore.indexes.json
    ├── firestore.rules
    ├── next.config.ts
    ├── package-lock.json
    ├── package.json
    ├── postcss.config.mjs
    ├── src
    ├── tailwind.config.ts
    └── tsconfig.json
```


---
## 🚀 Getting Started

### ☑️ Prerequisites

Before getting started with skill swap platform, ensure your runtime environment meets the following requirements:

- **Programming Language:** TypeScript
- **Package Manager:** Npm


### ⚙️ Installation

Install odoo_hackathon using one of the following methods:

**Build from source:**

1. Clone the odoo_hackathon repository:
```sh
❯ git clone https://github.com/professor1911/odoo_hackathon
```

2. Navigate to the project directory:
```sh
❯ cd odoo_hackathon
```

3. Install the project dependencies:


**Using `npm`** &nbsp; [<img align="center" src="https://img.shields.io/badge/npm-CB3837.svg?style={badge_style}&logo=npm&logoColor=white" />](https://www.npmjs.com/)

```sh
❯ npm install
```




### 🤖 Usage
Run odoo_hackathon using the following command:
**Using `npm`** &nbsp; [<img align="center" src="https://img.shields.io/badge/npm-CB3837.svg?style={badge_style}&logo=npm&logoColor=white" />](https://www.npmjs.com/)

```sh
❯ npm start
```


### 🧪 Testing
Run the test suite using the following command:
**Using `npm`** &nbsp; [<img align="center" src="https://img.shields.io/badge/npm-CB3837.svg?style={badge_style}&logo=npm&logoColor=white" />](https://www.npmjs.com/)

```sh
❯ npm test
```
