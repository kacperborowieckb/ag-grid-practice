import { describe, it, expect } from 'vitest'

import { validateHobbies } from '@/validators/studentsValidators'

describe('validateHobbies', () => {
  it('should return true for valid hobby strings', () => {
    expect(validateHobbies('Reading')).toBe(true)
    expect(validateHobbies(',Reading')).toBe(true)
    expect(validateHobbies('   Cooking,  swimming with sharks    ')).toBe(true)
    expect(validateHobbies('')).toBe(true)
    expect(validateHobbies('     ')).toBe(true)
  })

  it('should return false for invalid characters', () => {
    expect(validateHobbies('Reading@, running')).toBe(false)
    expect(validateHobbies('Gardening!')).toBe(false)
    expect(validateHobbies('Gardening. Chess')).toBe(false)
  })
})
