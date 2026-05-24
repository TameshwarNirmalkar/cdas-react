import { memo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  App,
  Button,
  Card,
  Col,
  Empty,
  Flex,
  Form,
  Input,
  Row,
  Space,
  Spin,
  Switch,
  Tag,
  Typography,
} from 'antd';
import {
  DeleteOutlined,
  FileTextOutlined,
  PlusOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { createDocumentApi, getAuditLogApi } from '../services/create_document';

interface WorkflowStep {
  stepOrder: number;
  isParallel: boolean;
  approvers: string[];
}

interface CreateDocumentFormValues {
  title: string;
  content: string;
  createdBy: string;
  workflow: WorkflowStep[];
}

interface AuditLog {
  _id: string;
  title: string;
  content: string;
}

const defaultWorkflowStep = (): WorkflowStep => ({
  stepOrder: 1,
  isParallel: false,
  approvers: [''],
});

function CreateDocument() {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [form] = Form.useForm<CreateDocumentFormValues>();
  const [submitting, setSubmitting] = useState(false);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [auditLoading, setAuditLoading] = useState(true);

  useEffect(() => {
    const loadAuditLogs = async () => {
      try {
        const res = await getAuditLogApi();
        setAuditLogs(res.data ?? []);
      } catch {
        message.error('Failed to load recent activity');
      } finally {
        setAuditLoading(false);
      }
    };
    loadAuditLogs();
  }, [message]);

  const onFinish = async (values: CreateDocumentFormValues) => {
    const workflow = values.workflow.map((step, index) => ({
      ...step,
      stepOrder: index + 1,
      approvers: step.approvers.filter((a) => a.trim() !== ''),
    }));

    const hasEmptyStep = workflow.some((step) => step.approvers.length === 0);
    if (hasEmptyStep) {
      message.warning('Each workflow step needs at least one approver');
      return;
    }

    setSubmitting(true);
    try {
      const res = await createDocumentApi({
        title: values.title,
        content: values.content,
        createdBy: values.createdBy,
        workflow,
      });
      if (res.data) {
        message.success('Document created successfully');
        navigate('/dashboard', { replace: true });
      }
    } catch {
      message.error('Failed to create document. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-full bg-[#f5f7fa] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Flex vertical gap={4}>
          <Typography.Title level={2} className="!m-0">
            Create Document
          </Typography.Title>
          <Typography.Text type="secondary" className="block mb-8">
            Add document details and configure the approval workflow before
            submission.
          </Typography.Text>
        </Flex>

        <Form<CreateDocumentFormValues>
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark="optional"
          initialValues={{
            title: '',
            content: '',
            createdBy: '',
            workflow: [defaultWorkflowStep()],
          }}
          size="large"
        >
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={16}>
              <Space orientation="vertical" size="large" className="w-full">
                <Card
                  title={
                    <Space>
                      <FileTextOutlined />
                      <span>Document details</span>
                    </Space>
                  }
                >
                  <Form.Item
                    name="title"
                    label="Title"
                    rules={[
                      { required: true, message: 'Please enter a document title' },
                    ]}
                  >
                    <Input placeholder="e.g. Q1 budget approval" />
                  </Form.Item>

                  <Form.Item name="content" label="Content">
                    <Input.TextArea
                      rows={5}
                      placeholder="Describe the document purpose, scope, or notes for approvers…"
                      showCount
                      maxLength={2000}
                    />
                  </Form.Item>

                  <Form.Item
                    name="createdBy"
                    label="Created by"
                    rules={[
                      { required: true, message: 'Please enter the creator name or email' },
                    ]}
                  >
                    <Input placeholder="name@company.com" />
                  </Form.Item>
                </Card>

                <Card
                  title="Approval workflow"
                  extra={
                    <Typography.Text type="secondary" className="text-sm font-normal">
                      Define steps and assign approvers
                    </Typography.Text>
                  }
                >
                  <Form.List name="workflow">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map((field, stepIndex) => (
                          <Card
                            key={field.key}
                            type="inner"
                            className="!mb-4 last:!mb-0"
                            title={
                              <Flex align="center" gap={8}>
                                <Tag color="blue">Step {stepIndex + 1}</Tag>
                                <Form.Item
                                  noStyle
                                  name={[field.name, 'isParallel']}
                                  valuePropName="checked"
                                >
                                  <Switch
                                    checkedChildren="Parallel"
                                    unCheckedChildren="Sequential"
                                    size="small"
                                  />
                                </Form.Item>
                              </Flex>
                            }
                            extra={
                              fields.length > 1 ? (
                                <Button
                                  type="text"
                                  danger
                                  icon={<DeleteOutlined />}
                                  onClick={() => remove(field.name)}
                                >
                                  Remove step
                                </Button>
                              ) : null
                            }
                          >
                            <Form.List name={[field.name, 'approvers']}>
                              {(approverFields, { add: addApprover, remove: removeApprover }) => (
                                <>
                                  {approverFields.map((approverField) => (
                                    <Flex
                                      key={approverField.key}
                                      gap={8}
                                      align="start"
                                      className="mb-3"
                                    >
                                      <Form.Item
                                        name={approverField.name}
                                        className="!mb-0 flex-1"
                                        rules={[
                                          {
                                            required: true,
                                            message: 'Approver is required',
                                          },
                                        ]}
                                      >
                                        <Input
                                          prefix={<UserAddOutlined className="text-gray-400" />}
                                          placeholder="Approver email or user ID"
                                        />
                                      </Form.Item>
                                      {approverFields.length > 1 && (
                                        <Button
                                          type="text"
                                          danger
                                          icon={<DeleteOutlined />}
                                          aria-label="Remove approver"
                                          onClick={() => removeApprover(approverField.name)}
                                        />
                                      )}
                                    </Flex>
                                  ))}
                                  <Button
                                    type="dashed"
                                    icon={<PlusOutlined />}
                                    onClick={() => addApprover('')}
                                  >
                                    Add approver
                                  </Button>
                                </>
                              )}
                            </Form.List>
                          </Card>
                        ))}

                        <Button
                          type="dashed"
                          block
                          icon={<PlusOutlined />}
                          onClick={() =>
                            add({
                              ...defaultWorkflowStep(),
                              stepOrder: fields.length + 1,
                            })
                          }
                        >
                          Add workflow step
                        </Button>
                      </>
                    )}
                  </Form.List>
                </Card>

                <Flex justify="end" gap={12} className="pb-4">
                  <Button size="large" onClick={() => form.resetFields()}>
                    Reset
                  </Button>
                  <Button
                    type="primary"
                    size="large"
                    htmlType="submit"
                    loading={submitting}
                  >
                    Create document
                  </Button>
                </Flex>
              </Space>
            </Col>

            <Col xs={24} lg={8}>
              <Card
                title="Recent activity"
                className="lg:sticky lg:top-6"
                styles={{ body: { paddingTop: 8 } }}
              >
                {auditLoading ? (
                  <Flex justify="center" className="py-12">
                    <Spin />
                  </Flex>
                ) : auditLogs.length === 0 ? (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="No documents yet"
                  />
                ) : (
                  <Flex vertical gap={16}>
                    {auditLogs.map((item) => (
                      <div
                        key={item._id}
                        className="border-b border-[#f0f0f0] pb-4 last:border-0 last:pb-0"
                      >
                        <Typography.Text strong ellipsis className="block">
                          {item.title}
                        </Typography.Text>
                        <Typography.Paragraph
                          type="secondary"
                          className="!mb-0 !mt-1"
                          ellipsis={{ rows: 2 }}
                        >
                          {item.content || 'No description'}
                        </Typography.Paragraph>
                      </div>
                    ))}
                  </Flex>
                )}
              </Card>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
}

export default memo(CreateDocument);
