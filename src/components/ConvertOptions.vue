<script setup lang="ts">
const selectedOptions = defineModel<string[]>()

defineProps<{
  options: {
    label: string
    value: string
    disabled?: boolean
  }[]
}>()

defineEmits<{
  (input: "update:modelValue", value: string[]): void
}>()
</script>

<template>
  <div>
    <MultiSelect
      id="convertOptions"
      :options="options"
      option-label="label"
      option-value="value"
      option-disabled="disabled"
      placeholder="要进行转换的范围"
      display="chip"
      fluid
      v-model="selectedOptions"
    />
  </div>
</template>

<style scoped></style>
