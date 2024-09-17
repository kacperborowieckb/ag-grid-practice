import type { GridApi } from 'ag-grid-community'

export const createGridError = <T>(gridApi: GridApi<T>, errorMessage: string) => {
  gridApi.setGridOption('overlayNoRowsTemplate', errorMessage)
  gridApi.showNoRowsOverlay()
}
