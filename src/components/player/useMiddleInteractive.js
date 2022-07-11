import { ref} from 'vue'

const moveCapcity = 0.2

export default function useMiddleInteractive() {
  const middleLStyle = ref(null)
  const middleRStyle = ref(null)
  const currentDotShow = ref('cd')

  const touch = {}
  let currentView = 'cd'

  const onMiddleTouchStart = (e) => {
    touch.startX = e.touches[0].pageX
    touch.startY = e.touches[0].pageY
    touch.directionLocked = ''
  }
  const onMiddleTouchMove = (e) => {
    const dx = e.touches[0].pageX - touch.startX
    const dy = e.touches[0].pageY - touch.startY
    
    const absDx = Math.abs(dx)
    const absDy = Math.abs(dy)
    if (!touch.directionLocked) {
      touch.directionLocked = absDx >= absDy ? 'h' : 'v'
    }

    if (touch.directionLocked === 'v') return

    const left = currentView === 'cd' ? 0 : -window.innerWidth
    const offsetWidth = Math.max(-window.innerWidth, Math.min(0, left + dx))
    touch.percent = Math.abs(offsetWidth / window.innerWidth)
    if (currentView === 'cd') {
      if (touch.percent > moveCapcity) {
        currentDotShow.value = 'lyric'
      } else {
        currentDotShow.value = 'cd'
      }
    } else {
      if (touch.percent < (1 - moveCapcity)) {
        currentDotShow.value = 'cd'
      } else {
        currentDotShow.value = 'lyric'
      }
    }

    middleLStyle.value = {
      opacity: 1- touch.percent
    }
    middleRStyle.value = {
      transform: `translate3d(${offsetWidth}px, 0, 0)`
    }
  }
  const onMiddleTouchEnd = () => {
    let offsetWidth
    let opacity
    if (currentDotShow.value === 'cd') {
      currentView = 'cd'
      offsetWidth = 0
      opacity = 1
    } else {
      currentView = 'lyric'
      offsetWidth = -window.innerWidth
      opacity = 0
    }

    const duration = 300
    middleLStyle.value = {
      opacity,
      transitionDuration: `${duration}ms`
    }
    middleRStyle.value = {
      transform: `translate3d(${offsetWidth}px, 0, 0)`,
      transitionDuration: `${duration}ms`
    }
  }

  return {
    middleLStyle,
    middleRStyle,
    currentDotShow,
    onMiddleTouchStart,
    onMiddleTouchMove,
    onMiddleTouchEnd
  }
}