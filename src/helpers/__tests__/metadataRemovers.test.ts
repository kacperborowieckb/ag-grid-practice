import { describe, expect, test } from 'vitest'

import { mockStudentsData, mockStudentsDataWithMetadata } from '@/mocks/mockStudentsData'
import { removeStudentsMetadata } from '../metadataRemovers'

describe('metadata mappers', () => {
  describe('getStudentsWithMetadata', () => {
    test('should return students array without metadata', () => {
      expect(removeStudentsMetadata(mockStudentsDataWithMetadata)).toEqual(mockStudentsData)
    })

    test('should return empty array is studentsWithMetadata are empty', () => {
      expect(removeStudentsMetadata([])).toEqual([])
    })
  })
})
