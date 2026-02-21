# 🚀 NOTESY: Enterprise-Grade Note Management 📝

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![MERN Stack](https://img.shields.io/badge/Stack-MERN-green?style=for-the-badge)](https://mongodb.com)
[![RBAC Protected](https://img.shields.io/badge/Security-RBAC_Enabled-red?style=for-the-badge)](https://jwt.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**NOTESY** is not just a note-taking app; it's a secure ecosystem designed for high-stakes data organization. Built with the **MERN stack**, it solves the problem of unauthorized data access by implementing a strict **Role-Based Access Control (RBAC)** architecture.

---

## 💡 The Problem & The Solution

**The Problem:** Most note apps lack privacy tiering. In a shared environment, everyone can edit everything, leading to data loss or privacy breaches.
**The Solution:** NOTESY introduces a tiered permission system. Whether you are an **Admin**, **Moderator**, or **Standard User**, your access is precisely controlled via custom-built middleware.

---

## ✨ What Makes It Unique?

- 🛡️ **Granular Security:** Professional-grade RBAC protects every API endpoint.
- ⚡ **Next-Gen Speed:** Leverages Next.js 15 App Router for near-instant page transitions.
- 🌓 **Adaptive UI:** A fluid, mobile-first design built with Tailwind CSS.
- 🔑 **JWT Shield:** Industrial-strength authentication using JSON Web Tokens.

---

## 🏗️ System Architecture & Logic



### 🧩 The Request Pipeline
1. **Auth Layer:** Validates the JWT from the request header.
2. **Identity Layer:** Fetches the user profile and assigned Role.
3. **Permission Layer:** Matches the requested action against the Role-Permission matrix.
4. **Data Layer:** Executes the operation on MongoDB if authorized.

---

## 📡 API Snapshot (Documentation)

| Method | Endpoint | Description | Access Level |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | User Registration | Public |
| `GET` | `/api/notes` | Fetch All Notes | Auth Required |
| `PATCH` | `/api/notes/:id` | Update Specific Note | Role-Based |
| `DELETE` | `/api/admin/users` | Manage User Base | Admin Only |
### Permissions Matrix 📊
| Permission | Admin | Moderator | User |
| :--- | :---: | :---: | :---: |
| Create Notes | ✅ | ✅ | ✅ |
| Edit Own Notes | ✅ | ✅ | ✅ |
| Edit Others' Notes | ✅ | ✅ | ❌ |
| Delete Any Note | ✅ | ❌ | ❌ |
| User Management | ✅ | ❌ | ❌ |

---

## 🛠️ Installation & Launch

### 1. Clone the Galaxy
```bash
git clone [https://github.com/Shashwat001772/notesy.git](https://github.com/Shashwat001772/notesy.git)
cd notesy
