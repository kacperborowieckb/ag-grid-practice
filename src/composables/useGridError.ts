import type { GridApi } from 'ag-grid-community'
import type { ShallowRef } from 'vue'

export const useGridError = (gridApiRef: ShallowRef<GridApi | null>) => {
  const showError = (errorMessage: string) => {
    gridApiRef.value?.setGridOption('overlayNoRowsTemplate', errorMessage)
    gridApiRef.value?.showNoRowsOverlay()
  }

  const hideError = () => {
    gridApiRef.value?.hideOverlay()
  }

  return { showError, hideError }
}
