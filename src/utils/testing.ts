import type { Student } from '@/services/students'

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
  }
}
