import http from '@/services/api'
import { endpoints } from '../index'

export type Student = {
  id: string
  name: string
  lastName: string
  birthDate: number
  finalGrade: number
  hobbies: string[]
}

async function getStudents() {
  return await http.get<Student[]>(endpoints.students)
}

async function updateStudents(studentsData: Student[]) {
  // Solution only for working with json-server as it currently do not support replacement whole endpoints data
  const promises = studentsData.map((student) =>
    http.put(`${endpoints.students}/${student.id}`, student)
  )

  return Promise.all(promises)
}

export default { getStudents, updateStudents }
