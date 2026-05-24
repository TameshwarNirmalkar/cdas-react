import { memo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  App,
  Button,
  Card,
  Col,
  Flex,
  Form,
  Input,
  Row,
  Space,
  Switch,
  Typography,
} from 'antd';
import {
  BellOutlined,
  LockOutlined,
  LogoutOutlined,
  SafetyOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  loadUserSettings,
  saveUserSettings,
  type UserSettings,
} from '../settingsStorage';

interface DashboardOutletContext {
  onLogout: () => void;
}

function SettingsPage() {
  const { onLogout } = useOutletContext<DashboardOutletContext>();
  const { message } = App.useApp();
  const [form] = Form.useForm<UserSettings>();
  const [saving, setSaving] = useState(false);
  const [passwordForm] = Form.useForm<{ currentPassword: string; newPassword: string; confirmPassword: string }>();

  const handleProfileSave = async (values: UserSettings) => {
    setSaving(true);
    try {
      saveUserSettings(values);
      message.success('Settings saved');
    } catch {
      message.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSave = async (values: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error('New passwords do not match');
      return;
    }
    if (values.newPassword.length < 8) {
      message.warning('Password must be at least 8 characters');
      return;
    }
    message.info('Password change will be available when connected to the auth API');
    passwordForm.resetFields();
  };

  return (
    <div className="min-h-full bg-[#f5f7fa] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Flex vertical gap={4}>
          <Typography.Title level={2} className="!m-0">
            Settings
          </Typography.Title>
          <Typography.Text type="secondary" className="block mb-8">
            Manage your profile, preferences, and account security.
          </Typography.Text>
        </Flex>

        <Space orientation="vertical" size="large" className="w-full">
          <Card
            title={
              <Space>
                <UserOutlined />
                <span>Profile</span>
              </Space>
            }
          >
            <Form<UserSettings>
              form={form}
              layout="vertical"
              onFinish={handleProfileSave}
              initialValues={loadUserSettings()}
              requiredMark="optional"
              size="large"
            >
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="displayName"
                    label="Display name"
                    rules={[{ required: true, message: 'Please enter your name' }]}
                  >
                    <Input placeholder="Your name" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      { required: true, message: 'Please enter your email' },
                      { type: 'email', message: 'Please enter a valid email' },
                    ]}
                  >
                    <Input placeholder="you@company.com" />
                  </Form.Item>
                </Col>
              </Row>

              <Typography.Title level={5} className="!mt-2 !mb-4">
                <BellOutlined className="mr-2" />
                Preferences
              </Typography.Title>

              <Form.Item
                name="emailNotifications"
                label="Email notifications"
                valuePropName="checked"
                extra="Receive updates when documents are approved or rejected"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="defaultParallelApproval"
                label="Default parallel approval"
                valuePropName="checked"
                extra="New workflow steps start with parallel approval enabled"
              >
                <Switch />
              </Form.Item>

              <Flex justify="end">
                <Button type="primary" htmlType="submit" loading={saving}>
                  Save changes
                </Button>
              </Flex>
            </Form>
          </Card>

          <Card
            title={
              <Space>
                <LockOutlined />
                <span>Security</span>
              </Space>
            }
          >
            <Form
              form={passwordForm}
              layout="vertical"
              onFinish={handlePasswordSave}
              size="large"
              requiredMark="optional"
            >
              <Form.Item
                name="currentPassword"
                label="Current password"
                rules={[{ required: true, message: 'Enter your current password' }]}
              >
                <Input.Password placeholder="Current password" />
              </Form.Item>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="newPassword"
                    label="New password"
                    rules={[{ required: true, message: 'Enter a new password' }]}
                  >
                    <Input.Password placeholder="At least 8 characters" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="confirmPassword"
                    label="Confirm new password"
                    rules={[{ required: true, message: 'Confirm your new password' }]}
                  >
                    <Input.Password placeholder="Re-enter new password" />
                  </Form.Item>
                </Col>
              </Row>
              <Flex justify="end">
                <Button type="primary" htmlType="submit" icon={<SafetyOutlined />}>
                  Update password
                </Button>
              </Flex>
            </Form>
          </Card>

          <Card title="Account">
            <Typography.Paragraph type="secondary">
              Sign out of CDAS on this device. You will need to sign in again to
              access your documents.
            </Typography.Paragraph>
            <Button danger icon={<LogoutOutlined />} onClick={onLogout}>
              Sign out
            </Button>
          </Card>
        </Space>
      </div>
    </div>
  );
}

export default memo(SettingsPage);
