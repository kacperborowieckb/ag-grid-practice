import type { StudentsTableRowData } from './columnDefinitions'
import type { ValueFormatterParams } from 'ag-grid-community'

type StudentsFormatterParams = ValueFormatterParams<StudentsTableRowData>

export const studentsBirthDateFormatter = (params: StudentsFormatterParams) => {
  if (!params.data?.birthDate.value) return ''

  const birthday = new Date(params.data.birthDate.value)
  const today = new Date()

  const isCelebratingBirthday =
    birthday.getMonth() === today.getMonth() && birthday.getDate() === today.getDate()

  return `${birthday.toLocaleDateString('en-GB')} ${isCelebratingBirthday ? '🎂' : ''}`.trim()
}

export const studentsHobbiesFormatter = (params: StudentsFormatterParams) => {
  const hobbies = params.data?.hobbies.value

  return hobbies?.length ? hobbies.join(', ') : 'No hobbies.'
}
