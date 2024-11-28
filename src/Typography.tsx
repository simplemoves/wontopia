import { ReactNode } from "react"

export const TON = () => {
  return (<span className='ton'>TON</span>)
}

export const Accent = ({children}: {children: ReactNode}) => {
  return (<span className='disclaimer-accent'>{children}</span>)
}

export const AccentB = ({children}: {children: ReactNode}) => {
  return (<span className='disclaimer-accent-b'>{children}</span>)
}

export const AccentG = ({children}: {children: ReactNode}) => {
  return (<span className='disclaimer-accent-g'>{children}</span>)
}
