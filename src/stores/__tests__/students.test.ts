import { describe, beforeEach, test, expect, vi, type Mock } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

import { useStudentsStore } from '@/stores/students'
import { getStudentsSpy, updateStudentsSpy } from '@/mocks/mockStudentsEndpoints'
import { mockStudentsData, mockStudentsDataWithMetadata } from '@/mocks/mockStudentsData'

describe('studentsStore', () => {
  let mockStudentsStore: ReturnType<typeof useStudentsStore>
  let mockOnError: Mock
  let mockOnSuccess: Mock

  beforeEach(async () => {
    setActivePinia(createPinia())
    mockStudentsStore = useStudentsStore()

    mockOnError = vi.fn()
    mockOnSuccess = vi.fn()
  })

  describe('fetchStudents', () => {
    test('should have loading state for fetching students set to true', async () => {
      mockStudentsStore.fetchStudents()

      expect(mockStudentsStore.isLoading.fetchStudents).toBe(true)
      expect(mockStudentsStore.isLoading.updateStudents).toBe(false)
    })

    test('should have loading state for fetching students set to false after fetching', async () => {
      await mockStudentsStore.fetchStudents()

      expect(mockStudentsStore.isLoading.fetchStudents).toBe(false)
      expect(mockStudentsStore.isLoading.updateStudents).toBe(false)
    })

    test('should call getStudents method', async () => {
      await mockStudentsStore.fetchStudents()

      expect(getStudentsSpy).toBeCalled()
    })

    test('should set students with metadata after calling fetch students', async () => {
      await mockStudentsStore.fetchStudents()

      expect(mockStudentsStore.students).toEqual(mockStudentsDataWithMetadata)
    })

    test('should call onError method if getStudents throw', async () => {
      const errorMessage = 'Failed to fetch students'

      getStudentsSpy.mockImplementationOnce(() => {
        throw new Error(errorMessage)
      })

      await mockStudentsStore.fetchStudents({ onError: mockOnError })

      expect(mockOnError).toBeCalledWith(errorMessage)
    })

    test('should call onError method if getStudents respond with status different than 200', async () => {
      getStudentsSpy.mockResolvedValueOnce({ status: 404 } as any)

      await mockStudentsStore.fetchStudents({ onError: mockOnError })

      expect(mockOnError).toBeCalled()
    })
  })

  describe('updateStudents', () => {
    beforeEach(async () => {
      await mockStudentsStore.fetchStudents()
    })

    test('should not call updateStudents when students is null', async () => {
      mockStudentsStore.students = null

      await mockStudentsStore.updateStudents()

      expect(updateStudentsSpy).not.toBeCalled()
    })

    test('should have loading state for updating set to true', async () => {
      mockStudentsStore.updateStudents()

      expect(mockStudentsStore.isLoading.updateStudents).toBe(true)
      expect(mockStudentsStore.isLoading.fetchStudents).toBe(false)
    })

    test('should have loading state for updating students set to false after updating', async () => {
      await mockStudentsStore.updateStudents()

      expect(mockStudentsStore.isLoading.updateStudents).toBe(false)
      expect(mockStudentsStore.isLoading.fetchStudents).toBe(false)
    })

    test('should call updateStudents with students without metadata', async () => {
      await mockStudentsStore.updateStudents()

      expect(updateStudentsSpy).toBeCalledWith(mockStudentsData)
    })

    test('should call onError method if updateStudents throw', async () => {
      const errorMessage = 'Failed to update students'

      updateStudentsSpy.mockImplementationOnce(() => {
        throw new Error(errorMessage)
      })

      await mockStudentsStore.updateStudents({ onError: mockOnError })

      expect(mockOnError).toBeCalledWith(errorMessage)
    })

    test('should not call onSuccess method if updateStudents throw', async () => {
      updateStudentsSpy.mockImplementationOnce(() => {
        throw new Error()
      })

      await mockStudentsStore.updateStudents({ onSuccess: mockOnSuccess })

      expect(mockOnSuccess).not.toBeCalled()
    })

    test('should call onError method if updateStudents respond with status different than 200', async () => {
      updateStudentsSpy.mockResolvedValueOnce([{ status: 404 }] as any)

      await mockStudentsStore.updateStudents({ onError: mockOnError })

      expect(mockOnError).toBeCalled()
    })

    test('should call onSuccess method if updateStudents success', async () => {
      await mockStudentsStore.updateStudents({ onSuccess: mockOnSuccess })

      expect(mockOnSuccess).toBeCalled()
    })
  })
})
