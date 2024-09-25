import type { Student } from '@/services/students'
import type { StudentWithMetadata } from '@/stores/students'

export const mockStudentsData = [
  {
    id: 'b8a7a293-63b4-40e0-8ae7-93270e4a8e95',
    name: 'John',
    lastName: 'Doe',
    birthDate: 1061232000000,
    finalGrade: 4,
    hobbies: ['Reading']
  },
  {
    id: '3450beff-b4e9-4b49-bcbc-3e1cce3b693b',
    name: 'Emily',
    lastName: 'Smith',
    birthDate: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate()
    ).getTime(),
    finalGrade: 5,
    hobbies: []
  }
] as Student[]

export const mockStudentsDataWithMetadata = [
  {
    id: { value: 'b8a7a293-63b4-40e0-8ae7-93270e4a8e95', isValidated: true },
    name: { value: 'John', isValidated: true },
    lastName: { value: 'Doe', isValidated: true },
    birthDate: { value: 1061232000000, isValidated: true },
    finalGrade: { value: 4, isValidated: true },
    hobbies: { value: ['Reading'], isValidated: true }
  },
  {
    id: { value: '3450beff-b4e9-4b49-bcbc-3e1cce3b693b', isValidated: true },
    name: { value: 'Emily', isValidated: true },
    lastName: { value: 'Smith', isValidated: true },
    birthDate: {
      value: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate()
      ).getTime(),
      isValidated: true
    },
    finalGrade: { value: 5, isValidated: true },
    hobbies: { value: [], isValidated: true }
  }
] as StudentWithMetadata[]
