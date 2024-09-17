<template>
  <button @click="startEditing">Edit</button>
</template>

<script setup lang="ts">
import type { ICellRendererParams } from 'ag-grid-community'

const props = defineProps<{ params: ICellRendererParams }>()
const params = props.params

const startEditing = () => {
  const rowIndex = params.node.rowIndex
  const colKey = params.api.getColumns() ?? []

  if (!rowIndex || !colKey[0]) return

  params.api.setFocusedCell(rowIndex, colKey[0])
  params.api.startEditingCell({
    rowIndex,
    colKey: colKey[0]
  })
}
</script>
