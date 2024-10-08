import type { ValueSetterParams, GridApi } from 'ag-grid-community'

import type { Student } from '@/services/students'
import type { VueWrapper } from '@vue/test-utils'

export const ensureGridApiHasBeenSet = (vm: any) =>
  new Promise<void>(function (resolve) {
    ;(function waitForGridReady() {
      if (vm.studentsTableApi) {
        return resolve()
      }

      setTimeout(waitForGridReady, 30)
    })()
  })

export const generateMockParamsData = <T extends keyof Student>(field: T, date?: Student[T]) =>
  ({
    data: { [field]: { value: date, isValidated: true } }
  }) as any

type GenerateMockSetterParams = {
  field: string
  newValue: any
  oldValue: any
  isValidated: boolean
}

export const generateMockSetterParams = ({
  field,
  newValue,
  oldValue,
  isValidated = true
}: GenerateMockSetterParams) => {
  return {
    colDef: { field },
    data: { [field]: { value: oldValue, isValidated: isValidated } },
    newValue: newValue,
    oldValue
  } as Partial<ValueSetterParams>
}

export const getLastRowData = <T>(gridApi: GridApi): T => {
  const lastRow = gridApi.getRenderedNodes().at(-1)

  if (!lastRow?.data) throw new Error('last row do not exist')

  return lastRow.data
}

export const fillOutStudentRow = async (
  gridApi: GridApi,
  rowIndex: number,
  wrapper: VueWrapper
): Promise<void> => {
  gridApi.startEditingCell({ rowIndex, colKey: 'name' })
  await wrapper.find('input[type="text"]').setValue('Anthony')
  gridApi.stopEditing()
  gridApi.startEditingCell({ rowIndex, colKey: 'lastName' })
  await wrapper.find('input[type="text"]').setValue('Anthony')
  gridApi.stopEditing()
  gridApi.startEditingCell({ rowIndex, colKey: 'birthDate' })
  await wrapper.find('input[type="date"]').setValue('2005-02-25')
  gridApi.stopEditing()
  gridApi.startEditingCell({ rowIndex, colKey: 'finalGrade' })
  await wrapper.find('input[type="text"]').setValue(2)
  gridApi.stopEditing()
}
