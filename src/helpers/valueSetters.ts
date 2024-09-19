import type { ValueSetterParams } from 'ag-grid-community'

export const validatedValueSetter =
  (validateFn: (stringToTest: string) => boolean, customSetter?: (value: string) => void) =>
  (params: ValueSetterParams) => {
    const isValid = validateFn(params.newValue)
    const field = params.colDef.field

    if (!field) return false

    const newValue = customSetter ? customSetter(params.newValue) : params.newValue
    const oldValue = customSetter ? customSetter(params.oldValue) : params.oldValue

    params.data[field] = {
      ...params.data[field],
      isValidated: isValid,
      value: isValid ? newValue : oldValue
    }

    return isValid
  }
