import { api } from 'core/api/clients'
import { AuthStoreContext } from 'core/modules/auth/auth.store'
import { connectToParent } from 'penpal'
import { useContext, useEffect, useRef, useState } from 'react'

export default function HomePage() {
  const { isAuthenticated } = useContext(AuthStoreContext)

  const [isConnected, setConnected] = useState(false)
  const [parent, setParent] = useState<any>()

  async function connect() {
    const connection = connectToParent({
      // Methods child is exposing to parent.
      methods: {
        multiply(num1, num2) {
          return num1 * num2
        },
        divide(num1, num2) {
          // Return a promise if the value being
          // returned requires asynchronous processing.
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve(num1 / num2)
            }, 1000)
          })
        },
      },
    })

    const parent = await connection.promise

    console.log(await parent.add(1, 5))

    setParent(parent)
    setConnected(true)
  }

  async function loadScene() {
    const scene = await api.nodes.getScene({ realmId: '60906269352b3b1403ebfedc', slug: '/' })
    console.log(scene.data)
  }

  useEffect(() => {
    connect()
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      loadScene()
    }
  }, [isAuthenticated])

  return (
    <div>
      is connected: {isConnected ? 'yes' : 'no'}
      HOME!
      <div className="stuff-on-top">hello world!</div>
    </div>
  )
}
