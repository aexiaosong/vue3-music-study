import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import '@/assets/scss/index.scss'
import lazyPlugin from 'vue3-lazy'
import loadingDirective from '@/components/base/loading/directive'
import noResultDirective from '@/components/base/no-result/directive'

const app = createApp(App)
app.use(router)
app.use(store)
app.directive('loading', loadingDirective)
app.directive('no-result', noResultDirective)
app.use(lazyPlugin, { loading: require('@/assets/images/default.jpg') })
app.mount('#app')
