import type { GridApi } from 'ag-grid-community'

export const createGridError = (gridApi: GridApi, errorMessage: string) => {
  gridApi.setGridOption('overlayNoRowsTemplate', errorMessage)
  gridApi.showNoRowsOverlay()
}
