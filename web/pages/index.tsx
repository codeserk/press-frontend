import { Connection, connectToChild } from 'penpal'
import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

export default function HomePage() {
  const $iframe = useRef<HTMLIFrameElement>()

  const [isConnected, setConnected] = useState(false)
  const [child, setChild] = useState<any>()

  async function connect() {
    const connection = connectToChild({
      iframe: $iframe.current,
      methods: {
        add(num1, num2) {
          return num1 + num2
        },
      },
    })

    const child = await connection.promise
    setChild(child)
    setConnected(true)
  }

  useEffect(() => {
    if ($iframe.current) {
      connect()
    }
  }, [$iframe.current])

  return (
    <Container>
      Is connected: {isConnected ? 'yes' : 'no'}
      <iframe title="ok" ref={$iframe} src="http://localhost:3001/" />
    </Container>
  )
}

// Styles

const Container = styled.div`
  iframe {
    width: 500px;
    height: 500px;
  }
`
