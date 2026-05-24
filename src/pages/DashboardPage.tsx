import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Avatar, Button, Drawer, Dropdown, Flex, Typography } from 'antd';
import type { MenuProps } from 'antd';
import {
  FileTextOutlined,
  LogoutOutlined,
  MenuOutlined,
  SettingOutlined,
} from '@ant-design/icons';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
    isActive
      ? 'bg-white text-[#007bff]'
      : 'text-white hover:bg-white/15 hover:text-white'
  }`;

const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium ${
    isActive ? 'bg-blue-50 text-[#007bff]' : 'text-gray-700 hover:bg-gray-50'
  }`;

export default function DashboardLayout({ onLogout }: { onLogout: () => void }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const accountMenu: MenuProps['items'] = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Sign out',
      danger: true,
      onClick: onLogout,
    },
  ];

  const closeDrawer = () => setDrawerOpen(false);

  return (
    <div className="min-h-svh flex flex-col bg-[#f5f7fa]">
      <header className="sticky top-0 z-50 bg-gradient-to-r from-[#0052cc] via-[#007bff] to-[#4dabf7] shadow-md shadow-blue-900/20">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <NavLink to="/dashboard" className="group flex shrink-0 items-center gap-3 no-underline">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 text-lg font-bold text-white ring-2 ring-white/30 backdrop-blur-sm transition group-hover:scale-105">
              C
            </div>
            <div className="hidden sm:block leading-tight">
              <Typography.Text className="!text-lg !font-bold !text-white">
                CDAS
              </Typography.Text>
              <Typography.Text className="!block !text-xs !text-white/75 tracking-wide">
                Document Approval System
              </Typography.Text>
            </div>
          </NavLink>

          <nav className="hidden md:flex items-center gap-1 rounded-full bg-white/10 p-1 ring-1 ring-white/25">
            <NavLink to="/dashboard" end className={navLinkClass}>
              <FileTextOutlined />
              Create Document
            </NavLink>
            <NavLink to="/dashboard/settings" className={navLinkClass}>
              <SettingOutlined />
              Settings
            </NavLink>
          </nav>

          <Flex align="center" gap={8}>
            <Dropdown menu={{ items: accountMenu }} placement="bottomRight" trigger={['click']}>
              <Button
                type="text"
                className="!hidden sm:!inline-flex !h-10 !items-center !gap-2 !rounded-full !px-2 !text-white hover:!bg-white/15"
              >
                <Avatar
                  size="small"
                  className="!bg-white !text-[#007bff]"
                  icon={<span className="text-xs font-semibold">U</span>}
                />
                <span className="text-sm font-medium">Account</span>
              </Button>
            </Dropdown>

            <Button
              type="text"
              icon={<LogoutOutlined />}
              onClick={onLogout}
              className="!hidden lg:!inline-flex !text-white/90 hover:!bg-white/15 hover:!text-white"
            >
              Sign out
            </Button>

            <Button
              type="text"
              icon={<MenuOutlined className="text-lg !text-white" />}
              className="!inline-flex md:!hidden hover:!bg-white/15"
              aria-label="Open menu"
              onClick={() => setDrawerOpen(true)}
            />
          </Flex>
        </div>
      </header>

      <Drawer
        title={
          <Flex align="center" gap={12}>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#0052cc] to-[#4dabf7] text-sm font-bold text-white">
              C
            </div>
            <span className="font-semibold text-[#007bff]">CDAS</span>
          </Flex>
        }
        placement="right"
        onClose={closeDrawer}
        open={drawerOpen}
        width={280}
      >
        <Flex vertical gap={4}>
          <NavLink to="/dashboard" end className={mobileNavLinkClass} onClick={closeDrawer}>
            <FileTextOutlined />
            Create Document
          </NavLink>
          <NavLink
            to="/dashboard/settings"
            className={mobileNavLinkClass}
            onClick={closeDrawer}
          >
            <SettingOutlined />
            Settings
          </NavLink>
          <Button
            danger
            type="text"
            icon={<LogoutOutlined />}
            className="!mt-4 !justify-start !px-4"
            onClick={() => {
              closeDrawer();
              onLogout();
            }}
          >
            Sign out
          </Button>
        </Flex>
      </Drawer>

      <main className="flex-1">
        <Outlet context={{ onLogout }} />
      </main>
    </div>
  );
}
