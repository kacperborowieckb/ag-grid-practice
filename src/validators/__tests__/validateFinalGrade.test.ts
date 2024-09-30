import { describe, it, expect } from 'vitest'

import { validateFinalGrade } from '@/validators/studentsValidators'

describe('validateFinalGrade', () => {
  it('should return true for valid grades', () => {
    expect(validateFinalGrade('1')).toBe(true)
    expect(validateFinalGrade('5')).toBe(true)
  })

  it('should return false for negative values', () => {
    expect(validateFinalGrade('-1')).toBe(false)
    expect(validateFinalGrade('-24')).toBe(false)
  })

  it('should return false for 0', () => {
    expect(validateFinalGrade('0')).toBe(false)
  })

  it('should return false for values greater than 5', () => {
    expect(validateFinalGrade('6')).toBe(false)
    expect(validateFinalGrade('54')).toBe(false)
  })

  it('should return false for no numeric input', () => {
    expect(validateFinalGrade('abs')).toBe(false)
    expect(validateFinalGrade('{}')).toBe(false)
  })
})
