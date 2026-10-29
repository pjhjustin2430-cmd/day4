import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)
export const useCart = () => useContext(CartContext)

const clampQty = (n) => Math.min(99, Math.max(1, Number(n) || 1))

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState('')
  const timer = useRef(null)

  const flash = useCallback((msg) => {
    setToast(msg)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setToast(''), 2400)
  }, [])

  // 장바구니 불러오기: cart_items 와 상품 정보를 함께 조회 (본인 것만 — RLS)
  const reload = useCallback(async () => {
    if (!supabase || !user) { setItems([]); return }
    setLoading(true)
    const { data, error } = await supabase
      .from('cart_items')
      .select('id, quantity, product:products(id, slug, name, price, emoji, ip_slug, stock)')
      .order('created_at', { ascending: true })
    if (!error) setItems((data || []).filter((i) => i.product))
    setLoading(false)
  }, [user?.id])

  useEffect(() => { reload() }, [reload])

  // 담기: DB 함수 add_to_cart (이미 있으면 수량 +N)
  const add = useCallback(async (product, qty = 1) => {
    const { error } = await supabase.rpc('add_to_cart', { p_product_id: product.id, p_quantity: qty })
    if (error) {
      const hint = /function|does not exist|relation/i.test(error.message) ? ' (supabase/cart.sql 을 실행했는지 확인해 주세요)' : ''
      flash(`담지 못했어요: ${error.message}${hint}`)
      return false
    }
    await reload()
    flash(`🛒 ${product.name} 을(를) 담았어요`)
    return true
  }, [reload, flash])

  const setQty = useCallback(async (item, qty) => {
    const q = clampQty(qty)
    setItems((cur) => cur.map((i) => (i.id === item.id ? { ...i, quantity: q } : i)))
    const { error } = await supabase.from('cart_items').update({ quantity: q }).eq('id', item.id)
    if (error) { flash('수량을 바꾸지 못했어요'); reload() }
  }, [reload, flash])

  const remove = useCallback(async (item) => {
    setItems((cur) => cur.filter((i) => i.id !== item.id))
    const { error } = await supabase.from('cart_items').delete().eq('id', item.id)
    if (error) { flash('삭제하지 못했어요'); reload() }
  }, [reload, flash])

  const clear = useCallback(async () => {
    setItems([])
    const { error } = await supabase.from('cart_items').delete().eq('user_id', user.id)
    if (error) { flash('비우지 못했어요'); reload() }
  }, [user?.id, reload, flash])

  const count = useMemo(() => items.reduce((s, i) => s + i.quantity, 0), [items])
  const subtotal = useMemo(() => items.reduce((s, i) => s + i.quantity * i.product.price, 0), [items])

  const value = useMemo(
    () => ({ items, loading, count, subtotal, toast, add, setQty, remove, clear, reload }),
    [items, loading, count, subtotal, toast, add, setQty, remove, clear, reload],
  )
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
