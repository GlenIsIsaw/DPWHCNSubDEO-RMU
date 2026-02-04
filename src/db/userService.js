// src/db/userService.js

const USERS_KEY = 'rmu_users'
const SESSION_KEY = 'rmu_session'

// Default users (username MUST be unique)
const defaultUsers = [
  { id: 1, username: 'admin', password: 'admin123', name: 'Admin' },
  { id: 2, username: 'adminjun', password: 'jun123', name: 'Jun-Jun' },
  { id: 3, username: 'adminmark', password: 'adminmark234', name: 'Mark Jayson' },
]

// Initialize users in localStorage (merge-safe)
export function initUsers() {
  const existingUsers = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')

  if (existingUsers.length === 0) {
    // First run
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers))
    return
  }

  // Merge new default users if they don't exist
  const mergedUsers = [...existingUsers]

  defaultUsers.forEach((defUser) => {
    const exists = mergedUsers.some(
      (u) => u.username === defUser.username
    )
    if (!exists) {
      mergedUsers.push(defUser)
    }
  })

  localStorage.setItem(USERS_KEY, JSON.stringify(mergedUsers))
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
