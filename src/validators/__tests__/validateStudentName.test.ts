import { describe, it, expect } from 'vitest'

import { validateStudentName } from '@/validators/studentsValidators'

describe('validateStudentName', () => {
  it('should return true for valid names', () => {
    expect(validateStudentName('Alice')).toBe(true)
    expect(validateStudentName('José')).toBe(true)
    expect(validateStudentName('Джон')).toBe(true)
    expect(validateStudentName('約翰')).toBe(true)
    expect(validateStudentName('Jo')).toBe(true)
    expect(validateStudentName('JohnnyLongNameJo')).toBe(true)
  })

  it('should return false for names that are less than 2 chars', () => {
    expect(validateStudentName('J')).toBe(false)
    expect(validateStudentName('')).toBe(false)
  })

  it('should return false for names that are longer than 16 chars', () => {
    expect(validateStudentName('JohnnyNameTooLong')).toBe(false)
    expect(validateStudentName('JohnDoeSmithJunior')).toBe(false)
  })

  it('should return false for names containing non-letter characters', () => {
    expect(validateStudentName('John123')).toBe(false)
    expect(validateStudentName('John_Jo')).toBe(false)
    expect(validateStudentName("Johnny's")).toBe(false)
  })

  it('should return false for names containing spaces', () => {
    expect(validateStudentName('John Jo')).toBe(false)
    expect(validateStudentName('Johnny Bravo')).toBe(false)
  })
})
