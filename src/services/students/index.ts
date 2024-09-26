import http from '@/services/api'

export type Student = {
  name: string
  lastName: string
  birthDate: number
  finalGrade: number
  hobbies: string[]
}

const studentsEndpoints = {
  getStudents: '/students'
} as const

async function getStudents() {
  return await http.get<Student[]>(studentsEndpoints.getStudents)
}

export default { getStudents }
