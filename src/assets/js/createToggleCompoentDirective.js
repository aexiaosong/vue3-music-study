import { createApp } from 'vue'
import { addClass, removeClass } from '@/assets/js/dom.js'

const relativeCls = 'g-relative'

/**
 * 创建需要挂载组件到页面中心的指令
 * 
 * @param Comp 需要在中心展示的组件对象
 * @returns 指令生命周期
 */
export default function createToggleComponentDirective(Comp) {
  const NAME = `toggle-${Comp.name}`

  // 组件上树
  function append(el) {
    const style = getComputedStyle(el)
    if (['absolute', 'fixed', 'relative'].indexOf(style.position) === -1) {
      addClass(el, relativeCls) // 给指令所在节点开启position定位
    }
    el.appendChild(el[NAME]._toggleInstance.$el)
  }
  // 组件移除
  function remove(el) {
    removeClass(el, relativeCls)
    el.removeChild(el[NAME]._toggleInstance.$el)
  }

  return {
    mounted(el, binding) {
      // 创建待挂载组件
      const app = createApp(Comp)
      const instance = app.mount(document.createElement('div'))
      // 保存toggle组件
      if (!el[NAME]) {
        el[NAME] = {}
      }
      el[NAME]._toggleInstance = instance
      const title = binding.arg // v-directive:[???]=""
      if (typeof title !== 'undefined') {
        instance.setTitle(title)
      }
      if (binding.value) { // v-directive:[]="???"
        append(el)
      }
    },
    
    updated(el, binding) {
      // 重置文本
      const title = binding.arg
      if (typeof title !== 'undefined') {
        el[NAME]._toggleInstance.setTitle(title)
      }
      // toggle
      if (binding.value !== binding.oldValue) {
        // 组件展示处理
        binding.value ? append(el) : remove(el)
      }
    }
  }
}
