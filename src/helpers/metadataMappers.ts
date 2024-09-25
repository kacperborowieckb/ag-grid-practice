import type { Student } from '@/services/students'
import type { StudentWithMetadata } from '@/stores/students'

export const getStudentsWithMetadata = (students: Student[]): StudentWithMetadata[] => {
  return students.map((student) => {
    const studentWithMetadata = {} as StudentWithMetadata

    Object.keys(student).forEach((key) => {
      studentWithMetadata[key as keyof Student] = {
        // didn't find a way to properly type this, please let me know how I should handle this 🙏
        // @ts-ignore
        value: student[key],
        isValidated: true
      }
    })

    return studentWithMetadata
  })
}
