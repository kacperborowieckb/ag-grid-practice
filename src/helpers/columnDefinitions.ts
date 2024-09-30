import type { ColDef } from 'ag-grid-community'

import type { StudentWithMetadata } from '@/stores/students'
import {
  validateFinalGrade,
  validateStudentName,
  validateHobbies
} from '@/validators/studentsValidators'
import ValidatedTextCellEditor from '@/components/ValidatedTextCellEditor.vue'

import { setValidatedValue } from './valueSetters'
import { formatStudentsBirthDate, formatStudentsHobbies } from './valueFormatters'
import { getStudentsAge, getStudentsBirthDate, getStudentsHobbies } from './valueGetters'

export type StudentsTableRowData = StudentWithMetadata & {
  age: number
}

export const defaultStudentsColDef: ColDef = {
  flex: 1,
  editable: true
}

export const studentsColDefs: ColDef<StudentsTableRowData>[] = [
  {
    headerName: 'Name',
    field: 'name',
    cellEditor: ValidatedTextCellEditor,
    cellEditorParams: { validator: validateStudentName },
    valueGetter: (params) => params.data?.name.value,
    valueSetter: setValidatedValue()
  },
  {
    headerName: 'Last Name',
    field: 'lastName',
    cellEditor: ValidatedTextCellEditor,
    cellEditorParams: { validator: validateStudentName },
    valueGetter: (params) => params.data?.lastName.value,
    valueSetter: setValidatedValue()
  },
  {
    headerName: 'Birth Date',
    field: 'birthDate',
    cellEditor: 'agDateCellEditor',
    cellEditorParams: {
      max: new Date()
    },
    valueGetter: getStudentsBirthDate,
    valueSetter: setValidatedValue(),
    valueFormatter: formatStudentsBirthDate
  },
  {
    colId: 'age',
    headerName: 'Age',
    valueGetter: getStudentsAge,
    editable: false
  },
  {
    headerName: 'Final Grade',
    field: 'finalGrade',
    cellEditor: ValidatedTextCellEditor,
    cellEditorParams: { validator: validateFinalGrade },
    valueGetter: (params) => params.data?.finalGrade.value,
    valueSetter: setValidatedValue()
  },
  {
    headerName: 'Hobbies',
    field: 'hobbies',
    cellEditor: ValidatedTextCellEditor,
    cellEditorParams: { validator: validateHobbies },
    valueGetter: getStudentsHobbies,
    valueSetter: setValidatedValue((newValue) => {
      if (!newValue.trim()) return []

      return newValue
        .replace(/,+/g, ',')
        .split(',')
        .map((hobby) => hobby.trim().replace(/\s+/g, ' '))
        .filter(Boolean)
    }),
    valueFormatter: formatStudentsHobbies
  }
]
