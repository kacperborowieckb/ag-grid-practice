import type { ValueSetterParams } from 'ag-grid-community'

type SetValidatedValueProps = {
  customSetter?: (value: string) => void
  checkValidation?: boolean
}

export const setValidatedValue =
  ({ customSetter, checkValidation = true }: SetValidatedValueProps = {}) =>
  (params: ValueSetterParams) => {
    const field = params.colDef?.field

    if (!field) return false

    const newValue = customSetter ? customSetter(params.newValue) : params.newValue
    const oldValue = customSetter ? customSetter(params.oldValue) : params.oldValue
    const isValid = checkValidation ? params.data[field].isValidated : true

    const shouldUpdate = isValid && newValue

    params.data[field] = {
      ...params.data[field],
      isValidated: shouldUpdate || oldValue ? true : false,
      value: shouldUpdate ? newValue : oldValue
    }

    return !!shouldUpdate
  }
