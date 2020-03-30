/* eslint-disable */
import React, { Component, Fragment } from 'react';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { Form, Input, Upload, Select, Button } from 'antd';
import { connect } from 'dva';
import imgUrl from '@/global';
import styles from './BaseView.less';
// import GeographicView from './GeographicView';
// import PhoneView from './PhoneView';
// import { getTimeDistance } from '@/utils/utils';

const FormItem = Form.Item;
const { Option } = Select;

// 头像组件 方便以后独立，增加裁剪之类的功能
const token = localStorage.getItem('token');
const id = localStorage.getItem('id');

@connect(({ user }) => ({
  user,
}))
class AvatarView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
    };
  }

  handleChange = info => {
    const { dispatch } = this.props;
    this.setState({ fileList: info.fileList });
    if (info.file.status === 'done') {
      const newAvatar = info.fileList[0].response.data;
      dispatch({
        type: 'user/avatar',
        payload: newAvatar,
      });
    }
  };

  render() {
    const { avatar } = this.props;
    const { fileList } = this.state;

    return (
      <Fragment>
        <div className={styles.avatar_title}>
          <FormattedMessage id="app.settings.basic.avatar" defaultMessage="Avatar" />
        </div>
        <div className={styles.avatar}>
          <img src={avatar} alt="avatar" />
        </div>
        <Upload
          fileList={fileList}
          action="/vcpay/sysUser/uploadUserImg"
          data={{ type: 'memberImg' }}
          onChange={this.handleChange}
          headers={{
            Authorization: token,
          }}
        >
          <div className={styles.button_view}>
            <Button icon="upload">
              <FormattedMessage
                id="app.settings.basic.change-avatar"
                defaultMessage="Change avatar"
              />
            </Button>
          </div>
        </Upload>
      </Fragment>
    );
  }
}

const validatorGeographic = (rule, value, callback) => {
  const { province, city } = value;
  if (!province.key) {
    callback('Please input your province!');
  }
  if (!city.key) {
    callback('Please input your city!');
  }
  callback();
};

@connect(({ user }) => ({
  currentUser: user.currentUser,
  avatar: user.avatar.path,
}))
@Form.create()
class BaseView extends Component {
  componentDidMount() {
    this.setBaseInfo();
  }

  setBaseInfo = () => {
    const { currentUser, form } = this.props;
    Object.keys(form.getFieldsValue()).forEach(key => {
      const obj = {};
      obj[key] = currentUser[key] || null;
      form.setFieldsValue(obj);
    });
  };

  getAvatarURL() {
    const { currentUser } = this.props;
    if (currentUser.photo) {
      return currentUser.photo;
    }
    const url = 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png';
    return url;
  }

  getViewDom = ref => {
    this.view = ref;
  };

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form, avatar } = this.props;
    form.validateFields((err, value) => {
      if (err) return;
      dispatch({
        type: 'user/update',
        payload: {
          ...value,
          encryptionId: id,
          photo: imgUrl + avatar,
        },
      });
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <div className={styles.baseView} ref={this.getViewDom}>
        <div className={styles.left}>
          <Form layout="vertical" onSubmit={this.handleSubmit} hideRequiredMark>
            <FormItem label={formatMessage({ id: 'app.settings.basic.email' })}>
              {getFieldDecorator('email', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.email-message' }, {}),
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.settings.basic.nickname' })}>
              {getFieldDecorator('realName', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.nickname-message' }, {}),
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.settings.basic.profile' })}>
              {getFieldDecorator('remark', {
                // rules: [
                //   {
                //     required: true,
                //     message: formatMessage({ id: 'app.settings.basic.profile-message' }, {}),
                //   },
                // ],
              })(
                <Input.TextArea
                  placeholder={formatMessage({ id: 'app.settings.basic.profile-placeholder' })}
                  rows={4}
                />
              )}
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.settings.basic.country' })}>
              {getFieldDecorator('country', {
                // rules: [
                //   {
                //     required: true,
                //     message: formatMessage({ id: 'app.settings.basic.country-message' }, {}),
                //   },
                // ],
              })(
                <Select style={{ maxWidth: 220 }}>
                  <Option value="China">中国</Option>
                </Select>
              )}
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.settings.basic.phone' })}>
              {getFieldDecorator('mobile', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.phone-message' }, {}),
                  },
                ],
              })(<Input />)}
            </FormItem>
            <Button type="primary" htmlType="submit">
              <FormattedMessage
                id="app.settings.basic.update"
                defaultMessage="Update Information"
              />
            </Button>
          </Form>
        </div>
        <div className={styles.right}>
          <AvatarView avatar={this.getAvatarURL()} />
        </div>
      </div>
    );
  }
}

export default BaseView;