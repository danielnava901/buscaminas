import { create } from 'zustand'

const useStore = create((set) => ({
  gameOver: false,
  status: "playing", //gameover, playing, win, paused, restart
  zerosClicked: 0,
  minesSeted: 0,
  setZerosClicked: (value) => set(() => ({zerosClicked: value})),
  setCorrectMinesSeted: (value) => set((state) => ({ minesSeted: value })),
  addCorrectMinesSeted: (value) => set((state) => ({ minesSeted: state.minesSeted + value })),
  setStatus: (status) => set((state) => ({ status: status })),
  setGameOver: (status) => set((state) => ({ gameOver: status })),
  setClickCel: (value) => set((state) => {
    if (value === 1) {
      return { zerosClicked: state.zerosClicked + 1 }
    } else {
      return { zerosClicked: state.zerosClicked }
    }
    return value;
  }),
}))

export default useStore