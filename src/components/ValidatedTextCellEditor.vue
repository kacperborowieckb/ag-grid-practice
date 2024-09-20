<template>
  <input
    v-model="inputValue"
    ref="inputRef"
    type="text"
    class="validated-text-cell-editor"
    :class="{ 'validated-text-cell-editor--error': !isValid }"
    @keydown.enter="onEnter"
    @keydown.esc="onEsc"
  />
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import type { ITextCellEditorParams } from 'ag-grid-community'

type ValidatedTextCellEditorProps = {
  params: ITextCellEditorParams & { validator: (stringToTest: string) => boolean }
}

const props = defineProps<ValidatedTextCellEditorProps>()
const params = props.params

const inputRef = ref<HTMLInputElement | null>(null)
const inputValue = ref<string>(params.value)

const isValid = computed(() => {
  const isValid = params.validator(inputValue.value)
  const field = params.colDef.field

  if (!field) return

  params.data[field].isValidated = isValid

  return isValid
})

const afterGuiAttached = () => {
  if (inputRef.value) {
    inputRef.value.focus()
    inputRef.value.select()
  }
}

const onEnter = () => {
  params.stopEditing()
}

const onEsc = () => {
  params.stopEditing(true)
}

const onEditingEnd = () => {
  //   if (!isInvalid) return
  //   console.log({ rowIndex: params.rowIndex, colKey: params.column.getColId() })
  //   params.api.startEditingCell({ rowIndex: params.rowIndex, colKey: params.column.getColId() })

  console.log('ds')
}

const getValue = () => inputValue.value

onMounted(() => {
  afterGuiAttached()
})
</script>

<style lang="scss">
.validated-text-cell-editor {
  display: block;
  padding: var(--ag-grid-size);
  width: 100%;
  height: 100%;
}

.validated-text-cell-editor--error {
  background-color: hsla(0, 100%, 70%, 0.3);
  color: hsla(0, 100%, 55%, 1);
}
</style>
