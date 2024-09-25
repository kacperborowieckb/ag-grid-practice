/**
 * @vitest-environment happy-dom
 */

import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import type { GridApi } from 'ag-grid-community'

import StudentsTable from '@/components/StudentsTable.vue'
import { type StudentWithMetadata, useStudentsStore } from '@/stores/students'
import { getStudentsWithMetadata } from '@/helpers/metadataMappers'
import { api } from '@/services'
import type { Student } from '@/services/students'
import type { AxiosResponse } from 'axios'
import { mockStudentsData } from '@/mocks/mockStudentsData'

const ensureGridApiHasBeenSet = (vm: any) =>
  new Promise<void>(function (resolve) {
    ;(function waitForGridReady() {
      if (vm.studentsTableApi) {
        return resolve()
      }

      setTimeout(waitForGridReady, 20)
    })()
  })

const getStudentsSpy = vi
  .spyOn(api.students, 'getStudents')
  .mockResolvedValue({ status: 200, data: mockStudentsData } as AxiosResponse<Student[]>)

const updateStudentsSpy = vi
  .spyOn(api.students, 'updateStudents')
  .mockResolvedValue([{ status: 200 }, { status: 200 }] as AxiosResponse[])

window.alert = vi.fn()

describe('StudentsTable', () => {
  let wrapper: VueWrapper
  let gridApi: GridApi<StudentWithMetadata>
  let mockStudentsStore: ReturnType<typeof useStudentsStore>

  const renderStudentsTable = async () => {
    wrapper = mount(StudentsTable)
    await ensureGridApiHasBeenSet(wrapper.vm)
    gridApi = (wrapper.vm as any).studentsTableApi
  }

  beforeEach(async () => {
    setActivePinia(createPinia())
    mockStudentsStore = useStudentsStore()

    await renderStudentsTable()
  })

  const getCellValue = (rowIndex: string, colKey: string, useFormatter?: boolean) => {
    const rowNode = gridApi.getRowNode(rowIndex)

    if (!rowNode) throw new Error('No rowNode found')

    return gridApi.getCellValue({ rowNode, colKey, useFormatter })
  }

  describe('rendering', () => {
    test('should render 2 rows', () => {
      expect(gridApi.getRenderedNodes().length).toBe(2)
    })

    test('should render correct columns', () => {
      expect(gridApi.getColumn('name')).toBeTruthy()
      expect(gridApi.getColumn('lastName')).toBeTruthy()
      expect(gridApi.getColumn('birthDate')).toBeTruthy()
      expect(gridApi.getColumn('finalGrade')).toBeTruthy()
      expect(gridApi.getColumn('hobbies')).toBeTruthy()
      expect(gridApi.getColumns()?.find((col) => col.getColDef().headerName === 'Age')).toBeTruthy()
      expect(gridApi.getColumns()?.length).toEqual(6)
    })

    test('should render correct data in first row', () => {
      const firstRow = gridApi.getRowNode('0')

      expect(firstRow?.data).toEqual(getStudentsWithMetadata(mockStudentsData)[0])
    })

    test('should correctly render birthData and age data', () => {
      expect(getCellValue('0', 'birthDate', true)).toEqual('18/08/2003')

      const calculatedAge = (
        new Date().getFullYear() - new Date(mockStudentsData[0].birthDate).getFullYear()
      ).toString()

      expect(getCellValue('0', 'age')).toEqual(calculatedAge)
    })

    test('should render a cake if student celebrates birthday', () => {
      expect(getCellValue('1', 'birthDate', true)).toContain('🎂')
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

      expect(getCellValue('0', 'name')).toEqual('Johnny')
    })

    test('should have isValidated set to false when wrong value is provided while editing', async () => {
      gridApi.startEditingCell({ rowIndex: 0, colKey: 'name' })

      const nameEditor = wrapper.find('input[type="text"]')

      await nameEditor.setValue('J')

      expect(gridApi.getRowNode('0')?.data['name'].isValidated).toEqual(false)

      gridApi.stopEditing()
    })

    test('should not change value in cell after edit with wrong value', async () => {
      gridApi.startEditingCell({ rowIndex: 0, colKey: 'name' })

      const nameEditor = wrapper.find('input[type="text"]')

      await nameEditor.setValue('J')

      gridApi.stopEditing()

      expect(getCellValue('0', 'name')).toEqual('John')
    })

    test('should change birthDate value after edit in date picker', async () => {
      gridApi.startEditingCell({ rowIndex: 0, colKey: 'birthDate' })

      const dateEditor = wrapper.find('input[type="date"]')

      await dateEditor.setValue('2005-02-25')

      gridApi.stopEditing()

      expect(getCellValue('0', 'birthDate', true)).toEqual('25/02/2005')
    })

    test('should change age value after change in birthDate column', async () => {
      gridApi.startEditingCell({ rowIndex: 0, colKey: 'birthDate' })

      const dateEditor = wrapper.find('input[type="date"]')

      const ageValue = getCellValue('0', 'age')

      await dateEditor.setValue('2005-02-25')

      gridApi.stopEditing()

      expect(Number(getCellValue('0', 'age'))).toEqual(Number(ageValue) - 2)
    })

    test('should correctly add hobbies and save as array', async () => {
      gridApi.startEditingCell({ rowIndex: 0, colKey: 'hobbies' })

      const hobbiesEditor = wrapper.find('input[type="text"]')

      await hobbiesEditor.setValue('Coding, Chess')

      gridApi.stopEditing()

      expect(getCellValue('0', 'hobbies')).toEqual('Coding, Chess')
      expect(mockStudentsStore.students?.at(0)?.hobbies.value.length).toBe(2)
      expect(mockStudentsStore.students?.at(0)?.hobbies.value).toEqual(['Coding', 'Chess'])
    })

    test('should stop editing after pressing enter', async () => {
      gridApi.startEditingCell({ rowIndex: 0, colKey: 'name' })
      const input = wrapper.find('input[type="text"]')

      await input.setValue('Johnny')
      await input.trigger('keydown.enter')

      expect(getCellValue('0', 'name')).toEqual('Johnny')
      expect(gridApi.getEditingCells().length).toEqual(0)
    })

    test('should stop editing after pressing esc', async () => {
      gridApi.startEditingCell({ rowIndex: 0, colKey: 'name' })
      const input = wrapper.find('input[type="text"]')

      await input.setValue('Johnny')
      await input.trigger('keydown.esc')

      expect(getCellValue('0', 'name')).toEqual('Johnny')
      expect(gridApi.getEditingCells().length).toEqual(0)
    })
  })

  describe('submitting', () => {
    test('should be disabled when cells do not change', () => {
      expect(wrapper.find('.students-table__button').attributes('disabled')).toBeDefined()
    })

    test('should not be disabled when cell value changed', async () => {
      const submitButton = wrapper.find('.students-table__button')

      gridApi.startEditingCell({ rowIndex: 0, colKey: 'name' })
      await wrapper.find('input[type="text"]').setValue('Johnny')

      gridApi.stopEditing()

      await flushPromises()

      expect(submitButton.attributes('disabled')).toBeUndefined()
    })

    test('should be disabled when cell value did not change after edit', async () => {
      const submitButton = wrapper.find('.students-table__button')

      gridApi.startEditingCell({ rowIndex: 0, colKey: 'name' })
      await wrapper.find('input[type="text"]').setValue('John')

      gridApi.stopEditing()

      await flushPromises()

      expect(submitButton.attributes('disabled')).toBeDefined()
    })

    test('should be disabled while editing', async () => {
      const submitButton = wrapper.find('.students-table__button')

      gridApi.startEditingCell({ rowIndex: 0, colKey: 'name' })
      await wrapper.find('input[type="text"]').setValue('Johnny')

      gridApi.stopEditing()

      gridApi.startEditingCell({ rowIndex: 0, colKey: 'lastName' })

      await flushPromises()

      expect(submitButton.attributes('disabled')).toBeDefined()
    })

    test('should call updateStudents with correct data', async () => {
      const submitButton = wrapper.find('.students-table__button')

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

      const submitButton = wrapper.find('.students-table__button')

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

      const submitButton = wrapper.find('.students-table__button')

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

      const submitButton = wrapper.find('.students-table__button')

      gridApi.startEditingCell({ rowIndex: 0, colKey: 'name' })
      await wrapper.find('input[type="text"]').setValue('Johnny')

      gridApi.stopEditing()

      await flushPromises()

      await submitButton.trigger('click')

      expect(window.alert).toBeCalledTimes(1)
      expect(window.alert).toBeCalledWith(errorMessage)
    })
  })
})
