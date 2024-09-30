import type { ValueSetterParams } from 'ag-grid-community'

export const setValidatedValue =
  (customSetter?: (value: string) => void) => (params: ValueSetterParams) => {
    const field = params.colDef?.field

    if (!field) return false

    const newValue = customSetter ? customSetter(params.newValue) : params.newValue
    const oldValue = customSetter ? customSetter(params.oldValue) : params.oldValue
    const isValid = params.data[field].isValidated

    const shouldUpdate = isValid && newValue

    params.data[field] = {
      ...params.data[field],
      isValidated: true,
      value: shouldUpdate ? newValue : oldValue
    }

    return !!shouldUpdate
  }
