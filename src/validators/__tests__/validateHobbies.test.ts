import { describe, it, expect } from 'vitest'
import { validateHobbies } from '../studentsValidators'

describe('validateHobbies', () => {
  it('should return true for valid hobby strings', () => {
    expect(validateHobbies('Reading')).toBe(true)
    expect(validateHobbies('   Cooking, coding    ')).toBe(true)
    expect(validateHobbies('Photography,    Hiking, Swimming')).toBe(true)
    expect(validateHobbies('1, 2,   3')).toBe(true)
    expect(validateHobbies('Writing, 4, CoDIng')).toBe(true)
    expect(validateHobbies('')).toBe(true)
    expect(validateHobbies('     ')).toBe(true)
  })

  it('should return false for invalid hobby strings', () => {
    expect(validateHobbies(',Reading')).toBe(false)
    expect(validateHobbies(' Reading,  ')).toBe(false)
    expect(validateHobbies('Cooking,,Coding')).toBe(false)
    expect(validateHobbies('Cooking,  ,Coding')).toBe(false)
    expect(validateHobbies('Cooking, Coding,')).toBe(false)
  })

  it('should return false for invalid characters', () => {
    expect(validateHobbies('Cooking#Hiking')).toBe(false)
    expect(validateHobbies('Reading@, running')).toBe(false)
    expect(validateHobbies('Gardening!')).toBe(false)
  })
})
