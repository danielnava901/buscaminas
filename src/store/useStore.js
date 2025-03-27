import { create } from 'zustand'

const useStore = create((set) => ({
  gameOver: false,
  status: "playing",
  setStatus: (status) => set((state) => ({ status: status })),
  setGameOver: (status) => set((state) => ({ gameOver: status })),
}))

export default useStore