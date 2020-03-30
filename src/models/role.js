/*
 * @Descripttion: 
 * @Author: sunft
 * @Date: 2019-12-18 16:59:47
 * @LastEditTime: 2020-03-30 15:56:55
 */
import { queryRoles, saveOrUpdateRoles, removeRoles, queryNotRootRoles } from '@/services/role';
import { notification } from 'antd';

export default {
  namespace: 'role',

  state: {
    list: [{
      menuId:''
    }],
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryRoles);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    // *fetchNotRoot({ payload }, { call, put }) {
    //   const response =  yield call(queryNotRootRoles,payload);
    //   yield put({
    //     type: 'save',
    //     payload:response
    //   });
    // },
    *add({ payload }, { call, put }) {
      const response = yield call(saveOrUpdateRoles, payload);
      if (response.code === 'SUCCESS') {
        const newFetch = yield call(queryRoles, {});
        yield put({
          type: 'save',
          payload: newFetch,
        });
        notification.success({
          message: response.code,
          description: response.msg,
        });
      } else {
        notification.error({
          message: response.code,
          description: response.msg,
        });
      }
      return response;
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeRoles, payload);
      if (response.code === 'SUCCESS') {
        const newFetch = yield call(queryRoles, {});
        yield put({
          type: 'save',
          payload: newFetch,
        });
        notification.success({
          message: response.code,
          description: response.msg,
        });
      } else {
        notification.error({
          message: response.code,
          description: response.msg,
        });
      }
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(saveOrUpdateRoles, payload);
      if (response.code === 'SUCCESS') {
        const newFetch = yield call(queryRoles, {});
        yield put({
          type: 'save',
          payload: newFetch,
        });
        notification.success({
          message: response.code,
          description: response.msg,
        });
      } else {
        notification.error({
          message: response.code,
          description: response.msg,
        });
      }
      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
  },
};