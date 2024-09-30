import studentsController from '@/services/students/index'

export const endpoints = {
  students: '/students'
} as const

export const api = {
  students: studentsController
}
