<script setup lang="ts">
import { getVersion, getTauriVersion } from "@tauri-apps/api/app"
import { ref } from "vue"

const appVersion = ref("0.0.0.dev")
const tauriVersion = ref("0.0.0")

getVersion().then((v) => {
  appVersion.value = v
})

getTauriVersion().then((v) => {
  tauriVersion.value = v
})
</script>

<template>
  <footer class="footer">
    <hr />
    <div class="flex flex-row flex-wrap justify-center gap-2 my-2">
      <p><strong>SpuM (Minecraft Server Player UUID Modifier)</strong></p>
      <p>SpuM {{ appVersion }} / Tauri {{ tauriVersion }}</p>
      <p>
        Licensed under
        <a href="https://www.gnu.org/licenses/agpl-3.0.en.html" target="_blank"
          >AGPLv3</a
        >
      </p>
      <p>
        &copy; 2023-2024 shaokeyibb
        <a
          class="font-mono"
          href="https://github.com/shaokeyibb/mcserver_player_uuid_modifier"
          target="_blank"
        >
          github.com/shaokeyibb/mcserver_player_uuid_modifier</a
        >
      </p>
      <p>
        &copy; 2024 SerinaNya
        <a
          class="font-mono"
          href="https://github.com/SerinaNya/SpuM"
          target="_blank"
          >github.com/SerinaNya/SpuM</a
        >
      </p>
      <p>
        <a href="https://littleskin.cn/?ref=spum.app" target="_blank">
          🎗️ LittleSkin
        </a>
      </p>
    </div>
  </footer>
</template>
