import { Breadcrumb, Menu } from 'antd'
import Layout, { Content, Header } from 'antd/lib/layout/layout'
import Sider from 'antd/lib/layout/Sider'
import Link from 'next/link'
import { useContext } from 'react'

import { RealmStoreContext } from '../../store/realm.store'
import { SchemaStoreContext } from '../../store/schema.store'

export function AppLayout(props) {
  const { realms, currentRealm } = useContext(RealmStoreContext)
  const { schemas, currentSchemaId, currentSchema, currentField } = useContext(SchemaStoreContext)

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
            <Menu mode="inline" style={{ height: '100%', borderRight: 0 }}>
              {realms.map((realm) => (
                <Menu.Item key={realm.id}>
                  <Link href={`/realm/${realm.id}`}>{realm.name}</Link>
                </Menu.Item>
              ))}
            </Menu>
          )}

          {currentRealm && (
            <Menu
              mode="inline"
              defaultSelectedKeys={[currentSchemaId]}
              style={{ height: '100%', borderRight: 0 }}>
              {schemas.map((schema) => (
                <Menu.Item key={schema.id}>
                  <Link href={`/realm/${currentRealm.id}/schema/${schema.id}`}>{schema.name}</Link>
                </Menu.Item>
              ))}
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