import type { ValueGetterParams } from 'ag-grid-community'

import type { StudentsTableRowData } from '@/helpers/columnDefinitions'

type StudentsGetterParams<T> = ValueGetterParams<StudentsTableRowData, T>

export const getStudentsHobbies = (params: StudentsGetterParams<string[]>) => {
  const hobbies = params.data?.hobbies?.value || []

  return hobbies.join(', ') || 'No hobbies.'
}

export const getStudentsBirthDate = (params: StudentsGetterParams<number>) => {
  if (!params.data?.birthDate.value) return ''

  const birthday = new Date(params.data.birthDate.value)
  const today = new Date()

  const isCelebratingBirthday =
    birthday.getMonth() === today.getMonth() && birthday.getDate() === today.getDate()

  return `${birthday.toLocaleDateString()} ${isCelebratingBirthday ? '🎂' : ''}`.trim()
}

export const getStudentsAge = (params: StudentsGetterParams<number>) => {
  if (!params.data?.birthDate.value) return ''

  return (new Date().getFullYear() - new Date(params.data.birthDate.value).getFullYear()).toString()
}
