import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { NotesField } from '@/components/entry/NotesField'

describe('NotesField', () => {
  it('updates the character count on input', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    function TestHarness() {
      const [value, setValue] = useState('')

      return (
        <NotesField
          onChange={(nextValue) => {
            onChange(nextValue)
            setValue(nextValue)
          }}
          value={value}
        />
      )
    }

    render(<TestHarness />)

    await user.type(screen.getByLabelText('Notes'), 'abc')

    expect(onChange).toHaveBeenLastCalledWith('abc')
    expect(screen.getByText('3/2000')).toBeInTheDocument()
  })

  it('renders the provided error message', () => {
    render(<NotesField error="Notes are too long" onChange={vi.fn()} value="hello" />)

    expect(screen.getByText('Notes are too long')).toBeInTheDocument()
    expect(screen.getByText('5/2000')).toBeInTheDocument()
  })
})
