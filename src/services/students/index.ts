import http from '@/services/api'

import { endpoints } from '@/services/index'

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

async function addStudents(newStudents: Student[]) {
  // Solution only for working with json-server as it currently do not adding more than one record in post
  const promises = newStudents.map((newStudent) => http.post(endpoints.students, newStudent))

  return await Promise.all(promises)
}

async function deleteStudents(studentsData: Student[]) {
  // Solution for json-server because it do not support deleting multiple records
  const promises = studentsData.map((student) => http.delete(`${endpoints.students}/${student.id}`))

  return Promise.all(promises)
}

export default { getStudents, updateStudents, addStudents, deleteStudents }
