import type { ColDef } from 'ag-grid-community'

import type { StudentWithMetadata } from '@/stores/students'
import {
  validateFinalGrade,
  validateStudentName,
  validateHobbies
} from '@/validators/studentsValidators'
import ValidatedTextCellEditor from '@/components/ValidatedTextCellEditor.vue'

import { getStudentsAge, getStudentsBirthDate, getStudentsHobbies } from './valueGetters'
import { validatedValueSetter } from './valueSetters'
import { studentsBirthDateFormatter, studentsHobbiesFormatter } from './valueFormatters'

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
    valueSetter: validatedValueSetter()
  },
  {
    headerName: 'Last Name',
    field: 'lastName',
    cellEditor: ValidatedTextCellEditor,
    cellEditorParams: { validator: validateStudentName },
    valueGetter: (params) => params.data?.lastName.value,
    valueSetter: validatedValueSetter()
  },
  {
    headerName: 'Birth Date',
    field: 'birthDate',
    cellEditor: 'agDateCellEditor',
    cellEditorParams: {
      max: new Date()
    },
    valueGetter: getStudentsBirthDate,
    valueSetter: validatedValueSetter(),
    valueFormatter: studentsBirthDateFormatter
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
    valueSetter: validatedValueSetter()
  },
  {
    headerName: 'Hobbies',
    field: 'hobbies',
    cellEditor: ValidatedTextCellEditor,
    cellEditorParams: { validator: validateHobbies },
    valueGetter: getStudentsHobbies,
    valueSetter: validatedValueSetter((newValue) => {
      if (!newValue.trim()) return []

      return newValue.split(', ').map((hobby) => hobby.trim().replace(/\s+/g, ' '))
    }),
    valueFormatter: studentsHobbiesFormatter
  }
]
