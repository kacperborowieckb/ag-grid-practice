import { defineStore } from 'pinia'

import { api } from '@/services'
import type { Student } from '@/services/students'
import { getStudentsWithMetadata } from '@/helpers/metadataMappers'
import { removeStudentsMetadata } from '@/helpers/metadataRemovers'

export type StudentWithMetadata = {
  [T in keyof Student]: {
    value: Student[T]
    isValidated: boolean
  }
}

type StudentsStoreState = {
  students: StudentWithMetadata[] | null
  isFetchLoading: boolean
  isUpdateLoading: boolean
}

type DefaultStudentsActionProps = {
  onError?: (errorMessage: string) => void
  onSuccess?: () => void
}

export const useStudentsStore = defineStore('students', {
  state: (): StudentsStoreState => ({
    students: null,
    isFetchLoading: false,
    isUpdateLoading: false
  }),
  actions: {
    async fetchStudents({ onError }: DefaultStudentsActionProps = {}) {
      try {
        this.isFetchLoading = true

        const data = await api.students.getStudents()

        if (data.status !== 200) {
          throw new Error('Fetching students failed')
        }

        this.students = getStudentsWithMetadata(data.data)
      } catch (error) {
        if (error instanceof Error) {
          onError && onError(error.message)
        }
      } finally {
        this.isFetchLoading = false
      }
    },
    async updateStudents({ onError, onSuccess }: DefaultStudentsActionProps = {}) {
      if (!this.students) return

      try {
        this.isUpdateLoading = true

        const data = await api.students.updateStudents(removeStudentsMetadata(this.students))

        if (data.some(({ status }) => status !== 200)) {
          throw new Error('Fetching students failed')
        }

        onSuccess && onSuccess()
      } catch (error) {
        if (error instanceof Error) {
          onError && onError(error.message)
        }
      } finally {
        this.isUpdateLoading = false
      }
    }
  }
})
