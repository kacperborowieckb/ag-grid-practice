<template>
  <AgGridVue
    :columnDefs="studentsColumnDefs"
    :defaultColDef="defaultStudentsColumnDef"
    :rowData="studentsStore.students"
    @gridReady="onGridReady"
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
import {
  getDefaultStudentsColDef,
  getStudentsColDefs,
  type StudentsTableRowData
} from '@/helpers/columnDefinitions'
import { createGridError } from '@/utils/createGridError'

const studentsStore = useStudentsStore()

const studentsColumnDefs = ref(getStudentsColDefs())
const defaultStudentsColumnDef = ref(getDefaultStudentsColDef())
const studentsTableApi = shallowRef<GridApi<StudentsTableRowData> | null>(null)

const onFetchStudentsError = (fetchStudentsErrorMessage: string) => {
  if (!studentsTableApi.value) return

  createGridError<StudentsTableRowData>(
    studentsTableApi.value,
    `Failed to fetch, please refresh the page. ${fetchStudentsErrorMessage}`
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
