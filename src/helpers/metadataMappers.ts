import type { Student } from '@/services/students'
import type { StudentWithMetadata } from '@/stores/students'

export function getStudentsWithMetadata(students: Student[]): StudentWithMetadata[] {
  return students.map((student) => {
    const studentWithMetadata = {} as StudentWithMetadata

    Object.keys(student).forEach((key) => {
      studentWithMetadata[key as keyof Student] = {
        // @ts-ignore
        value: student[key],
        isValidated: true
      }
    })

    return studentWithMetadata
  })
}
