<script setup lang="ts">
import { computedAsync } from "@vueuse/core"
import { nameUUIDFromString } from "../rust"
import { getMojangUUID, getYggdrasilProfileUUID } from "../mojang"
import { computed, ref, watch } from "vue"
import { createDiscreteApi } from "naive-ui"

const props = defineProps<{
  mode:
    | "offline2online"
    | "online2offline"
    | "online2ygg"
    | "ygg2online"
    | "custom"
  input: string[]
  output: Record<string, string>
  useExternal: boolean
  YggdrasilApi: string
}>()

const emit = defineEmits<{
  (input: "update:input", value: string[]): void
  (output: "update:output", value: Record<string, string>): void
}>()

type ConvertData = {
  name: string
  from: string | null
  to: string | null
}

const infoEvaluating = ref(false)
const _info = computedAsync<ConvertData[]>(
  async () => {
    let result: ConvertData[] = []
    for (let name of props.input) {
      let mojangUUID: string | null = null

      if (props.useExternal) {
        try {
          mojangUUID = await getYggdrasilProfileUUID(props.YggdrasilApi, name)
        } catch {
          /* empty */
        }
      } else {
        try {
          mojangUUID = await getMojangUUID(name)
        } catch {
          /* empty */
        }
      }

      let offlineUUID = await nameUUIDFromString("OfflinePlayer:" + name)

      result.push({
        name: name,
        from: offlineUUID,
        to: mojangUUID
      })
    }

    return result
  },
  [],
  infoEvaluating
)
const info = computed<ConvertData[]>(() => {
  if (props.mode === "offline2online") {
    return _info.value
  }

  if (props.mode === "online2offline") {
    return _info.value.map((it) => ({
      name: it.name,
      from: it.to,
      to: it.from
    }))
  }

  // custom TODO
  return []
})

const yggInfoEvaluating = ref(false)
const _yggInfo = computedAsync<ConvertData[]>(
  async () => {
    let result: ConvertData[] = []
    for (let name of props.input) {
      let onlineUUID: string | null = null
      let yggUUID: string | null = null

      try {
        onlineUUID = await getMojangUUID(name)
      } catch {
        /* empty */
      }
      try {
        yggUUID = await getYggdrasilProfileUUID(props.YggdrasilApi, name)
      } catch {
        /* empty */
      }

      result.push({
        name: name,
        from: onlineUUID,
        to: yggUUID
      })
    }

    return result
  },
  [],
  yggInfoEvaluating
)
const yggInfo = computed<ConvertData[]>(() => {
  if (props.mode === "online2ygg") {
    return _yggInfo.value
  }

  if (props.mode === "ygg2online") {
    return _yggInfo.value.map((it) => ({
      name: it.name,
      from: it.to,
      to: it.from
    }))
  }

  // custom TODO
  return []
})

function onUpdateOutput(value: ConvertData[]) {
  emit(
    "update:output",
    Object.fromEntries(
      value
        .filter((it) => it.from != null && it.to != null)
        .map((it) => [it.from, it.to])
    )
  )
}

const { loadingBar } = createDiscreteApi(["loadingBar"])

watch(infoEvaluating, () => {
  onEvaluating("info", infoEvaluating.value)
})
watch(yggInfoEvaluating, () => {
  onEvaluating("yggInfo", yggInfoEvaluating.value)
})

function onEvaluating(type: "info" | "yggInfo", newVal: boolean) {
  if (newVal) {
    loadingBar.start()
  } else {
    loadingBar.finish()
  }
}

const usedInfo = computed<ConvertData[]>(() => {
  if (props.mode === "offline2online" || props.mode === "online2offline") {
    return info.value
  }

  if (props.mode === "online2ygg" || props.mode === "ygg2online") {
    return yggInfo.value
  }

  // custom TODO
  return []
})

watch(usedInfo, (newVal) => {
  onUpdateOutput(newVal)
})
</script>

<template>
  <div id="players-checker">
    <DataTable :value="usedInfo" v-if="input.length !== 0">
      <Column field="name" header="玩家名">
      <template #body="slotProps">
        <span class="font-mono">{{ slotProps.data.name }}</span>
      </template>
      </Column>
      <Column field="from" header="当前 UUID">
      <template #body="slotProps">
        <span class="font-mono">{{ slotProps.data.from }}</span>
      </template>
      </Column>
      <Column field="to" header="目标 UUID">
      <template #body="slotProps">
        <span class="font-mono">{{ slotProps.data.to }}</span>
      </template>
      </Column>
      <Column>
        <template #body="slotProps">
          {{ slotProps.data.from !== null && slotProps.data.to !== null ? "✅" : "❌ " }}
        </template>
      </Column>
    </DataTable>
  </div>
</template>
