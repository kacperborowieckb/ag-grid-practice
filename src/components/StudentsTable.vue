<template>
  <AgGridVue
    class="students-table ag-theme-quartz-dark"
    :columnDefs="studentsColDefs"
    :defaultColDef="defaultStudentsColDef"
    :rowData="studentsStore.students"
    @gridReady="onGridReady"
  />
</template>

<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'
import { AgGridVue } from 'ag-grid-vue3'
import type { GridApi, GridReadyEvent } from 'ag-grid-community'

import { useStudentsStore, type StudentWithMetadata } from '@/stores/students'
import { defaultStudentsColDef, studentsColDefs } from '@/helpers/columnDefinitions'
import { useGridError } from '@/composables/useGridError'

const studentsStore = useStudentsStore()

const rowEditDefaultData = ref<StudentWithMetadata | null>(null)
const studentsTableApi = shallowRef<GridApi<StudentWithMetadata> | null>(null)

const { showError } = useGridError(studentsTableApi)

const onFetchStudentsError = (fetchStudentsErrorMessage: string) => {
  if (!studentsTableApi.value) return

  showError(`Failed to fetch, please refresh the page. ${fetchStudentsErrorMessage}`)
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
