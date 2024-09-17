<template>
  <AgGridVue
    :columnDefs="columnDefs"
    :rowData="studentsStore.students"
    @grid-ready="onGridReady"
    class="students-table ag-theme-quartz-dark"
  />
</template>

<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'
import { AgGridVue } from 'ag-grid-vue3'
import type { GridReadyEvent, GridApi } from 'ag-grid-community'

import { useStudentsStore } from '@/stores/students'
import { getStudentsColDefs, type StudentsTableRowData } from '@/helpers/columnDefinitions'
import { createGridError } from '@/utils/createGridError'

const studentsStore = useStudentsStore()

const columnDefs = ref(getStudentsColDefs())
const studentsTableApi = shallowRef<GridApi<StudentsTableRowData> | null>(null)

const onFetchStudentsError = (fetchStudentsError: string) => {
  if (!studentsTableApi.value) return

  createGridError<StudentsTableRowData>(
    studentsTableApi.value,
    `Failed to fetch, please refresh the page. ${fetchStudentsError}`
  )
}

const onGridReady = (params: GridReadyEvent) => {
  studentsTableApi.value = params.api

  studentsStore.fetchStudents({ onError: onFetchStudentsError })
}
</script>

<style scoped lang="scss">
.students-table {
  height: 500px;
}
</style>
