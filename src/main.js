import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import '@/assets/scss/index.scss'
import lazyPlugin from 'vue3-lazy'
import loadingDirective from '@/components/base/loading/directive'

const app = createApp(App)
app.use(router)
app.directive('loading', loadingDirective)
app.use(lazyPlugin, { loading: require('@/assets/images/default.jpg') })
app.mount('#app')
