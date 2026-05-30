import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'

import { DateNavigator } from '@/components/entry/DateNavigator'

function LocationProbe() {
  const location = useLocation()

  return <p>{location.pathname}</p>
}

describe('DateNavigator', () => {
  it('opens the date picker and navigates to the selected date', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={['/entry/2026-05-25']}>
        <Routes>
          <Route
            element={
              <>
                <DateNavigator selectedDate="2026-05-25" />
                <LocationProbe />
              </>
            }
            path="/entry/:dateKey"
          />
        </Routes>
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: /May 25, 2026/i }))
    fireEvent.change(screen.getByLabelText('Select date'), {
      target: { value: '2026-05-20' },
    })

    expect(await screen.findByText('/entry/2026-05-20')).toBeInTheDocument()
  })
})
