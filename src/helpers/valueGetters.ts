import type { ValueGetterParams } from 'ag-grid-community'

import type { StudentsTableRowData } from '@/helpers/columnDefinitions'

type StudentsGetterParams<T> = ValueGetterParams<StudentsTableRowData, T>

export const studentsHobbiesGetter = (params: StudentsGetterParams<string[]>) => {
  return params.data?.hobbies?.length ? params.data.hobbies.join(', ') : 'No hobbies.'
}

export const studentsBirthDateGetter = (params: StudentsGetterParams<number>) => {
  if (!params.data?.birthDate) return ''

  const birthday = new Date(params.data.birthDate)
  const today = new Date()

  const isCelebratingBirthday =
    birthday.getMonth() === today.getMonth() && birthday.getDate() === today.getDate()

  return `${birthday.toLocaleDateString()} ${isCelebratingBirthday ? '🎂' : ''}`.trim()
}

export const studentsAgeGetter = (params: StudentsGetterParams<number>) => {
  if (!params.data?.birthDate) return ''

  return (new Date().getFullYear() - new Date(params.data.birthDate).getFullYear()).toString()
}
