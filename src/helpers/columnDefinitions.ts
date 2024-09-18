import type { ColDef } from 'ag-grid-community'

import { getStudentsAge, getStudentsBirthDate, getStudentsHobbies } from '@/helpers/valueGetters'
import type { Student } from '@/services/students'
import StudentsTableActionsRenderer from '@/components/StudentsTableActionsRenderer.vue'

export type StudentsTableRowData = Student & {
  age: number
}

export const defaultStudentsColDef: ColDef = {
  flex: 1,
  editable: true,
  enableCellChangeFlash: true
}

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
    valueGetter: getStudentsAge,
    editable: false
  },
  {
    headerName: 'Final Grade',
    field: 'finalGrade'
  },
  {
    headerName: 'Hobbies',
    field: 'hobbies',
    valueGetter: getStudentsHobbies,
    valueParser: (params) => {
      if (params.newValue.includes(',')) {
        return params.newValue.split(',').map((hobby) => hobby.trim())
      }

      return params.oldValue
    }
  },
  {
    colId: 'edit',
    headerName: 'Edit',
    cellRenderer: StudentsTableActionsRenderer,
    editable: false,
    valueGetter: (params) => {
      const isEditing = !!params.api.getEditingCells().length

      return { isEditing }
    }
  }
]
