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
import { ref, watch, onMounted } from 'vue'
import type { ITextCellEditorParams } from 'ag-grid-community'

export type ValidatedTextCellEditorProps = {
  params: ITextCellEditorParams & { validator: (stringToTest: string) => boolean }
}

const props = defineProps<ValidatedTextCellEditorProps>()
const params = props.params

const inputRef = ref<HTMLInputElement | null>(null)
const inputValue = ref<string>(params.value)
const isValid = ref(true)

watch(inputValue, () => {
  const field = params.colDef.field

  if (!field) return

  const validationResult = params.validator(inputValue.value)

  params.data[field].isValidated = validationResult
  isValid.value = validationResult
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
