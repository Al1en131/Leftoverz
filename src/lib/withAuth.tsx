import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import type { ComponentType, PropsWithChildren } from 'react'

export function withAuth<P>(WrappedComponent: ComponentType<P>) {
  return function AuthComponent(props: PropsWithChildren<P>) {
    const router = useRouter()
    const [isChecking, setIsChecking] = useState(true)

    useEffect(() => {
      const token = localStorage.getItem('token')
      if (!token) {
        router.replace('/auth/login')
      } else {
        setIsChecking(false)
      }
    }, [router])

    if (isChecking) return null

    return <WrappedComponent {...props} />
  }
}
