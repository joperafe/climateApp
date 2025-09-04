import '@testing-library/jest-dom'

// Mock VITE_APP_ENV for Jest
process.env.VITE_APP_ENV = process.env.VITE_APP_ENV || 'DEV';