import { useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Flex,
  Form,
  Input,
  Typography,
} from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import type { FormProps } from 'antd';
import { apiCall } from '../services/api';

interface LoginProps {
  onLogin: () => void;
}

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginPage = ({ onLogin }: LoginProps) => {
  const [form] = Form.useForm<LoginFormValues>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFinish: FormProps<LoginFormValues>['onFinish'] = async (values) => {
    setError(null);
    setLoading(true);

    try {
      const loginRes = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify(values),
      });

      if (loginRes.token) {
        sessionStorage.setItem('token', loginRes.token);
        onLogin();
        return;
      }

      setError('Invalid email or password. Please try again.');
    } catch {
      setError('Unable to sign in. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh w-full">
      <aside
        className="relative hidden w-1/2 overflow-hidden lg:flex lg:flex-col lg:justify-between"
        aria-hidden
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#0052cc] via-[#007bff] to-[#4dabf7]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.06%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-80" />
        <Flex
          vertical
          className="relative z-10 h-full p-12 text-white"
          justify="space-between"
        >
          <Flex
            vertical
            align="center"
            justify="center"
            className="flex-1 text-center px-4"
          >
            <Typography.Title
              level={1}
              className="!m-0 !mb-10 !text-white !font-bold !text-5xl tracking-wide"
            >
              CDAS
            </Typography.Title>
            <Typography.Title
              level={2}
              className="!mb-4 !text-white !font-semibold !leading-tight max-w-lg"
            >
              Document approval, simplified
            </Typography.Title>
            <Typography.Paragraph className="!mb-0 !text-lg !text-white/85 max-w-md">
              Create workflows, assign approvers, and track documents in one place.
            </Typography.Paragraph>
          </Flex>
          <Typography.Text className="text-center text-white/60 text-sm">
            Secure access for authorized users only
          </Typography.Text>
        </Flex>
      </aside>

      <main className="flex flex-1 flex-col items-center justify-center bg-[#f5f7fa] px-4 py-10 sm:px-8">
        <div className="mb-8 text-center lg:hidden">
          <Typography.Title level={1} className="!m-0 !text-[#007bff] !text-4xl !font-bold">
            CDAS
          </Typography.Title>
          <Typography.Text type="secondary">Sign in to your account</Typography.Text>
        </div>

        <Card
          className="w-full max-w-[420px] shadow-lg border-0"
          styles={{ body: { padding: '32px 28px' } }}
        >
          <Flex vertical gap={4} className="mb-8">
            <Typography.Title level={3} className="!m-0 hidden lg:block">
              Welcome back
            </Typography.Title>
            <Typography.Text type="secondary">
              Enter your credentials to continue
            </Typography.Text>
          </Flex>

          {error && (
            <Alert
              type="error"
              title={error}
              showIcon
              closable
              onClose={() => setError(null)}
              className="!mb-6"
            />
          )}

          <Form<LoginFormValues>
            form={form}
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
            autoComplete="on"
            size="large"
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email address' },
              ]}
            >
              <Input
                prefix={<MailOutlined className="text-gray-400" />}
                placeholder="you@company.com"
                autoComplete="email"
                inputMode="email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Please enter your password' }]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </Form.Item>

            <Form.Item className="!mb-0 !mt-2">
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
              >
                Sign in
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <Typography.Text type="secondary" className="mt-8 text-center text-xs">
          Need help? Contact your system administrator.
        </Typography.Text>
      </main>
    </div>
  );
};

export default LoginPage;
