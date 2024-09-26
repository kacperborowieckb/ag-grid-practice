/**
 * @vitest-environment happy-dom
 */

import { VueWrapper, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import type { ITextCellEditorParams } from 'ag-grid-community'

import ValidatedTextCellEditor, {
  type ValidatedTextCellEditorProps
} from '@/components/ValidatedTextCellEditor.vue'

describe('ValidatedTextCellEditor', () => {
  let wrapper: VueWrapper
  const field = 'name'
  const defaultValue = 'John'
  const mockStopEditing = vi.fn()

  const mockValidator = (stringToTest: string) => stringToTest.length >= 4

  const getInputValue = (): string => (wrapper.vm as any).inputValue

  const getFieldData = (): { value: string; isValidated: boolean } =>
    (wrapper.props() as ValidatedTextCellEditorProps).params.data[field]

  beforeEach(() => {
    wrapper = mount(ValidatedTextCellEditor, {
      props: {
        params: {
          value: defaultValue,
          validator: mockValidator,
          colDef: {
            field
          },
          data: {
            [field]: { value: defaultValue, isValidated: true }
          },
          stopEditing: mockStopEditing
        } as Partial<ITextCellEditorParams>
      } as ValidatedTextCellEditorProps
    })
  })

  test('should render input', () => {
    expect(wrapper.find('input')).toBeDefined()
  })

  test('should have default value on render', () => {
    expect(getInputValue()).toBe('John')
  })

  test('should have isValidated property set to true', () => {
    expect(getFieldData().isValidated).toBe(true)
  })

  test('should change value in model and not in params', async () => {
    await wrapper.find('input').setValue('Johnny')

    expect(getInputValue()).toBe('Johnny')
    expect(getFieldData().value).toBe('John')
  })

  test('should fire stop editing after pressing enter', async () => {
    const input = wrapper.find('input')

    await input.setValue('Johnny')
    await input.trigger('keydown.enter')

    expect(mockStopEditing).toBeCalled()
  })

  test('should fire stop editing with true after pressing esc', async () => {
    const input = wrapper.find('input')

    await input.setValue('Johnny')
    await input.trigger('keydown.esc')

    expect(mockStopEditing).toBeCalledWith(true)
  })

  test('should set validation flag based on based on validation status', async () => {
    const input = wrapper.find('input')

    expect(getFieldData().isValidated).toBe(true)

    await input.setValue('Joh')

    expect(getFieldData().isValidated).toBe(false)

    await input.setValue('Johnny')

    expect(getFieldData().isValidated).toBe(true)
  })
})
