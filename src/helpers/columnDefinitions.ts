import type { ColDef } from 'ag-grid-community'

import { getStudentsAge, getStudentsBirthDate, getStudentsHobbies } from '@/helpers/valueGetters'
import type { Student } from '@/services/students'
import StudentsTableActionsRenderer from '@/components/StudentsTableActionsRenderer.vue'
import type { StudentWithMetadata } from '@/stores/students'

export type StudentsTableRowData = StudentWithMetadata & {
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
    field: 'name',
    valueGetter: (params) => params.data?.name.value,
    valueSetter: (params) => {
      if (params.newValue.length > 5) {
        params.data.name.isValidated = false
        params.data.name.value = params.oldValue

        return false
      }
      params.data.name.isValidated = true
      params.data.name.value = params.newValue

      return true
    },
    cellClassRules: {
      'cell-error': (params) => !params.data?.name.isValidated
    }
  },
  {
    headerName: 'Last Name',
    field: 'lastName',
    valueGetter: (params) => params.data?.lastName.value
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
    field: 'finalGrade',
    valueGetter: (params) => params.data?.finalGrade.value
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
