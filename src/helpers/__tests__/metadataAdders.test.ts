import { describe, expect, test } from 'vitest'
import { getStudentsWithMetadata } from '@/helpers/metadataMappers'
import { mockStudentsData, mockStudentsDataWithMetadata } from '@/mocks/mockStudentsData'

describe('metadata mappers', () => {
  describe('getStudentsWithMetadata', () => {
    test('should return students array with metadata', () => {
      expect(getStudentsWithMetadata(mockStudentsData)).toEqual(mockStudentsDataWithMetadata)
    })

    test('should return empty array is students are empty', () => {
      expect(getStudentsWithMetadata([])).toEqual([])
    })
  })
})
