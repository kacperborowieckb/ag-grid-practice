/**
 * @vitest-environment happy-dom
 */

import { beforeEach, describe, expect, test, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import type { GridApi, IRowNode } from 'ag-grid-community'

import StudentsTable from '@/components/StudentsTable.vue'
import { getStudentsWithMetadata } from '@/helpers/metadataMappers'
import { mockStudentsData, mockStudentsDataWithMetadata } from '@/mocks/mockStudentsData'
import { ensureGridApiHasBeenSet, fillOutStudentRow, getLastRowData } from '@/utils/testing'
import { type StudentWithMetadata, useStudentsStore } from '@/stores/students'
import { getStudentsSpy, updateStudentsSpy } from '@/mocks/mockStudentsEndpoints'
import { removeStudentsMetadata } from '@/helpers/metadataRemovers'

describe('StudentsTable', () => {
  let wrapper: VueWrapper
  let gridApi: GridApi<StudentWithMetadata>
  let mockStudentsStore: ReturnType<typeof useStudentsStore>

  window.alert = vi.fn()

  const renderStudentsTable = async () => {
    wrapper = mount(StudentsTable)
    await ensureGridApiHasBeenSet(wrapper.vm)
    gridApi = (wrapper.vm as any).studentsTableApi
  }

  const getCellValue = (rowIndex: string, colKey: string, useFormatter?: boolean) => {
    const rowNode = gridApi.getRowNode(rowIndex)

    if (!rowNode) throw new Error('No rowNode found')

    return gridApi.getCellValue({ rowNode, colKey, useFormatter })
  }

  beforeEach(async () => {
    setActivePinia(createPinia())
    mockStudentsStore = useStudentsStore()

    await renderStudentsTable()
  })

  describe('rendering', () => {
    test('should render 2 rows', () => {
      expect(gridApi.getRenderedNodes().length).toBe(2)
    })

    test('should render correct columns', () => {
      expect(gridApi.getColumn('checkboxSelection')).toBeTruthy()
      expect(gridApi.getColumn('name')).toBeTruthy()
      expect(gridApi.getColumn('lastName')).toBeTruthy()
      expect(gridApi.getColumn('birthDate')).toBeTruthy()
      expect(gridApi.getColumn('finalGrade')).toBeTruthy()
      expect(gridApi.getColumn('hobbies')).toBeTruthy()
      expect(gridApi.getColumns()?.find((col) => col.getColDef().headerName === 'Age')).toBeTruthy()
      expect(gridApi.getColumns()?.length).toEqual(7)
    })

    test('should render correct data in first row', () => {
      const firstRow = gridApi.getRowNode(mockStudentsData[0].id)

      expect(firstRow?.data).toEqual(getStudentsWithMetadata(mockStudentsData)[0])
    })

    test('should correctly render birthData and age data', () => {
      expect(getCellValue(mockStudentsData[0].id, 'birthDate', true)).toEqual('18/08/2003')

      const calculatedAge = (
        new Date().getFullYear() - new Date(mockStudentsData[0].birthDate).getFullYear()
      ).toString()

      expect(getCellValue(mockStudentsData[0].id, 'age')).toEqual(calculatedAge)
    })

    test('should render a cake if student celebrates birthday', () => {
      expect(getCellValue(mockStudentsData[1].id, 'birthDate', true)).toContain('🎂')
    })

    test('should render loading state in overlay when fetching data', async () => {
      getStudentsSpy.mockImplementationOnce(() => new Promise(() => {}))

      await renderStudentsTable()

      expect(wrapper.find('.ag-overlay-wrapper').text()).toContain('Loading...')
    })

    test('should render error message in grid overlay if fetch failed', async () => {
      const errorMessage = 'Failed to fetch'

      getStudentsSpy.mockImplementationOnce(() => {
        throw new Error('Failed to fetch')
      })

      await renderStudentsTable()

      expect(wrapper.find('.ag-overlay-wrapper').text()).toContain(errorMessage)
    })
  })

  describe('editing', () => {
    test('should change value in cell after edit', async () => {
      gridApi.startEditingCell({ rowIndex: 0, colKey: 'name' })
      await wrapper.find('input[type="text"]').setValue('Johnny')

      gridApi.stopEditing()

      expect(getCellValue(mockStudentsData[0].id, 'name')).toEqual('Johnny')
    })

    test('should have isValidated set to false when wrong value is provided while editing', async () => {
      gridApi.startEditingCell({ rowIndex: 0, colKey: 'name' })

      const nameEditor = wrapper.find('input[type="text"]')

      await nameEditor.setValue('J')

      expect(gridApi.getRowNode(mockStudentsData[0].id)?.data['name'].isValidated).toEqual(false)

      gridApi.stopEditing()
    })

    test('should not change value in cell after edit with wrong value', async () => {
      gridApi.startEditingCell({ rowIndex: 0, colKey: 'name' })

      const nameEditor = wrapper.find('input[type="text"]')

      await nameEditor.setValue('J')

      gridApi.stopEditing()

      expect(getCellValue(mockStudentsData[0].id, 'name')).toEqual('John')
    })

    test('should change birthDate value after edit in date picker', async () => {
      gridApi.startEditingCell({ rowIndex: 0, colKey: 'birthDate' })

      const dateEditor = wrapper.find('input[type="date"]')

      await dateEditor.setValue('2005-02-25')

      gridApi.stopEditing()

      expect(getCellValue(mockStudentsData[0].id, 'birthDate', true)).toEqual('25/02/2005')
    })

    test('should change age value after change in birthDate column', async () => {
      gridApi.startEditingCell({ rowIndex: 0, colKey: 'birthDate' })

      const dateEditor = wrapper.find('input[type="date"]')

      const ageValue = getCellValue(mockStudentsData[0].id, 'age')

      await dateEditor.setValue('2005-02-25')

      gridApi.stopEditing()

      expect(Number(getCellValue(mockStudentsData[0].id, 'age'))).toEqual(Number(ageValue) - 2)
    })

    test('should correctly add hobbies and save as array', async () => {
      gridApi.startEditingCell({ rowIndex: 0, colKey: 'hobbies' })

      const hobbiesEditor = wrapper.find('input[type="text"]')

      await hobbiesEditor.setValue('Coding, Chess')

      gridApi.stopEditing()

      expect(getCellValue(mockStudentsData[0].id, 'hobbies')).toEqual('Coding, Chess')
      expect(mockStudentsStore.students?.at(0)?.hobbies.value?.length).toBe(2)
      expect(mockStudentsStore.students?.at(0)?.hobbies.value).toEqual(['Coding', 'Chess'])
    })

    test('should stop editing after pressing enter', async () => {
      gridApi.startEditingCell({ rowIndex: 0, colKey: 'name' })
      const input = wrapper.find('input[type="text"]')

      await input.setValue('Johnny')
      await input.trigger('keydown.enter')

      expect(getCellValue(mockStudentsData[0].id, 'name')).toEqual('Johnny')
      expect(gridApi.getEditingCells().length).toEqual(0)
    })

    test('should stop editing after pressing esc', async () => {
      gridApi.startEditingCell({ rowIndex: 0, colKey: 'name' })
      const input = wrapper.find('input[type="text"]')

      await input.setValue('Johnny')
      await input.trigger('keydown.esc')

      expect(getCellValue(mockStudentsData[0].id, 'name')).toEqual('Johnny')
      expect(gridApi.getEditingCells().length).toEqual(0)
    })
  })

  describe('submitting', () => {
    test('should be disabled when cells do not change', () => {
      expect(wrapper.find('.students-table__submit').attributes('disabled')).toBeDefined()
    })

    test('should not be disabled when cell value changed', async () => {
      const submitButton = wrapper.find('.students-table__submit')

      gridApi.startEditingCell({ rowIndex: 0, colKey: 'name' })
      await wrapper.find('input[type="text"]').setValue('Johnny')

      gridApi.stopEditing()

      await flushPromises()

      expect(submitButton.attributes('disabled')).toBeUndefined()
    })

    test('should be disabled when cell value did not change after edit', async () => {
      const submitButton = wrapper.find('.students-table__submit')

      gridApi.startEditingCell({ rowIndex: 0, colKey: 'name' })
      await wrapper.find('input[type="text"]').setValue('John')

      gridApi.stopEditing()

      await flushPromises()

      expect(submitButton.attributes('disabled')).toBeDefined()
    })

    test('should be disabled while editing', async () => {
      const submitButton = wrapper.find('.students-table__submit')

      gridApi.startEditingCell({ rowIndex: 0, colKey: 'name' })
      await wrapper.find('input[type="text"]').setValue('Johnny')

      gridApi.stopEditing()

      gridApi.startEditingCell({ rowIndex: 0, colKey: 'lastName' })

      await flushPromises()

      expect(submitButton.attributes('disabled')).toBeDefined()
    })

    test('should call updateStudents with correct data', async () => {
      const submitButton = wrapper.find('.students-table__submit')

      gridApi.startEditingCell({ rowIndex: 0, colKey: 'name' })
      await wrapper.find('input[type="text"]').setValue('Johnny')

      gridApi.stopEditing()

      await flushPromises()

      await submitButton.trigger('click')

      expect(updateStudentsSpy).toBeCalledWith([
        { ...mockStudentsData[0], name: 'Johnny' },
        mockStudentsData[1]
      ])
    })

    test('should display loading state in button and be disabled while updating students', async () => {
      updateStudentsSpy.mockImplementationOnce(() => new Promise(() => {}))

      const submitButton = wrapper.find('.students-table__submit')

      gridApi.startEditingCell({ rowIndex: 0, colKey: 'name' })
      await wrapper.find('input[type="text"]').setValue('Johnny')

      gridApi.stopEditing()

      await flushPromises()

      await submitButton.trigger('click')

      expect(submitButton.text()).toContain('Loading')
      expect(submitButton.attributes('disabled')).toBeDefined()
    })

    test('should be disabled after updating students and do not contain loading state', async () => {
      updateStudentsSpy.mockImplementationOnce(() => Promise.resolve([]))

      const submitButton = wrapper.find('.students-table__submit')

      gridApi.startEditingCell({ rowIndex: 0, colKey: 'name' })
      await wrapper.find('input[type="text"]').setValue('Johnny')

      gridApi.stopEditing()

      await flushPromises()

      await submitButton.trigger('click')

      expect(submitButton.text()).toContain('Submit')
      expect(submitButton.attributes('disabled')).toBeDefined()
    })

    test('should display alert if updating students failed', async () => {
      const errorMessage = 'Updating students failed'

      updateStudentsSpy.mockImplementationOnce(() => {
        throw new Error('Updating students failed')
      })

      const submitButton = wrapper.find('.students-table__submit')

      gridApi.startEditingCell({ rowIndex: 0, colKey: 'name' })
      await wrapper.find('input[type="text"]').setValue('Johnny')

      gridApi.stopEditing()

      await flushPromises()

      await submitButton.trigger('click')

      expect(window.alert).toBeCalledTimes(1)
      expect(window.alert).toBeCalledWith(errorMessage)
    })
  })

  describe.only('adding new rows', () => {
    test('should add new row without any data on button click', async () => {
      const addRowButton = wrapper.find('[data-test="add-row-button"]')

      await addRowButton.trigger('click')

      const { id, ...newStudent } = getLastRowData<StudentWithMetadata>(gridApi)

      const hasAnyData = Object.values(newStudent).every((colData) => !!colData.value)

      expect((wrapper.vm as any).addedRows).toHaveLength(1)
      expect(hasAnyData).toBe(false)
    })

    test('submit button should be disabled after adding new row', async () => {
      const addRowButton = wrapper.find('[data-test="add-row-button"]')

      await addRowButton.trigger('click')

      const submitButton = wrapper.find('.students-table__submit')

      expect(submitButton.attributes('disabled')).toBeDefined()
    })

    test('submit button should be disabled after adding new row, when some value has been changed before and after', async () => {
      const addRowButton = wrapper.find('[data-test="add-row-button"]')

      gridApi.startEditingCell({ rowIndex: 0, colKey: 'name' })
      await wrapper.find('input[type="text"]').setValue('Anthony')
      gridApi.stopEditing()

      await addRowButton.trigger('click')

      gridApi.startEditingCell({ rowIndex: 0, colKey: 'lastName' })
      await wrapper.find('input[type="text"]').setValue('Smith')
      gridApi.stopEditing()

      await flushPromises()

      const submitButton = wrapper.find('.students-table__submit')

      expect(submitButton.attributes('disabled')).toBeDefined()
    })

    test('submit button should not be disabled when new row is filled with values and some value changed', async () => {
      const addRowButton = wrapper.find('[data-test="add-row-button"]')

      await addRowButton.trigger('click')

      await fillOutStudentRow(gridApi, gridApi.getRenderedNodes().length - 1, wrapper)

      const submitButton = wrapper.find('.students-table__submit')

      await flushPromises()
      expect(submitButton.attributes('disabled')).not.toBeDefined()
    })
  })
})
