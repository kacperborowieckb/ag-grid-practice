import { beforeEach, describe, expect, test } from 'vitest'

import { generateMockSetterParams } from '@/utils/testing'
import { setValidatedValue } from '@/helpers/valueSetters'

describe('valueSetters', () => {
  describe('setValidatedValue', () => {
    let mockParams: ReturnType<typeof generateMockSetterParams>
    const field = 'name'

    beforeEach(() => {
      mockParams = generateMockSetterParams({
        field: field,
        newValue: 'Johnny',
        oldValue: 'John',
        isValidated: true
      })
    })

    test('should set value when validated', () => {
      expect(setValidatedValue()(mockParams as any)).toBe(true)
      expect(mockParams.data[field].value).toBe('Johnny')
    })

    test('should not set value when is not validated', () => {
      mockParams.data[field].isValidated = false

      expect(setValidatedValue()(mockParams as any)).toBe(false)
      expect(mockParams.data[field].value).toBe('John')
      expect(mockParams.data[field].isValidated).toBe(true)
    })

    test('should return false when field is not available', () => {
      mockParams.colDef = undefined

      expect(setValidatedValue()(mockParams as any)).toBe(false)
    })

    test('should not update value if newValue is an empty string', () => {
      mockParams.newValue = ''

      expect(setValidatedValue()(mockParams as any)).toBe(false)
    })

    test('should use custom setter when provided', () => {
      expect(setValidatedValue((name) => name.toUpperCase())(mockParams as any)).toBe(true)
      expect(mockParams.data[field].value).toBe('JOHNNY')
    })

    test('should use custom setter when provided and is not validated', () => {
      mockParams.data[field].isValidated = false

      expect(setValidatedValue((name) => name.toUpperCase())(mockParams as any)).toBe(false)
      expect(mockParams.data[field].value).toBe('JOHN')
    })
  })
})
