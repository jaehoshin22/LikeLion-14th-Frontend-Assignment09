// zustand로 UI 상태만 관리 (서버 상태는 TanStack Query로 이전)
import { create } from 'zustand'

const useCatStore = create((set) => ({
  // cats, setCats 제거 → useQuery가 대신 관리

  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  selectedCat: null,
  setSelectedCat: (cat) => set({ selectedCat: cat }),
}))

export default useCatStore