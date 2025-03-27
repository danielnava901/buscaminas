import { create } from 'zustand'

const useStore = create((set) => ({
  gameOver: false,
  status: "playing", //gameover, playing, win
  zerosClicked: 0, 
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