<script setup lang="ts">
type YggModes =
  | "offline2online"
  | "online2offline"
  | "online2ygg"
  | "ygg2online"

const mode = defineModel<YggModes>("mode")
const useExternal = defineModel<boolean>("useExternal")
const YggdrasilApi = defineModel<string>("YggdrasilApi")

const yggOptions = [
  {
    label: "离线 → 外置",
    value: "offline2online"
  },
  {
    label: "外置 → 离线",
    value: "online2offline"
  },
  {
    label: "正版 → 外置",
    value: "online2ygg"
  },
  {
    label: "外置 → 正版",
    value: "ygg2online"
  }
]

const officialOptions = [
  {
    label: "离线 → 正版",
    value: "offline2online"
  },
  {
    label: "正版 → 离线",
    value: "online2offline"
  }
]
</script>

<template>
  <div
    id="selector"
    class="flex flex-row sm:flex-wrap lg:flex-nowrap justify-around gap-4"
  >
    <div class="flex-none">
      <template v-if="useExternal">
        <SelectButton
          v-model="mode"
          :options="yggOptions"
          option-label="label"
          option-value="value"
          option-disabled="disabled"
          data-key="value"
          :allow-empty="false"
        ></SelectButton>
      </template>
      <template v-else>
        <SelectButton
          v-model="mode"
          :options="officialOptions"
          option-label="label"
          option-value="value"
          option-disabled="disabled"
          data-key="value"
          :allow-empty="false"
        ></SelectButton>
      </template>
    </div>

    <template v-if="useExternal">
      <FloatLabel variant="on" class="w-full">
        <IconField>
          <InputIcon class="pi pi-cloud" />
          <InputText id="YggdrasilApi" v-model="YggdrasilApi" fluid />
          <label for="YggdrasilApi">Yggdrasil API</label>
        </IconField>
      </FloatLabel>
    </template>
  </div>
</template>
