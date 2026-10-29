import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const FavoritesContext = createContext(null)
export const useFavorites = () => useContext(FavoritesContext)

export function FavoritesProvider({ children }) {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  const reload = useCallback(async () => {
    if (!supabase || !user) { setItems([]); return }
    setLoading(true)
    const { data } = await supabase.from('favorites').select('*').order('created_at', { ascending: false })
    setItems(data || [])
    setLoading(false)
  }, [user?.id])

  useEffect(() => { reload() }, [reload])

  const ids = useMemo(() => new Set(items.map((i) => i.image_id)), [items])
  const isFav = useCallback((id) => ids.has(String(id)), [ids])

  // 이미지 한 장을 즐겨찾기에 추가/삭제 (낙관적 업데이트)
  const toggle = useCallback(async (hit, ipSlug) => {
    if (!supabase || !user) return false
    const id = String(hit.id)
    if (ids.has(id)) {
      const before = items
      setItems((cur) => cur.filter((i) => i.image_id !== id))
      const { error } = await supabase.from('favorites').delete().eq('image_id', id)
      if (error) setItems(before)
      return !error
    }
    const row = { image_id: id, image_url: hit.webformatURL, large_url: hit.largeImageURL, page_url: hit.pageURL, tags: hit.tags, author: hit.user, ip_slug: ipSlug || null }
    const { data, error } = await supabase.from('favorites').insert(row).select().single()
    if (!error && data) setItems((cur) => [data, ...cur])
    return !error
  }, [ids, items, user?.id])

  const value = useMemo(() => ({ items, loading, isFav, toggle, reload }), [items, loading, isFav, toggle, reload])
  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}
