import { App, ConfigProvider } from 'antd';
import type { ThemeConfig } from 'antd';
import type { ReactNode } from 'react';

const theme: ThemeConfig = {
  token: {
    colorPrimary: '#007bff',
    borderRadius: 8,
    fontFamily:
      "system-ui, 'Segoe UI', Roboto, sans-serif",
  },
};

export default function AntdProvider({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider theme={theme}>
      <App>{children}</App>
    </ConfigProvider>
  );
}
