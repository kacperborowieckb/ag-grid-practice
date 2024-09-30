import type { Student } from '@/services/students'
import type { StudentWithMetadata } from '@/stores/students'

export const getStudentsWithMetadata = (students: Student[]): StudentWithMetadata[] => {
  return students.map((student) => {
    const studentWithMetadata = {} as StudentWithMetadata

    Object.keys(student).forEach(<T extends keyof Student>(key: string) => {
      studentWithMetadata[key as T] = {
        value: student[key as T],
        isValidated: true
      } as StudentWithMetadata[T]
    })

    return studentWithMetadata
  })
}
