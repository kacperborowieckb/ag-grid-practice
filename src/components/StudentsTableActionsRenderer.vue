<template>
  <template v-if="params.value?.isEditing">
    <div class="action-container">
      <button @click="stopEditing">Submit</button>
      <button data-action="cancel">Cancel</button>
    </div>
  </template>
  <button v-else @click="startEditing">Edit</button>
</template>

<script setup lang="ts">
import type { ICellRendererParams } from 'ag-grid-community'

type StudentsTableActionsRendererProps = {
  params: ICellRendererParams<any, { isEditing: boolean }>
}

const props = defineProps<StudentsTableActionsRendererProps>()
const params = props.params

const startEditing = () => {
  const rowIndex = params.node.rowIndex
  const columns = params.api.getColumns() ?? []
  const colKey = columns[0].getColId()

  if (!rowIndex || !colKey) return

  params.api.startEditingCell({
    rowIndex,
    colKey
  })
}

const stopEditing = () => params.api.stopEditing()
</script>
