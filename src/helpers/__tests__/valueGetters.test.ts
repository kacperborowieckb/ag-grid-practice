import { describe, expect, test } from 'vitest'

import { generateMockParamsData } from '@/utils/testing'
import { getStudentsAge, getStudentsBirthDate, getStudentsHobbies } from '@/helpers/valueGetters'

describe('value getters', () => {
  describe('getStudentsBirthDate', () => {
    test('should return correct date object based on provided time', () => {
      const time = 1061232000000

      expect(getStudentsBirthDate(generateMockParamsData('birthDate', time))).toEqual(
        new Date(time)
      )
    })

    test('should return empty string when birth date is not provided', () => {
      expect(getStudentsBirthDate(generateMockParamsData('birthDate'))).toBe('')
    })
  })

  describe('getStudentsAge', () => {
    const testAge = {
      value: 1061232000000,
      result: (new Date().getFullYear() - new Date(1061232000000).getFullYear()).toString()
    }

    test('should correctly calculate age based on provided date', () => {
      expect(getStudentsAge(generateMockParamsData('birthDate', testAge.value))).toBe(
        testAge.result
      )
    })

    test('should return empty string when birthDate is not provided', () => {
      expect(getStudentsAge(generateMockParamsData('birthDate'))).toBe('')
    })
  })

  describe('getStudentsHobbies', () => {
    test('should correctly format provided hobbies', () => {
      expect(getStudentsHobbies(generateMockParamsData('hobbies', ['Coding', 'Chess']))).toBe(
        'Coding, Chess'
      )
    })

    test('should return empty string with an empty array', () => {
      expect(getStudentsHobbies(generateMockParamsData('hobbies', []))).toBe('')
    })

    test('should return empty string when hobbies are not provided', () => {
      expect(getStudentsHobbies(generateMockParamsData('hobbies'))).toBe('')
    })
  })
})
