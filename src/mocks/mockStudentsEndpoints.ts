import type { AxiosResponse } from 'axios'
import { vi } from 'vitest'

import { api } from '@/services'
import type { Student } from '@/services/students'

import { mockStudentsData } from './mockStudentsData'

export const getStudentsSpy = vi
  .spyOn(api.students, 'getStudents')
  .mockResolvedValue({ status: 200, data: mockStudentsData } as AxiosResponse<Student[]>)

export const updateStudentsSpy = vi
  .spyOn(api.students, 'updateStudents')
  .mockResolvedValue([{ status: 200 }, { status: 200 }] as AxiosResponse[])

export const addStudentsSpy = vi.spyOn(api.students, 'addStudents').mockResolvedValue([])
