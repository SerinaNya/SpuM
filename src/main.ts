import { createApp } from "vue"
import "./style.css"
import "primeicons/primeicons.css"
import App from "./App.vue"

import PrimeVue from "primevue/config"
import Preset from "./Preset.theme"
import Tooltip from "primevue/tooltip"
import ToastService from "primevue/toastservice"

createApp(App)
  .use(PrimeVue, {
    theme: {
      preset: Preset
    }
  })
  .use(ToastService)
  .directive("tooltip", Tooltip)
  .mount("#app")
