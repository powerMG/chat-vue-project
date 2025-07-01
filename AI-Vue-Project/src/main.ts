import { createApp } from 'vue'
// import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
// 如果您正在使用CDN引入，请删除下面一行。
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import router from './router';

// 引入v-md-editor组件
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/theme/style/github.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import hljs from 'highlight.js'

// import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
// import '@kangc/v-md-editor/lib/style/base-editor.css';
// import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
VMdPreview.use(githubTheme, {
  Hljs: hljs,
});
// VMdPreview.use(vuepressTheme);

const pinia=createPinia()
const app=createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(pinia)
app.use(ElementPlus)
app.use(router)
app.use(VMdPreview)
app.mount('#app')
