/* eslint-disable react-hooks/refs */
'use client'
import { useRef } from 'react'
import { Provider } from 'react-redux'
import { store } from '../store/store'

export default function StoreProvider({
  children
}: {
  children: React.ReactNode
}) {
  const storeRef = useRef<typeof store | null>(null)
  if (!storeRef.current) {
    // Use the store instance from the store module
    storeRef.current = store
  }

  return <Provider store={storeRef.current}>{children}</Provider>
}