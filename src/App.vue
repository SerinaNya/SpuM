<script lang="ts" setup>
import { computed, nextTick, reactive, ref, watch } from "vue"
import ModeSelector from "./components/ModeSelector.vue"
import ErrorAlert from "./components/ErrorAlert.vue"
import Footer from "./components/Footer.vue"
import RootDirSelector from "./components/RootDirSelector.vue"
import PlayerChecker from "./components/PlayerChecker.vue"
import ConvertOptions from "./components/ConvertOptions.vue"
import { NSpace, createDiscreteApi } from "naive-ui"
import { convert, getUserCache } from "./rust"
import { computedAsync } from "@vueuse/core"
import { Config } from "./data"

import { useToast } from "primevue/usetoast"

const toast = useToast()

const mode = ref<
  "offline2online" | "online2offline" | "online2ygg" | "ygg2online"
>("offline2online")

const useExternal = ref(true)
const YggdrasilApi = ref("https://littleskin.cn/api/yggdrasil")

const convertOptions = [
  {
    label: "世界",
    value: "world"
  },
  {
    label: "插件（文本文件）",
    value: "plugin_text"
  },
  {
    label: "插件（SQLite）",
    value: "plugin_sqlite",
    disabled: true
  },
  {
    label: "插件（H2）",
    value: "plugin_h2",
    disabled: true
  },
  {
    label: "远程数据源",
    value: "remote_datasource",
    disabled: true
  }
]

const config = reactive<Config>({
  rootDir: "",
  convertOptions: ["world", "plugin_text"],
  uuids: {}
})

const rootDir = computed(() => config.rootDir)

const errors = computedAsync(async () => {
  let res: string[] = []

  if (Object.keys(config.uuids).length === 0) {
    res.push("没有可转换的玩家")
  }

  if (config.convertOptions.length === 0) {
    res.push("请选择至少一个转换选项")
  }

  if (config.rootDir === "") {
    res.push("请选择服务端根目录")
  } else {
    try {
      await getUserCache(config.rootDir)
    } catch (err) {
      res.push("在指定服务端根目录中找不到 usercache.json 文件")
      console.error(err)
    }
  }

  return res
}, [])

const warnings = computed(() => {
  let res: string[] = []

  res.push("请确保服务器完全关闭，并已对数据进行备份")

  if (config.convertOptions.includes("plugin_text")) {
    res.push("插件文本转换可能有缺漏现象")
  }

  return res
})

const input = reactive<string[]>([])

const { loadingBar } = createDiscreteApi(["loadingBar"])

const running = ref(false)

async function handleStartConvert() {
  loadingBar.start()
  running.value = true
  try {
    let result = await convert(config)
    loadingBar.finish()
    if (result.length !== 0) {
      toast.add({
        severity: "success",
        summary: "转换完成",
        detail: "位于以下位置的玩家数据转换完成：\n" + result.join("\n"),
        life: 10000
      })
    } else {
      toast.add({
        severity: "warn",
        summary: "未更改",
        detail: "转换序列已正常结束，但没有玩家数据被更改",
        life: 5000
      })
      // notification["warning"]({
      //   title: "转换完成",
      //   content: "转换序列已正常结束，但没有玩家数据更改",
      //   duration: 3 * 1000
      // })
    }
  } catch (err) {
    loadingBar.error()
    toast.add({
      severity: "error",
      summary: "在转换玩家数据时发生了一个错误",
      detail: err as string,
      life: 10000
    })
  }
  running.value = false
}

watch(
  rootDir,
  async () => {
    await onReload()
  },
  {
    deep: true
  }
)

watch(useExternal, async (newVal, oldValue) => {
  if (
    !newVal &&
    oldValue &&
    (mode.value === "online2ygg" || mode.value === "ygg2online")
  ) {
    mode.value = "offline2online"
  }
  await onReload()
})

watch(YggdrasilApi, async () => {
  await onReload()
})

async function onReload() {
  nextTick(async () => {
    input.splice(0, input.length)
    let cache = await getUserCache(rootDir.value)
    input.push(...Array.from(new Set(cache.map((it) => it.name))))
  })
}
</script>

<template>
  <div class="container">
    <Toast />
    <div class="content">
      <n-space vertical>
        <div class="flex flex-row justify-between items-center gap-4 mb-4">
          <div class="flex flex-row gap-4 items-center">
            <h1 class="font-semibold text-2xl">SpuM</h1>
            <ProgressSpinner
              v-if="running"
              style="width: 2rem; height: 2rem"
              strokeWidth="6"
              fill="transparent"
              animationDuration=".4s"
              aria-label="ProgressSpinner"
            />
          </div>
          <ToggleButton
            v-model="useExternal"
            v-tooltip.bottom="{ value: '点击切换', showDelay: 1000 }"
            onLabel="💉 外置验证"
            offLabel="💎 正版验证"
          />
        </div>
        <ModeSelector
          v-model:mode="mode"
          v-model:use-external="useExternal"
          v-model:YggdrasilApi="YggdrasilApi"
        />
        <ErrorAlert :error="errors" :warning="warnings" />
        <div class="flex flex-row sm:flex-wrap md:flex-nowrap gap-2">
          <RootDirSelector
            v-model="config.rootDir"
            class="sm:basis-full md:basis-1/2"
          />
          <div
            class="flex flex-row gap-2 sm:basis-full md:basis-1/2 items-center"
          >
            <ConvertOptions
              class="grow"
              v-model="config.convertOptions"
              :options="convertOptions"
            />
            <Button
              :label="running ? '转换中' : '开始转换'"
              :icon="running ? 'pi pi-spin pi-spinner' : 'pi pi-play-circle'"
              :disabled="errors.length !== 0 || running"
              @click="handleStartConvert"
            />
          </div>
        </div>

        <PlayerChecker
          :mode="mode"
          v-model:input="input"
          v-model:output="config.uuids"
          :use-external="useExternal"
          :-yggdrasil-api="YggdrasilApi"
        />
      </n-space>
    </div>
  </div>
  <Footer />
</template>

<style scoped>
.container {
  padding: 0 5vw;
  padding-top: 5vh;
  display: flex;
  flex-direction: column;
  text-align: center;
  min-height: 85%;
}
</style>
