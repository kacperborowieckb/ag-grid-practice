<template>
  <div class="students-table">
    <AgGridVue
      class="students-table__grid ag-theme-quartz-dark"
      :loading="studentsStore.isLoading.fetchStudents"
      :rowData="studentsStore.students"
      :columnDefs="studentsColDefs"
      :defaultColDef="defaultStudentsColDef"
      @gridReady="onGridReady"
      @cellEditingStarted="onCellEditingStarted"
      @cellEditingStopped="onCellEditingStopped"
    />
    <button
      class="students-table__button"
      :disabled="isSubmitDisabled"
      @click="updateStudents"
    >
      {{ submitButtonMessage }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, shallowRef } from 'vue'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'
import { AgGridVue } from 'ag-grid-vue3'
import type { 
  GridApi, 
  GridReadyEvent,
  CellEditingStoppedEvent 
} from 'ag-grid-community'

import { useStudentsStore, type StudentWithMetadata } from '@/stores/students'
import { defaultStudentsColDef, studentsColDefs } from '@/helpers/columnDefinitions'
import { useGridError } from '@/composables/useGridError'

const studentsStore = useStudentsStore()

const canSubmit = ref(false)
const someValueChanged = ref(false)
const studentsTableApi = shallowRef<GridApi<StudentWithMetadata> | null>(null)

const isSubmitDisabled = computed(() => !canSubmit.value || studentsStore.isLoading.updateStudents)
const submitButtonMessage = computed(() => studentsStore.isLoading.updateStudents ? 'Loading..' : 'Submit')

const { showError } = useGridError(studentsTableApi)

const onGridReady = (params: GridReadyEvent) => {
  studentsTableApi.value = params.api
  
  studentsStore.fetchStudents({ onError: onFetchStudentsError })
}

const onFetchStudentsError = (fetchStudentsErrorMessage: string) => {
  if (!studentsTableApi.value) return

  showError(`Failed to fetch, please refresh the page. ${fetchStudentsErrorMessage}`)
}

const onCellEditingStarted = () => {
  canSubmit.value = false
}

const onCellEditingStopped = (params: CellEditingStoppedEvent) => {
  if (params.valueChanged) someValueChanged.value = true
  
  if (someValueChanged.value) canSubmit.value = true
}

const updateStudents = () => {
  studentsStore.updateStudents({
    onError: (errorMessage: string) => alert(errorMessage),
    onSuccess: () => {
      canSubmit.value = false
      someValueChanged.value = false
    }
  })
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
