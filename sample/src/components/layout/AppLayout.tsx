import { Menu } from 'antd'
import Layout, { Content, Header } from 'antd/lib/layout/layout'
import Link from 'next/link'

export function AppLayout(props) {
  return (
    <Layout>
      <Header className="header">
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
          <Menu.Item key="/">
            <Link href="/">Home</Link>
          </Menu.Item>
          <Menu.Item key="/article-1">
            <Link href="/">Article 1</Link>
          </Menu.Item>
        </Menu>
      </Header>

      <Layout>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Content
            className="site-layout-background"
            style={{
              padding: 24,
              margin: 0,
              minHeight: 'calc(100vh - 90px)',
            }}>
            {props.children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}
