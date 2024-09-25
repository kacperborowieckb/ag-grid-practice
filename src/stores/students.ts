import { defineStore } from 'pinia'

import { api } from '@/services'
import type { Student } from '@/services/students'
import { getStudentsWithMetadata } from '@/helpers/metadataMappers'

export type StudentWithMetadata = {
  [T in keyof Student]: {
    value: Student[T]
    isValidated: boolean
  }
}

type StudentsStoreState = {
  students: StudentWithMetadata[] | null
  isLoading: Record<'fetchStudents' | 'updateStudents', boolean>
  error: string
}

type DefaultStudentsActionProps = {
  onError?: (errorMessage: string) => void
  onSuccess?: () => void
}

export const useStudentsStore = defineStore('students', {
  state: (): StudentsStoreState => ({
    students: null,
    isLoading: {
      fetchStudents: false,
      updateStudents: false
    },
    error: ''
  }),
  actions: {
    async fetchStudents({ onError }: DefaultStudentsActionProps = {}) {
      try {
        this.isLoading.fetchStudents = true

        const data = await api.students.getStudents()

        if (data.status !== 200) {
          throw new Error('Fetching students failed')
        }

        this.students = getStudentsWithMetadata(data.data)
      } catch (error) {
        if (error instanceof Error) {
          this.error = error.message

          onError && onError(this.error)
        }
      } finally {
        this.isLoading.fetchStudents = false
      }
    },
    async updateStudents({ onError, onSuccess }: DefaultStudentsActionProps = {}) {
      if (!this.students) return

      try {
        this.isLoading.updateStudents = true

        const studentsData = this.students?.map((student) => {
          const studentObj = {} as Student

          Object.entries(student).forEach(([key, value]) => {
            //@ts-ignore
            studentObj[key] = value.value
          })

          return studentObj
        })
        const data = await api.students.updateStudents(studentsData)

        if (data.some(({ status }) => status !== 200)) {
          throw new Error('Fetching students failed')
        }

        onSuccess && onSuccess()
      } catch (error) {
        if (error instanceof Error) {
          onError && onError(error.message)
        }
      } finally {
        this.isLoading.updateStudents = false
      }
    }
  }
})
