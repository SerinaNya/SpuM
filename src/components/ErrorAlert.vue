<script setup lang="ts">

defineProps<{
  error: string[]
  warning: string[]
}>()
</script>

<template>
  <div class="flex my-4 flex-row gap-2 text-left">
      <Message
        severity="error"
        icon="pi pi-times-circle"
        v-if="error.length !== 0"
        class="basis-1/2 grow"
      >
        <p class="mb-2 font-bold">无法开始转换</p>
        <ul class="list-disc pl-6">
          <li v-for="err in error" :key="err">
            {{ err }}
          </li>
        </ul>
      </Message>
    <Message
      severity="info"
      icon="pi pi-info-circle"
      v-if="warning.length !== 0"
      class="basis-1/2 grow"
    >
      <p class="mb-2 font-bold">转换前必读</p>
      <ul class="list-disc pl-6">
        <li v-for="warn in warning" :key="warn">
          {{ warn }}
        </li>
      </ul>
    </Message>
  </div>
</template>

<style scoped></style>
