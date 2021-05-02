import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons'
import { Breadcrumb, Menu } from 'antd'
import Layout, { Content, Header } from 'antd/lib/layout/layout'
import Sider from 'antd/lib/layout/Sider'
import SubMenu from 'antd/lib/menu/SubMenu'
import Link from 'next/link'
import { useContext } from 'react'

import { RealmStoreContext } from '../../store/realm.store'

export function AppLayout(props) {
  const { realms } = useContext(RealmStoreContext)

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
          <Menu
            mode="inline"
            defaultSelectedKeys={['608952068bf128992371e0bd']}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%', borderRight: 0 }}>
            {realms.map((realm) => (
              <Menu.Item key={realm.id}>
                <Link href={`/realm/${realm.id}`}>{realm.name}</Link>
              </Menu.Item>
            ))}
          </Menu>
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item>
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
