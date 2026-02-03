// src/db/userService.js

const USERS_KEY = 'rmu_users'
const SESSION_KEY = 'rmu_session'

// Default admin user (username: admin, password: admin123)
const defaultUsers = [
  { id: 1, username: 'admin', password: 'admin123', name: 'Admin' },
]

// Initialize users in localStorage
export function initUsers() {
  const existing = localStorage.getItem(USERS_KEY)
  if (!existing) {
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers))
  }
}

// Login
export function login(username, password) {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
  const user = users.find(
    (u) => u.username === username && u.password === password
  )
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user))
    return user
  }
  return null
}

// Logout
export function logout() {
  localStorage.removeItem(SESSION_KEY)
}

// Get current session
export function getCurrentUser() {
  return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null')
}
