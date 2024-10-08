export const API_URL = 'http://localhost:3000'

export const emptyStudent = {
  id: { value: crypto.randomUUID(), isValidated: true },
  name: { isValidated: false },
  lastName: { isValidated: false },
  birthDate: { isValidated: false },
  finalGrade: { isValidated: false },
  hobbies: { value: [], isValidated: true }
}
