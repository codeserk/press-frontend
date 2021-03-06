import { Button, Card, Input } from 'antd'
import { RealmStore, RealmStoreContext } from 'core/modules/realms/realm.store'
import { SchemaStore, SchemaStoreContext } from 'core/modules/schemas/schema.store'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'

export default function RealmPage() {
  const [name, setName] = useState('')

  const router = useRouter()
  const realmId = router.query.realmId
  const { schemas, createSchema } = useContext<SchemaStore>(SchemaStoreContext)
  const { currentRealm } = useContext<RealmStore>(RealmStoreContext)

  return (
    <div className="RealmPage">
      <div>RealmID: {realmId}</div>
      <div>
        {schemas.map((schema) => (
          <Card key={schema.id} title={`Schema: ${schema.name}`}>
            <Link href={`/realm/${currentRealm.id}/schema/${schema.id}`}>Link</Link>
          </Card>
        ))}
      </div>

      <h2>Create schema</h2>
      <Input value={name} onInput={(ev: any) => setName(ev.target.value)} />
      <Button onClick={() => createSchema(name, {})}>Create</Button>
    </div>
  )
}
