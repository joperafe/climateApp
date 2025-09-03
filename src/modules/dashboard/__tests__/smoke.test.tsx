
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../../../App'

test('renders nav links', () => {
  render(<MemoryRouter><App /></MemoryRouter>)
  expect(screen.getByText(/Dashboard/i)).toBeInTheDocument()
  expect(screen.getByText(/Cockpit/i)).toBeInTheDocument()
})
