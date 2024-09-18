<template>
  <AgGridVue
    class="students-table ag-theme-quartz-dark"
    :columnDefs="studentsColDefs"
    :defaultColDef="defaultStudentsColDef"
    :rowData="studentsStore.students"
    :editType="'fullRow'"
    @gridReady="onGridReady"
    @rowEditingStarted="onRowEditingStarted"
    @rowEditingStopped="onRowEditingStopped"
  />
</template>

<script setup lang="ts">
import { shallowRef } from 'vue'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'
import { AgGridVue } from 'ag-grid-vue3'
import type { GridApi, GridReadyEvent, RowEditingStartedEvent } from 'ag-grid-community'

import { useStudentsStore } from '@/stores/students'
import {
  defaultStudentsColDef,
  studentsColDefs,
  type StudentsTableRowData
} from '@/helpers/columnDefinitions'
import { useGridError } from '@/composables/useGridError'

const studentsStore = useStudentsStore()

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
  params.api.refreshCells({
    columns: ['edit'],
    rowNodes: [params.node]
  })
}

const onRowEditingStopped = (params: RowEditingStartedEvent) => {
  params.api.refreshCells({
    columns: ['edit'],
    rowNodes: [params.node]
  })
}
</script>

<style scoped lang="scss">
.students-table {
  height: 500px;
}
</style>
