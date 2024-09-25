import { beforeEach, describe, expect, test, vi } from 'vitest'
import type { GridApi } from 'ag-grid-community'
import { useGridError } from '../useGridError'
import type { ShallowRef } from 'vue'

describe('useGridError', () => {
  let showErrorFn: (errorMessage: string) => void
  let hideErrorFn: () => void

  let mockGridApi: Partial<GridApi>
  let mockGridApiRef: ShallowRef

  beforeEach(() => {
    mockGridApi = {
      setGridOption: vi.fn(),
      showNoRowsOverlay: vi.fn(),
      hideOverlay: vi.fn()
    }

    mockGridApiRef = { value: mockGridApi as GridApi } as ShallowRef

    const { showError, hideError } = useGridError(mockGridApiRef)
    showErrorFn = showError
    hideErrorFn = hideError
  })

  test('should return two functions', () => {
    expect(showErrorFn).toBeDefined()
    expect(hideErrorFn).toBeDefined()
  })

  test('showError should call setGridOption with correct data and showNoRowsOverlay', () => {
    const errorMessage = 'Error!'

    showErrorFn(errorMessage)
    expect(mockGridApi.setGridOption).toBeCalledTimes(1)
    expect(mockGridApi.setGridOption).toBeCalledWith('overlayNoRowsTemplate', errorMessage)
  })

  test('hideError should call hideOverlay', () => {
    hideErrorFn()

    expect(mockGridApi.hideOverlay).toBeCalledTimes(1)
  })

  test('should not call gridApi function if ref is undefined', () => {
    mockGridApiRef.value = undefined

    showErrorFn('err')
    hideErrorFn()

    expect(mockGridApi.setGridOption).not.toBeCalled()
    expect(mockGridApi.hideOverlay).not.toBeCalled()
  })
})
