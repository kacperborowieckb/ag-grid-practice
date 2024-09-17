import type { ColDef } from 'ag-grid-community'

import { getStudentsAge, getStudentsBirthDate, getStudentsHobbies } from '@/helpers/valueGetters'
import type { Student } from '@/services/students'
import StudentsTableActionsRenderer from '@/components/StudentsTableActionsRenderer.vue'

export type StudentsTableRowData = Student & {
  age: number
}

export const defaultStudentsColDef: ColDef = { flex: 1 }

export const studentsColDefs: ColDef<StudentsTableRowData>[] = [
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
    valueGetter: getStudentsBirthDate
  },
  {
    headerName: 'Age',
    valueGetter: getStudentsAge
  },
  {
    headerName: 'Final Grade',
    field: 'finalGrade'
  },
  {
    headerName: 'Hobbies',
    field: 'hobbies',
    valueGetter: getStudentsHobbies
  }
]
