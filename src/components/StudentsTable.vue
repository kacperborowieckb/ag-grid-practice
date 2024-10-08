<template>
  <div class="students-table">
    <div class="students-table__actions">
      <button class="students-table__action-button" @click="addRow">Add Row</button>
      <button
        class="students-table__action-button"
        :disabled="isDeleteRowsButtonDisabled"
        @click="deleteSelectedRows"
      >
        {{ deleteRowsButtonMessage }}
      </button>
    </div>
    <AgGridVue
      class="students-table__grid ag-theme-quartz-dark"
      rowSelection="multiple"
      suppressRowClickSelection
      singleClickEdit
      :loading="studentsStore.isFetchLoading"
      :rowData="studentsStore.students"
      :columnDefs="studentsColDefs"
      :defaultColDef="defaultStudentsColDef"
      :getRowId="getRowId"
      @gridReady="onGridReady"
      @cellEditingStarted="onCellEditingStarted"
      @cellEditingStopped="onCellEditingStopped"
      @selectionChanged="onSelectionChanged"
    />
    <button 
      class="students-table__submit" 
      :disabled="isSubmitDisabled" 
      @click="updateStudents"
    >
      {{ submitButtonMessage }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, shallowRef } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import type {
  GridApi,
  GridReadyEvent,
  CellEditingStoppedEvent,
  GetRowIdParams
} from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'

import { useStudentsStore, type StudentWithMetadata } from '@/stores/students'
import { defaultStudentsColDef, studentsColDefs } from '@/helpers/columnDefinitions'
import { useGridError } from '@/composables/useGridError'
import { emptyStudent } from '@/constants'

const studentsStore = useStudentsStore()

const canSubmit = ref(false)
const someValueChanged = ref(false)
const addedRows = ref<StudentWithMetadata[]>([])
const selectedRows = ref<StudentWithMetadata[]>([])
const studentsTableApi = shallowRef<GridApi<StudentWithMetadata> | null>(null)

const isSubmitDisabled = computed(() => {
  return (
    !canSubmit.value || studentsStore.isUpdateLoading || !ensureRowsDataIsValid(addedRows.value)
  )
})

const submitButtonMessage = computed(() => (studentsStore.isUpdateLoading ? 'Loading..' : 'Submit'))

const isDeleteRowsButtonDisabled = computed(
  () => !selectedRows.value.length || studentsStore.isDeletingStudents
)

const deleteRowsButtonMessage = computed(() =>
  studentsStore.isDeletingStudents ? 'Loading..' : `Delete ${selectedRows.value.length} rows`
)

const { showError } = useGridError(studentsTableApi)

const onFetchStudentsError = (fetchStudentsErrorMessage: string) => {
  if (!studentsTableApi.value) return

  showError(`Failed to fetch, please refresh the page. ${fetchStudentsErrorMessage}`)
}

const onGridReady = (params: GridReadyEvent) => {
  studentsTableApi.value = params.api

  studentsStore.fetchStudents({ onError: onFetchStudentsError })
}

const onCellEditingStarted = () => {
  canSubmit.value = false
}

const onCellEditingStopped = (params: CellEditingStoppedEvent) => {
  if (params.valueChanged) someValueChanged.value = true

  if (someValueChanged.value) canSubmit.value = true
}

const onSelectionChanged = () => {
  selectedRows.value = studentsTableApi.value?.getSelectedRows() ?? []
}

const getRowId = (params: GetRowIdParams) => params.data.id.value

const ensureRowsDataIsValid = (rows: StudentWithMetadata[]) =>
  rows.every((student) => Object.values(student).every(({ isValidated }) => isValidated))

const updateStudents = () => {
  studentsStore.updateStudents({
    newStudents: addedRows.value,
    onError: (errorMessage: string) => alert(errorMessage),
    onSuccess: () => {
      canSubmit.value = false
      someValueChanged.value = false
      addedRows.value = []
    }
  })
}

const addRow = () => {
  studentsTableApi.value?.applyTransaction({
    add: [emptyStudent]
  })

  addedRows.value.push(emptyStudent)
}

const getSelectedStudents = (persisted: boolean) => {
  return selectedRows.value.filter((selectedStudents) => {
    const result = addedRows.value.find((addedStudent) => addedStudent.id === selectedStudents.id)

    return persisted ? !result : result
  })
}

const deleteSelectedRows = () => {
  studentsStore.deleteStudents({
    persistedStudentsToDelete: getSelectedStudents(true),
    onSuccess: () => {
      studentsTableApi.value?.applyTransaction({ remove: getSelectedStudents(false) })

      addedRows.value = addedRows.value.filter(
        (addedStudent) =>
          !selectedRows.value.find(
            (selectedStudent) => selectedStudent.id.value === addedStudent.id.value
          )
      )

      selectedRows.value = []
    },
    onError: (errorMessage: string) => alert(errorMessage)
  })
}
</script>

<style scoped lang="scss">
.students-table {
  display: flex;
  flex-direction: column;
  gap: $space-sm;

  &__actions {
    display: flex;
    gap: $space-xs;
  }

  &__action-button,
  &__submit {
    padding: $p-xs $p-sm;
    cursor: pointer;
  }

  &__grid {
    height: 500px;
  }

  &__submit {
    margin-left: auto;
  }
}
</style>
