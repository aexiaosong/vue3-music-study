import { ref } from 'vue'
import animations from 'create-keyframe-animation'

export default function useAnimation() {
  const cdWrapperRef = ref(null)

  let entering = false
  let leaving = false

  const enter = (_, done) => {
    if (leaving) afterLeave()
    entering = true
    const { x, y, scale } = getPosAndScale()
    const animation = {
      0: {
        transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
      },
      100: {
        transform: 'translate3d(0, 0, 0) scale(1)'
      }
    }
    animations.registerAnimation({
      name: 'move',
      animation,
      presets: {
        duration: 600,
        easing: 'cubic-bezier(0.45, 0, 0.55, 1)'
      }
    })
    animations.runAnimation(cdWrapperRef.value, 'move', done)
  }

  const afterEnter = () => {
    entering = false
    animations.unregisterAnimation('move')
    cdWrapperRef.value.animation = ''
  }

  const leave = (_, done) => {
    if (entering) afterEnter()
    leaving = true
    const { x, y, scale } = getPosAndScale()
    const cdWrapperEl = cdWrapperRef.value
    cdWrapperEl.style.transition = 'all 0.6s cubic-bezier(0.45, 0, 0.55, 1)'
    cdWrapperEl.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`

    const next = () => {
      cdWrapperEl.removeEventListener('transitionend', next)
      done()
    }
    cdWrapperEl.addEventListener('transitionend', next)
  }

  const afterLeave = () => {
    leaving = false
    const cdWrapperEl = cdWrapperRef.value
    cdWrapperEl.style.transition = ''
    cdWrapperEl.style.transform = ''
  }

  const getPosAndScale = () => {
    const targetWidth = 40 // 小CD的宽度
    const paddingLeft = 40 // 小CD到屏幕左边的距离
    const paddingBottom = 30 // 小CD到屏幕下边的距离
    const paddingTop = 80 // 大CD到屏幕上边的距离
    const width = window.innerWidth * 0.8 // 大CD的宽度
    const x = -(window.innerWidth / 2 - paddingLeft) // 大小CD的横向距离
    const y = window.innerHeight - paddingTop - width / 2 - paddingBottom // 大小CD的纵向距离
    const scale = targetWidth / width

    return { x, y, scale }
  }
 
  return {
    cdWrapperRef,
    enter, afterEnter,
    leave, afterLeave
  }
}