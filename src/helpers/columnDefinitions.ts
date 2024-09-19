import type { ColDef } from 'ag-grid-community'

import StudentsTableActionsRenderer from '@/components/StudentsTableActionsRenderer.vue'
import type { StudentWithMetadata } from '@/stores/students'
import {
  validateFinalGrade,
  validateStudentName,
  validateBirthDate,
  validateHobbies
} from '@/validators/studentsValidators'

import { getStudentsAge, getStudentsBirthDate, getStudentsHobbies } from './valueGetters'
import { validatedValueSetter } from './valueSetters'
import { studentsBirthDateFormatter, studentsHobbiesFormatter } from './valueFormatters'

export type StudentsTableRowData = StudentWithMetadata & {
  age: number
}

export const defaultStudentsColDef: ColDef = {
  flex: 1,
  editable: true,
  enableCellChangeFlash: true,
  cellClassRules: {
    'cell-error': (params) => {
      const field = params.colDef.field
      const data = params.data

      if (!field) return false

      return !data[field].isValidated
    }
  }
}

export const studentsColDefs: ColDef<StudentsTableRowData>[] = [
  {
    headerName: 'Name',
    field: 'name',
    valueGetter: (params) => params.data?.name.value,
    valueSetter: validatedValueSetter(validateStudentName)
  },
  {
    headerName: 'Last Name',
    field: 'lastName',
    valueGetter: (params) => params.data?.lastName.value,
    valueSetter: validatedValueSetter(validateStudentName)
  },
  {
    headerName: 'Birth Date',
    field: 'birthDate',
    cellEditor: 'agDateCellEditor',
    valueGetter: getStudentsBirthDate,
    valueFormatter: studentsBirthDateFormatter,
    valueSetter: validatedValueSetter(validateBirthDate)
  },
  {
    headerName: 'Age',
    valueGetter: getStudentsAge,
    editable: false
  },
  {
    headerName: 'Final Grade',
    field: 'finalGrade',
    valueGetter: (params) => params.data?.finalGrade.value,
    valueSetter: validatedValueSetter(validateFinalGrade)
  },
  {
    headerName: 'Hobbies',
    field: 'hobbies',
    valueFormatter: studentsHobbiesFormatter,
    valueGetter: getStudentsHobbies,
    valueSetter: validatedValueSetter(validateHobbies, (val) => {
      if (!val) return []

      return val.split(', ').map((hobby) => hobby.trim())
    })
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
