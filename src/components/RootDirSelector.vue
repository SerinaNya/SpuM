<script setup lang="ts">
import { InputText } from "primevue"
import { openDirDialog } from "../rust"

const rootDir = defineModel<string>()

async function onSelectRootDir() {
  let res: string = await openDirDialog()
  rootDir.value = res
}
</script>

<template>
  <FloatLabel variant="on">
    <IconField>
      <InputIcon class="pi pi-folder" />
      <InputText
        type="text"
        id="rootDirInput"
        fluid
        v-model="rootDir"
        @click="onSelectRootDir"
      />
    </IconField>
    <label for="rootDirInput">服务端根目录</label>
  </FloatLabel>
</template>
