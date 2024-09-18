import { defineStore } from 'pinia'

import { api } from '@/services'
import type { Student } from '@/services/students'
import { getStudentsWithMetadata } from '@/helpers/metadataAdders'

export type StudentWithMetadata = {
  [T in keyof Student]: {
    value: Student[T]
    isValidated: boolean
  }
}

type StudentsStoreState = {
  students: StudentWithMetadata[] | null
  isLoading: boolean
  error: string
}

type FetchStudentsActionProps = { onError?: (errorMessage: string) => void }

export const useStudentsStore = defineStore('students', {
  state: (): StudentsStoreState => ({
    students: null,
    isLoading: false,
    error: ''
  }),
  actions: {
    async fetchStudents({ onError }: FetchStudentsActionProps) {
      try {
        this.isLoading = true

        const data = await api.students.getStudents()

        if (data.status !== 200) {
          throw new Error('Fetching students failed')
        }

        this.students = getStudentsWithMetadata(data.data)
      } catch (error) {
        if (error instanceof Error) {
          this.error = error.message

          if (onError) onError(this.error)
        }
      } finally {
        this.isLoading = false
      }
    }
  }
})
