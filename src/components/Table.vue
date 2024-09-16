<template>
  <p v-if="studentsStore.isLoading">Loading..</p>
  <AgGridVue
    v-else-if="studentsStore.students"
    :rowData="studentsStore.students"
    :columnDefs="Object.keys(studentsStore.students[0]).map((item) => ({ field: item }))"
    class="ag-theme-quartz-dark table"
  />
  <p v-else>{{ studentsStore.error ?? 'Something wrong happened, please refresh the page' }}</p>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'
import { AgGridVue } from 'ag-grid-vue3'
import { useStudentsStore } from '@/stores/students'

const studentsStore = useStudentsStore()

onMounted(() => {
  studentsStore.fetchStudents()
})
</script>

<style scoped lang="scss">
.table {
  height: 500px;
}
</style>
