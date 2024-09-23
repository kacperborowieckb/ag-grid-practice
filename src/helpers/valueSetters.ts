import type { ValueSetterParams } from 'ag-grid-community'

export const validatedValueSetter =
  (customSetter?: (value: string) => void) => (params: ValueSetterParams) => {
    const field = params.colDef.field

    if (!field) return false

    const newValue = customSetter ? customSetter(params.newValue) : params.newValue
    const oldValue = customSetter ? customSetter(params.oldValue) : params.oldValue
    const shouldUpdate = params.data[field].isValidated

    params.data[field] = {
      ...params.data[field],
      isValidated: true,
      value: shouldUpdate && newValue ? newValue : oldValue
    }

    return false
  }
