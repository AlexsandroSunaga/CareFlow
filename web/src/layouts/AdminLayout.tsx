import { Layout, Menu } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import type { MenuProps } from "antd";

const { Header, Sider, Content } = Layout;

type NavItem = { key: string; label: string; path: string };

type Props = {
  title: string;
  nav: NavItem[];
};

export function AdminLayout({ title, nav }: Props) {
  const location = useLocation();
  const navigate = useNavigate();

  const selected = nav.find((n) => location.pathname.startsWith(n.path))?.path ?? nav[0]?.path;

  const items: MenuProps["items"] = nav.map((n) => ({
    key: n.path,
    label: n.label,
    onClick: () => navigate(n.path),
  }));

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={240} theme="light">
        <div style={{ padding: 16, fontWeight: 600 }}>{title}</div>
        <Menu mode="inline" selectedKeys={[selected]} items={items} />
      </Sider>
      <Layout>
        <Header style={{ background: "#fff", paddingInline: 24, fontWeight: 500 }}>Operations console</Header>
        <Content style={{ margin: 24 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
