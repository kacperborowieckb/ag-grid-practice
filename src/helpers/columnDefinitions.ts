import type { ColDef } from 'ag-grid-community'

import {
  studentsAgeFormatter,
  studentsBirthDateFormatter,
  studentsHobbiesFormatter
} from './valueFormatters'
import type { Student } from '@/services/students'

export type StudentsTableRowData = Student & {
  age: number
}

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
    valueFormatter: studentsBirthDateFormatter
  },
  {
    headerName: 'Age',
    valueGetter: (params) => params.data?.birthDate,
    valueFormatter: studentsAgeFormatter
  },
  {
    headerName: 'Final Grade',
    field: 'finalGrade'
  },
  {
    headerName: 'Hobbies',
    field: 'hobbies',
    valueFormatter: studentsHobbiesFormatter
  }
]
