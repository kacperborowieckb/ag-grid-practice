<template>
  <button v-if="params.value?.isEditing" @click="console.log('end')">Submit</button>
  <button v-else @click="startEditing">Edit</button>
</template>

<script setup lang="ts">
import type { ICellRendererParams } from 'ag-grid-community'

type StudentsTableActionsRendererProps = {
  params: ICellRendererParams<any, { isEditing: boolean; isInvalidated: boolean }>
}

const props = defineProps<StudentsTableActionsRendererProps>()
const params = props.params

const startEditing = () => {
  const rowIndex = params.node.rowIndex
  const columns = params.api.getColumns() ?? []
  const colKey = columns[0].getColId()

  if (!rowIndex || !colKey) return

  params.api.setFocusedCell(rowIndex, colKey)
  params.api.startEditingCell({
    rowIndex,
    colKey
  })
}
</script>
