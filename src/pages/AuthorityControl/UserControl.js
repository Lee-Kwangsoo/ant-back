import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  Modal,
  Popconfirm,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import CryptoJS from 'crypto-js';

import styles from './UserControl.less';

const FormItem = Form.Item;
const { Option } = Select;
const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, roleList } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleAdd(fieldsValue, form);
    });
  };

  return (
    <Modal
      maskClosable={false}
      destroyOnClose
      title="新建用户"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="用户名">
        {form.getFieldDecorator('loginName', {
          rules: [{ required: true, message: '请输入至多20个字符！', max: 20 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="密码">
        {form.getFieldDecorator('password', {
          rules: [{ required: true, message: '请输入至少五个字符的密码！', min: 5 }],
        })(<Input placeholder="请输入密码" type="password" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="昵称">
        {form.getFieldDecorator('realName', {
          rules: [{ required: true, message: '最多15个字符！', max: 15 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="权限">
        {form.getFieldDecorator('roleId', {
          rules: [{ required: true }],
        })(
          <Select placeholder="请选择" style={{ width: '100%' }}>
            {roleList &&
              roleList.map(item => {
                return (
                  <Option value={item.id} key={item.id}>
                    {item.description}
                  </Option>
                );
              })}
          </Select>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="手机">
        {form.getFieldDecorator('mobile', {
          rules: [{ test: /^1\d{10}$/, message: '请输入正确的手机号码！', max: 11 }],
        })(<Input placeholder="请输入手机号码" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="电话">
        {form.getFieldDecorator('phone', {
          rules: [{ message: '最多15个字符！', max: 15 }],
        })(<Input placeholder="请输入电话号码" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="邮箱">
        {form.getFieldDecorator('email', {})(<Input placeholder="请输入邮箱" />)}
      </FormItem>
    </Modal>
  );
});

@Form.create()
class UpdateForm extends PureComponent {
  static defaultProps = {
    handleUpdate: () => {},
    handleUpdateModalVisible: () => {},
    values: {},
    roleList: [],
  };

  render() {
    const {
      updateModalVisible,
      handleUpdateModalVisible,
      handleUpdate,
      values,
      form,
      roleList,
    } = this.props;
    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        if (values.encryptionId) {
          handleUpdate(fieldsValue, values.encryptionId);
        }
      });
    };
    return (
      <Modal
        maskClosable={false}
        width={640}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="编辑角色"
        visible={updateModalVisible}
        onOk={okHandle}
        onCancel={() => handleUpdateModalVisible(false, values)}
        afterClose={() => handleUpdateModalVisible()}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="用户名">
          <Input placeholder="请输入" value={values.loginName} />
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="昵称">
          {form.getFieldDecorator('realName', {
            initialValue: values.realName,
            rules: [{ required: true, message: '最多8个字符！', max: 8 }],
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="权限">
          {form.getFieldDecorator('roleId', {
            initialValue: values.role.id,
            rules: [{ required: true }],
          })(
            <Select placeholder="请选择" style={{ width: '100%' }}>
              {roleList &&
                roleList.map(item => {
                  return (
                    <Option value={item.id} key={item.id}>
                      {item.description}
                    </Option>
                  );
                })}
            </Select>
          )}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="手机">
          {form.getFieldDecorator('mobile', {
            initialValue: values.mobile,
            rules: [{ test: /^1\d{10}$/, message: '请输入正确的手机号码！', max: 11 }],
          })(<Input placeholder="请输入手机号码" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="电话">
          {form.getFieldDecorator('phone', {
            initialValue: values.phone,
            rules: [{ message: '最多15个字符！', max: 15 }],
          })(<Input placeholder="请输入电话号码" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="邮箱">
          {form.getFieldDecorator('email', {
            initialValue: values.email,
          })(<Input placeholder="请输入邮箱" />)}
        </FormItem>
      </Modal>
    );
  }
}

/* eslint react/no-multi-comp:0 */
@connect(({ user, role, loading }) => ({
  user,
  role,
  loading: loading.models.rule,
}))
@Form.create()
class UserControl extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    selectedRows: [],
    formValues: {},
    updateFormValues: {},
    currentPage: 1,
  };

  static defaultProps = {
    user: {
      list: [],
    },
    role: {
      list: [],
    },
  };

  columns = [
    {
      title: '用户名',
      dataIndex: 'loginName',
      key: 'loginName',
      render: name => <a onClick={() => this.previewItem(name)}>{name}</a>,
    },
    {
      title: '昵称',
      dataIndex: 'realName',
      key: 'realName',
    },
    {
      title: '权限',
      dataIndex: 'roleName',
      key: 'roleName',
      // filters: [
      //   {
      //     text: status[0],
      //     value: 0,
      //   },
      //   {
      //     text: status[1],
      //     value: 1,
      //   },
      // ],
      // render(val) {
      //   return <Badge status={statusMap[val]} text={status[val]} />;
      // },
    },
    {
      title: '上次登录时间',
      dataIndex: 'loginDate',
      // sorter: true,
      render: val =>
        val && (
          <div style={{ whiteSpace: 'noWrap' }}>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</div>
        ),
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
    },
    {
      title: '操作',
      render: (text, record) => (
        <div style={{ whiteSpace: 'noWrap' }}>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a>&nbsp;&nbsp;
          {record.status === '1' ? (
            <Popconfirm
              title="确定启用吗"
              onConfirm={() => this.enable(true, record, 0)}
              onCancel={() => this.cancel(true, record)}
              okText="确定"
              cancelText="取消"
            >
              <a href="#">启用</a> &nbsp;&nbsp;
            </Popconfirm>
          ) : (
            <Popconfirm
              title="确定禁用吗"
              onConfirm={() => this.enable(true, record, 1)}
              onCancel={() => this.cancel(true, record)}
              okText="确定"
              cancelText="取消"
            >
              <a href="#">禁用</a> &nbsp;&nbsp;
            </Popconfirm>
          )}
          <Popconfirm
            title="确定重置该用户的密码吗?"
            onConfirm={() => this.confirmReset(record)}
            okText="Yes"
            cancelText="No"
          >
            <a href="#">重置密码</a>
          </Popconfirm>
        </div>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    // const auth = localStorage.getItem("auth");
    // if(auth === "root"){
    dispatch({
      type: 'user/fetch',
      payload: {
        pageNo: 1,
        pageSize: 10,
      },
    });
    dispatch({
      type: 'role/fetch',
    });
    // }else{
    //   dispatch({
    //     type: 'role/fetchNotRoot',
    //     payload:{
    //       role:auth
    //     }
    //   });
    // }
  }

  confirmReset = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/resetPassword',
      payload: {
        id: record.encryptionId,
      },
    });
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    this.setState({
      currentPage: pagination.current,
    });
    const params = {
      pageNo: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
    };
    // if (sorter.field) {
    //   params.sorter = `${sorter.field}_${sorter.order}`;
    // }

    dispatch({
      type: 'user/fetch',
      payload: params,
    });
  };

  previewItem = id => {
    router.push(`/profile/basic/${id}`);
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'user/fetch',
      payload: {
        pageNo: 1,
        pageSize: 10,
      },
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    if (selectedRows.length === 0) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'user/remove',
          opType: 2,
          payload: selectedRows.map(row => row.encryptionId),
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  // 启用
  enable = (flag, record, opType) => {
    const { dispatch } = this.props;
    if (flag) {
      dispatch({
        type: 'user/remove',
        opType,
        payload: [record].map(row => row.encryptionId),
      });
    }
  };

  // 取消提示
  cancel = e => {
    // message.error('Click on No');
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        pageNo: 1,
        pageSize: 10,
      };

      this.setState({
        formValues: fieldsValue,
      });

      dispatch({
        type: 'user/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      updateFormValues: record || {},
    });
  };

  handleAdd = (fields, form) => {
    const { dispatch } = this.props;
    const EncryptPassword = this.handleEncrypt(fields.password);
    dispatch({
      type: 'user/add',
      payload: {
        loginName: fields.loginName,
        password: EncryptPassword,
        realName: fields.realName,
        roleId: fields.roleId,
        userType: fields.userType,
        phone: fields.phone,
        email: fields.email,
        mobile: fields.mobile,
      },
    }).then(res => {
      if (res.code === 'SUCCESS') {
        form.resetFields();
        this.handleModalVisible();
      }
    });
  };

  handleUpdate = (fields, encryptionId) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/update',
      payload: {
        notDetail: true,
        encryptionId,
        realName: fields.realName,
        loginName: fields.loginName,
        roleId: fields.roleId,
        phone: fields.phone,
        email: fields.email,
        mobile: fields.mobile,
      },
    });

    this.handleUpdateModalVisible();
  };

  handleEncrypt = beforePwd => {
    const secretKey = 'com.vcpay.foo.key';
    const afterEncrypt = CryptoJS.DES.encrypt(beforePwd, CryptoJS.enc.Utf8.parse(secretKey), {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    }).toString();
    return afterEncrypt;
  };

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { role } = this.props;
    const roleList = role.list;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="用户名">
              {getFieldDecorator('loginName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="权限">
              {getFieldDecorator('roleId')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  {roleList &&
                    roleList.map(item => {
                      return (
                        <Option value={item.id} key={item.id}>
                          {item.description}
                        </Option>
                      );
                    })}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      user: { list },
      role,
      loading,
    } = this.props;
    const roleList = role.list;
    const {
      selectedRows,
      modalVisible,
      updateModalVisible,
      updateFormValues,
      currentPage,
    } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );
    const pagination = {
      current: currentPage,
      pageSize: 10,
      total: list.total,
    };

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <PageHeaderWrapper title="用户管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button>批量操作</Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
            <StandardTable
              rowKey="encryptionId"
              rowClassName="textCenter"
              selectedRows={selectedRows}
              loading={loading}
              data={list.rows}
              pagination={pagination}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} roleList={roleList} />
        {updateFormValues && Object.keys(updateFormValues).length ? (
          <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={updateFormValues}
            roleList={roleList}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default UserControl;