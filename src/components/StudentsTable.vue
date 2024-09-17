<template>
  <AgGridVue
    :columnDefs="columnDefs"
    :rowData="studentsStore.students"
    class="students-table ag-theme-quartz-dark"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'
import { AgGridVue } from 'ag-grid-vue3'

import { useStudentsStore } from '@/stores/students'
import { getStudentsColDefs } from '@/helpers/columnDefinitions'

const studentsStore = useStudentsStore()

const columnDefs = ref(getStudentsColDefs())

onMounted(() => {
  studentsStore.fetchStudents()
})
</script>

<style scoped lang="scss">
.students-table {
  height: 500px;
}
</style>
