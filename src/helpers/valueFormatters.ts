import type { ValueFormatterParams } from 'ag-grid-community'

import type { StudentsTableRowData } from './columnDefinitions'

type StudentsFormatterParams<T> = ValueFormatterParams<StudentsTableRowData, T>

export const studentsHobbiesFormatter = (params: StudentsFormatterParams<string[]>) => {
  return params.value ? params.value.join(', ') : 'No hobbies.'
}

export const studentsBirthDateFormatter = (params: StudentsFormatterParams<number>) => {
  if (!params.value) return ''

  const birthday = new Date(params.value)
  const today = new Date()

  const isCelebratingBirthday =
    birthday.getMonth() === today.getMonth() && birthday.getDate() === today.getDate()

  return `${birthday.toLocaleDateString()} ${isCelebratingBirthday ? '🎂' : ''}`.trim()
}

export const studentsAgeFormatter = (params: StudentsFormatterParams<number>) => {
  if (!params.value) return ''

  return (new Date().getFullYear() - new Date(params.value).getFullYear()).toString()
}
