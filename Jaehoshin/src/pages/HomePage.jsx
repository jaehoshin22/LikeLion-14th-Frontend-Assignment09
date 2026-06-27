import { useQuery } from '@tanstack/react-query'
import useCatStore from '../store/useCatStore'
import { getCats, searchBreeds, getCatsByBreed } from '../api/catService'
import CatCard from '../components/CatCard'
import CatModal from '../components/CatModal'

// 검색어에 따라 고양이 데이터를 가져오는 함수
const fetchCatData = async (searchQuery) => {
  if (!searchQuery) {
    return await getCats()
  }

  const breeds = await searchBreeds(searchQuery)
  if (breeds.length > 0) {
    return await getCatsByBreed(breeds[0].id)
  }
  return []
}

function HomePage() {
  const {
    searchQuery, setSearchQuery,
    selectedCat
  } = useCatStore()

  // useEffect + useState 3개 → useQuery 하나로 교체
  const { data: cats = [], isLoading, isError } = useQuery({
    queryKey: ['cats', searchQuery],   // searchQuery가 바뀌면 자동으로 재요청
    queryFn: () => fetchCatData(searchQuery),
  })

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  if (isLoading) return <p className="text-center text-gray-400 py-20">로딩 중...</p>
  if (isError) return <p className="text-center text-red-400 py-20">데이터를 불러오지 못했어요 😢</p>

  return (
    <div className="min-h-screen bg-white px-8 py-12 max-w-5xl mx-auto">
      {/* 타이틀 */}
      <div className="text-center mb-10">
        <h1
          style={{ fontFamily: 'Paperozi' }}
          className="text-4xl font-medium text-pink-400 mb-2"
        >
          🐱 Kittypidia
        </h1>
        <p className="text-sm text-gray-400">고양이 품종을 검색하고 탐색해보세요</p>
      </div>

      {/* 검색 */}
      <div className="flex items-center gap-3 border border-gray-300 rounded-2xl px-5 py-3 bg-gray-50 max-w-lg mx-auto mb-10">
        <input
          type="text"
          placeholder="품종 이름 검색 (영어)"
          value={searchQuery}
          onChange={handleSearch}
          className="flex-1 bg-transparent text-sm text-gray-500 outline-none placeholder-gray-400"
        />
      </div>

      {/* 고양이 그리드 */}
      {cats.length === 0 ? (
        <p className="text-center text-gray-300 text-sm py-20">검색 결과가 없어요 🐾</p>
      ) : (
        <div className="grid grid-cols-4 gap-4 mb-10">
          {cats.map((cat) => (
            <CatCard key={cat.id} cat={cat} />
          ))}
        </div>
      )}

      {/* 모달 */}
      {selectedCat && <CatModal />}
    </div>
  )
}

export default HomePage
