import { FC, ReactElement, useEffect, useState } from 'react'

interface Props {
  client?: boolean
  server?: boolean
}

export const ConditionalRender: FC<Props> = (props) => {
  const [isMounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!isMounted && props.client) {
    return null
  }

  if (isMounted && props.server) {
    return null
  }

  return props.children as ReactElement
}
