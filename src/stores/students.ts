import { defineStore } from 'pinia'

import { api } from '@/services'
import type { Student } from '@/services/students'
import { getStudentsWithMetadata } from '@/helpers/metadataMappers'
import { removeStudentsMetadata } from '@/helpers/metadataRemovers'

export type StudentWithMetadata = {
  [T in keyof Student]: {
    value?: Student[T]
    isValidated: boolean
  }
}

type StudentsStoreState = {
  students: StudentWithMetadata[] | null
  isFetchLoading: boolean
  isUpdateLoading: boolean
  isDeletingStudents: boolean
}

type DefaultStudentsActionProps = {
  onError?: (errorMessage: string) => void
  onSuccess?: () => void
}

type UpdateStudentsActionProps = {
  newStudents?: StudentWithMetadata[]
} & DefaultStudentsActionProps

type DeleteStudentsActionProps = {
  persistedStudentsToDelete?: StudentWithMetadata[]
  allStudentsToRemove?: StudentWithMetadata[]
} & DefaultStudentsActionProps

export const useStudentsStore = defineStore('students', {
  state: (): StudentsStoreState => ({
    students: null,
    isFetchLoading: false,
    isUpdateLoading: false,
    isDeletingStudents: false
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
    async updateStudents({ newStudents = [], onError, onSuccess }: UpdateStudentsActionProps = {}) {
      if (!this.students) return

      try {
        this.isUpdateLoading = true

        // need to create a separate one because do not support replacement of whole endpoints data
        const addStudentsResponseData = await api.students.addStudents(
          removeStudentsMetadata(newStudents)
        )

        const addStudentsError = addStudentsResponseData.some(
          ({ status }) => status !== 200 && status !== 201
        )

        if (addStudentsError) {
          throw new Error('Adding students failed')
        }

        const updateStudentsResponseData = await api.students.updateStudents(
          removeStudentsMetadata(this.students)
        )

        const updateStudentsError = updateStudentsResponseData.some(
          ({ status }) => status !== 200 && status !== 201
        )

        if (updateStudentsError) {
          throw new Error('Updating students failed')
        }

        onSuccess && onSuccess()
      } catch (error) {
        if (error instanceof Error) {
          onError && onError(error.message)
        }
      } finally {
        this.isUpdateLoading = false
      }
    },
    async deleteStudents({
      persistedStudentsToDelete = [],
      allStudentsToRemove = [],
      onError,
      onSuccess
    }: DeleteStudentsActionProps = {}) {
      try {
        this.isDeletingStudents = true

        const data = await api.students.deleteStudents(
          removeStudentsMetadata(persistedStudentsToDelete)
        )

        if (data.some(({ status }) => status !== 200)) {
          throw new Error('Deleting students failed')
        }

        const filteredStudents = this.students?.filter(
          (student) =>
            !allStudentsToRemove.find(
              (studentToRemove) => studentToRemove.id.value === student.id.value
            )
        )

        this.students = filteredStudents ?? []

        onSuccess && onSuccess()
      } catch (error) {
        if (error instanceof Error) {
          onError && onError(error.message)
        }
      } finally {
        this.isDeletingStudents = false
      }
    }
  }
})
