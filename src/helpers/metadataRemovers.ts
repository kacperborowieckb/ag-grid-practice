import type { Student } from '@/services/students'
import type { StudentWithMetadata } from '@/stores/students'

export const removeStudentsMetadata = (students: StudentWithMetadata[]): Student[] => {
  return students.map((student) => {
    const studentObj = {} as Student

    Object.entries(student).forEach(
      <T extends keyof StudentWithMetadata>([key, value]: [string, StudentWithMetadata[T]]) => {
        studentObj[key as T] = value.value
      }
    )

    return studentObj
  })
}
