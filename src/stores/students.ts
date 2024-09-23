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

type DefaultStudentsActionProps = { onError?: (errorMessage: string) => void }

export const useStudentsStore = defineStore('students', {
  state: (): StudentsStoreState => ({
    students: null,
    isLoading: false,
    error: ''
  }),
  actions: {
    async fetchStudents({ onError }: DefaultStudentsActionProps) {
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

          onError && onError(this.error)
        }
      } finally {
        this.isLoading = false
      }
    },
    async updateStudents({ onError }: DefaultStudentsActionProps) {
      if (!this.students) return

      try {
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
      } catch (error) {
        if (error instanceof Error) {
          onError && onError(error.message)
        }
      }
    }
  }
})
