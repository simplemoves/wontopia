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

export const AccentC = ({children}: {children: ReactNode}) => {
  return (<span className='accent-c'>{children}</span>)
}

export const AccentT = ({children}: {children: ReactNode}) => {
  return (<span className='accent-t'>{children}</span>)
}

export const AccentG = ({children}: {children: ReactNode}) => {
  return (<span className='disclaimer-accent-g'>{children}</span>)
}

export const CCaption = ({children}: {children: ReactNode}) => {
  return (<span className='collection-caption'>{children}</span>)
}

export const NftCaption = ({children}: {children: ReactNode}) => {
  return (<span className='nft-caption'>{children}</span>)
}
