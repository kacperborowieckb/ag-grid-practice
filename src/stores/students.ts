import { defineStore } from 'pinia'

import { api } from '@/services'
import type { Student } from '@/services/students'

type StudentsStoreState = {
  students?: Student[]
  isLoading: boolean
  error: string
}

type FetchStudentsActionProps = { onError: (errorMessage: string) => void }

export const useStudentsStore = defineStore('students', {
  state: (): StudentsStoreState => ({
    students: undefined,
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

        this.students = data.data
      } catch (error) {
        if (error instanceof Error) {
          this.error = error.message
          onError(this.error)
        }
      } finally {
        this.isLoading = false
      }
    }
  }
})
