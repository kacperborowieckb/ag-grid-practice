import type { ValueGetterParams } from 'ag-grid-community'

import type { StudentsTableRowData } from '@/helpers/columnDefinitions'

type StudentsGetterParams = ValueGetterParams<StudentsTableRowData>

export const getStudentsBirthDate = (params: StudentsGetterParams) => {
  const date = params.data?.birthDate.value

  return date ? new Date(date) : ''
}

export const getStudentsAge = (params: StudentsGetterParams) => {
  if (!params.data?.birthDate.value) return ''

  return (new Date().getFullYear() - new Date(params.data.birthDate.value).getFullYear()).toString()
}

export const getStudentsHobbies = (params: StudentsGetterParams) => {
  const hobbies = params.data?.hobbies.value || []

  return hobbies.join(', ') || ''
}
