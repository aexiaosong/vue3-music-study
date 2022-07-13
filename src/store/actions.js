import { PLAY_MODE } from '@/assets/js/constant'
import { shuffle } from '@/assets/js/utils'

export function selectPlay({ commit }, { list, index }) {
  commit('setPlayMode', PLAY_MODE.sequence)
  commit('setSequenceList', list)
  commit('setPlayingState', true)
  commit('setFullScreen', true)
  commit('setPlaylist', list)
  commit('setCurrentIndex', index)
}

export function randomPlay({ commit }, list) {
  commit('setPlayMode', PLAY_MODE.random)
  commit('setSequenceList', list)
  commit('setPlayingState', true)
  commit('setFullScreen', true)
  commit('setPlaylist', shuffle(list))
  commit('setCurrentIndex', 0)
}

export function changePlayMode({ commit, state, getters }, mode) {
  const currentId = getters.currentSong.id
  if (mode === PLAY_MODE.random) {
    commit('setPlaylist', shuffle(state.sequenceList))
  } else {
    commit('setPlaylist', state.sequenceList)
  }
  const index = state.playlist.findIndex((song) => song.id === currentId)
  commit('setCurrentIndex', index)
  commit('setPlayMode', mode)
}

export function removeSong({ commit, state }, song) {
  const sequenceList = state.sequenceList.slice()
  const playlist = state.playlist.slice()

  const sequenceIndex = findIndex(sequenceList, song)
  const playlistIndex = findIndex(playlist, song)
  if (sequenceIndex < 0 || playlistIndex < 0) return

  sequenceList.splice(sequenceIndex, 1)
  playlist.splice(playlistIndex, 1)
  let currentIndex = state.currentIndex
  if (currentIndex > playlistIndex || currentIndex === playlist.length) {
    currentIndex--
  }
  commit('setSequenceList', sequenceList)
  commit('setPlaylist', playlist)
  commit('setCurrentIndex', currentIndex)
}

function findIndex(list, song) {
  return list.findIndex((item) => item.id === song.id)
}
