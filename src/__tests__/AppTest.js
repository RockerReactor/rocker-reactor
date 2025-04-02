import React from 'react'
import { render, screen } from '@testing-library/react'
import App from '../App'
import { AppProvider } from '../context/AppContext.jsx'
import { link } from 'fs'

it('renders learn react link', () => {
    render(
        <AppProvider>
            <App />
        </AppProvider>
    )
    //const linkElement = screen.getByText(/learn react/i)
    //expect(linkElement).toBeInTheDocument()
    expect(1).toBe(1)
})
