import { Breadcrumb, Menu } from 'antd'
import Layout, { Content, Header } from 'antd/lib/layout/layout'
import Sider from 'antd/lib/layout/Sider'
import { NodeStoreContext } from 'core/modules/nodes/node.store'
import { RealmStoreContext } from 'core/modules/realms/realm.store'
import { SchemaStoreContext } from 'core/modules/schemas/schema.store'
import Link from 'next/link'
import { useContext } from 'react'

export function AppLayout(props) {
  const { realms, currentRealm } = useContext(RealmStoreContext)
  const { schemas, currentSchemaId, currentSchema, currentField } = useContext(SchemaStoreContext)
  const { scenes, models, currentNode, pathNodes } = useContext(NodeStoreContext)

  return (
    <Layout>
      <Header className="header">
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
          <Menu.Item key="1">
            <Link href="/">Home</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link href="/auth/login">Login</Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link href="/auth/register">Register</Link>
          </Menu.Item>
        </Menu>
      </Header>

      <Layout>
        <Sider width={200} className="site-layout-background">
          {!currentRealm && (
            <Menu
              mode="inline"
              style={{ height: '100%', borderRight: 0 }}
              defaultOpenKeys={['realms']}>
              <Menu.SubMenu key="realms" title="Realms">
                {realms.map((realm) => (
                  <Menu.Item key={realm.id}>
                    <Link href={`/realm/${realm.id}`}>{realm.name}</Link>
                  </Menu.Item>
                ))}
              </Menu.SubMenu>
            </Menu>
          )}

          {currentRealm && (
            <Menu
              mode="inline"
              defaultSelectedKeys={[currentSchemaId]}
              defaultOpenKeys={['schemas', 'scenes']}
              style={{ height: '100%', borderRight: 0 }}>
              <Menu.SubMenu key="schemas" title="Schemas">
                {schemas.map((schema) => (
                  <Menu.Item key={schema.id}>
                    <Link href={`/realm/${currentRealm.id}/schema/${schema.id}`}>
                      {schema.name}
                    </Link>
                  </Menu.Item>
                ))}
              </Menu.SubMenu>

              <Menu.SubMenu key="scenes" title="Scenes">
                {scenes.map((node) => (
                  <Menu.Item key={node.id}>
                    <Link href={`/realm/${currentRealm.id}/node/${node.id}`}>{node.name}</Link>
                  </Menu.Item>
                ))}
              </Menu.SubMenu>

              <Menu.SubMenu key="models" title="Models">
                {models.map((node) => (
                  <Menu.Item key={node.id}>
                    <Link href={`/realm/${currentRealm.id}/node/${node.id}`}>{node.name}</Link>
                  </Menu.Item>
                ))}
              </Menu.SubMenu>
            </Menu>
          )}
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            {currentRealm && (
              <Breadcrumb.Item>
                <Link href={`/realm/${currentRealm.id}`}>{currentRealm.name}</Link>
              </Breadcrumb.Item>
            )}
            {currentSchema && (
              <Breadcrumb.Item>
                <Link href={`/realm/${currentRealm.id}/schema/${currentSchema.id}`}>
                  {currentSchema.name}
                </Link>
              </Breadcrumb.Item>
            )}

            {currentNode &&
              pathNodes.map((item) => (
                <Breadcrumb.Item key={item.id}>
                  <Link href={`/realm/${currentRealm.id}/node${item.uri}`}>
                    {item.label ?? '<new>'}
                  </Link>
                </Breadcrumb.Item>
              ))}
            {currentField && <Breadcrumb.Item>{currentField.name}</Breadcrumb.Item>}
          </Breadcrumb>
          <Content
            className="site-layout-background"
            style={{
              padding: 24,
              margin: 0,
              minHeight: 'calc(100vh - 150px)',
            }}>
            {props.children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}
