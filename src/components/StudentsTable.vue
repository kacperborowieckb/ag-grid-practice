<template>
  <AgGridVue
    class="students-table ag-theme-quartz-dark"
    :columnDefs="studentsColDefs"
    :defaultColDef="defaultStudentsColDef"
    :rowData="studentsStore.students"
    :editType="'fullRow'"
    :suppressClickEdit="true"
    @gridReady="onGridReady"
    @cellClicked="onCellClicked"
    @rowEditingStarted="onRowEditingStarted"
    @rowEditingStopped="onRowEditingStopped"
  />
</template>

<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'
import { AgGridVue } from 'ag-grid-vue3'
import type {
  GridApi,
  GridReadyEvent,
  RowEditingStartedEvent,
  CellClickedEvent
} from 'ag-grid-community'

import { useStudentsStore } from '@/stores/students'
import {
  defaultStudentsColDef,
  studentsColDefs,
  type StudentsTableRowData
} from '@/helpers/columnDefinitions'
import { useGridError } from '@/composables/useGridError'

const studentsStore = useStudentsStore()

const rowEditDefaultData = ref<StudentsTableRowData | null>(null)
const studentsTableApi = shallowRef<GridApi<StudentsTableRowData> | null>(null)

const { showError } = useGridError(studentsTableApi)

const onFetchStudentsError = (fetchStudentsErrorMessage: string) => {
  if (!studentsTableApi.value) return

  showError(`Failed to fetch, please refresh the page. ${fetchStudentsErrorMessage}`)
}

const onGridReady = (params: GridReadyEvent) => {
  studentsTableApi.value = params.api

  studentsStore.fetchStudents({ onError: onFetchStudentsError })
}

const onRowEditingStarted = (params: RowEditingStartedEvent) => {
  if (!rowEditDefaultData.value) {
    rowEditDefaultData.value = params.data ? { ...params.data } : null
  }

  params.api.refreshCells({
    columns: ['edit'],
    rowNodes: [params.node]
  })
}

const onCellClicked = (params: CellClickedEvent) => {
  const action = (params.event?.target as HTMLElement).dataset.action

  if (action === 'cancel') {
    params.node.setData(rowEditDefaultData.value)
    params.api.stopEditing(true)
  }
}

const onRowEditingStopped = (params: RowEditingStartedEvent<StudentsTableRowData>) => {
  const isInvalid = Object.values(params.data ?? {}).some((cell) => {
    if (typeof cell === 'number') return false

    return cell.isValidated !== true
  })

  if (isInvalid) {
    const rowIndex = params.rowIndex
    const columns = params.api.getColumns() ?? []
    const colKey = columns[0].getColId()

    if (rowIndex === null || !colKey) return

    params.api.setFocusedCell(rowIndex, colKey)
    params.api.startEditingCell({
      rowIndex,
      colKey
    })
  } else {
    params.api.refreshCells({
      rowNodes: [params.node]
    })

    rowEditDefaultData.value = null
  }
}
</script>

<style scoped lang="scss">
.students-table {
  height: 500px;
}
</style>
