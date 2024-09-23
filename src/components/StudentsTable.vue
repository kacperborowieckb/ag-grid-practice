<template>
  <div class="students-table">
    <AgGridVue
      class="students-table__grid ag-theme-quartz-dark"
      :columnDefs="studentsColDefs"
      :defaultColDef="defaultStudentsColDef"
      :rowData="studentsStore.students"
      @gridReady="onGridReady"
    />
    <button class="students-table__button">Submit</button>
  </div>
</template>

<script setup lang="ts">
import { shallowRef } from 'vue'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'
import { AgGridVue } from 'ag-grid-vue3'
import type { GridApi, GridReadyEvent } from 'ag-grid-community'

import { useStudentsStore, type StudentWithMetadata } from '@/stores/students'
import { defaultStudentsColDef, studentsColDefs } from '@/helpers/columnDefinitions'
import { useGridError } from '@/composables/useGridError'

const studentsStore = useStudentsStore()

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
  display: flex;
  flex-direction: column;
  gap: $space-sm;

  &__grid {
    height: 500px;
  }

  &__button {
    margin-left: auto;
    padding: $p-xs $p-sm;
    cursor: pointer;
  }
}
</style>
