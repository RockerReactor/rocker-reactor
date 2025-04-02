import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import App from '../App'
import { AppProvider } from '../context/AppContext.jsx'
import { link } from 'fs'

it('app has three buttons', () => {
    render(
        <AppProvider>
            <App />
        </AppProvider>
    )
    //const linkElement = screen.getByText(/learn react/i)
    //expect(linkElement).toBeInTheDocument()

    expect(screen.getByText(/🔁/)).toBeInTheDocument();
        expect(screen.getByText(/❓/)).toBeInTheDocument();
        expect(screen.getByText(/⚙️/)).toBeInTheDocument();
    })
