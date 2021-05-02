import { useContext } from 'react'

import { RealmStoreContext } from '../../src/store/realm.store'

export default function RealmsPage() {
  const { realms } = useContext(RealmStoreContext)
  console.log(realms)

  return (
    <div className="RealmsPage">
      <h1>Realms</h1>
    </div>
  )
}
