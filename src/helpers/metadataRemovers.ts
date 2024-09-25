import type { Student } from '@/services/students'
import type { StudentWithMetadata } from '@/stores/students'

export const removeStudentsMetadata = (students: StudentWithMetadata[]): Student[] => {
  return students.map((student) => {
    const studentObj = {} as Student

    // didn't find a way to properly type this, please let me know how I should handle this 🙏
    Object.entries(student).forEach(([key, value]) => {
      //   @ts-ignore
      studentObj[key] = value.value
    })

    return studentObj
  })
}
