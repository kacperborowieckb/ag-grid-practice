import type { ColDef } from 'ag-grid-community'

import {
  studentsAgeGetter,
  studentsBirthDateGetter,
  studentsHobbiesGetter
} from '@/helpers/valueGetters'
import type { Student } from '@/services/students'

export type StudentsTableRowData = Student & {
  age: number
}

export const getDefaultStudentsColDef = (): ColDef => ({ flex: 1 })

export const getStudentsColDefs = (): ColDef<StudentsTableRowData>[] => [
  {
    headerName: 'Name',
    field: 'name'
  },
  {
    headerName: 'Last Name',
    field: 'lastName'
  },
  {
    headerName: 'Birth Date',
    field: 'birthDate',
    valueGetter: studentsBirthDateGetter
  },
  {
    headerName: 'Age',
    valueGetter: studentsAgeGetter
  },
  {
    headerName: 'Final Grade',
    field: 'finalGrade'
  },
  {
    headerName: 'Hobbies',
    field: 'hobbies',
    valueGetter: studentsHobbiesGetter
  }
]
