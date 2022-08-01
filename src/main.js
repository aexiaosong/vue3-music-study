import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import '@/assets/scss/index.scss'
import lazyPlugin from 'vue3-lazy'
import loadingDirective from '@/components/base/loading/directive'
import noResultDirective from '@/components/base/no-result/directive'
import { load, saveAll } from '@/assets/js/array-local-store'
import { FAVORITE_KEY, PLAY_KEY } from '@/assets/js/constant'
import { processSongs } from '@/service/song'

const favoriteSongs = load(FAVORITE_KEY)
if (favoriteSongs.length > 0) {
  processSongs(favoriteSongs).then(songs => {
    store.commit('setFavoriteList', songs)
    saveAll(FAVORITE_KEY, songs)
  })
}

const historySongs = load(PLAY_KEY)
if (historySongs.length > 0) {
  processSongs(historySongs).then(songs => {
    store.commit('setPlayHistory', songs)
    saveAll(PLAY_KEY, songs)
  })
}

const app = createApp(App)
app.use(router)
app.use(store)
app.directive('loading', loadingDirective)
app.directive('no-result', noResultDirective)
app.use(lazyPlugin, { loading: require('@/assets/images/default.jpg') })
app.mount('#app')
