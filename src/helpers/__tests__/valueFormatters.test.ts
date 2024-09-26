import { describe, expect, test } from 'vitest'

import { formatStudentsBirthDate, formatStudentsHobbies } from '@/helpers/valueFormatters'
import { generateMockParamsData } from '@/utils/testing'

describe('valueFormatters', () => {
  describe('formatStudentsBirthday', () => {
    const testDate = { value: 1061232000000, result: '18/08/2003' }
    const isCelebratingTestDate = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate()
    ).getTime()

    test('should correctly format provided date', () => {
      expect(formatStudentsBirthDate(generateMockParamsData('birthDate', testDate.value))).toBe(
        testDate.result
      )
    })

    test('should return empty string if birthDate is not provided', () => {
      expect(formatStudentsBirthDate(generateMockParamsData('birthDate'))).toBe('')
    })

    test('should contain a cake is student celebrate birthday', () => {
      expect(
        formatStudentsBirthDate(generateMockParamsData('birthDate', isCelebratingTestDate))
      ).toContain('🎂')
    })
  })

  describe('formatStudentsHobbies', () => {
    test('should correctly format provided hobbies', () => {
      expect(formatStudentsHobbies(generateMockParamsData('hobbies', ['Coding', 'Chess']))).toBe(
        'Coding, Chess'
      )
    })

    test('should return no hobbies with an empty array', () => {
      expect(formatStudentsHobbies(generateMockParamsData('hobbies', []))).toBe('No hobbies.')
    })

    test('should return no hobbies when hobbies are not provided', () => {
      expect(formatStudentsHobbies(generateMockParamsData('hobbies'))).toBe('No hobbies.')
    })
  })
})
