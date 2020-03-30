export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      {
        path: '/user',
        redirect: '/user/login',
      },
      {
        path: '/user/login',
        name: 'login',
        component: './User/Login',
      }, // { path: '/user/forgotpwd', name: 'forgotpwd', component: './User/ForgotPwd' },
      {
        path: '/user/register-result',
        name: 'register.result',
        component: './User/RegisterResult',
      },
      {
        component: '404',
      },
    ],
  }, // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      {
        path: '/',
        redirect: '/general',
      },
      {
        path: '/general',
        name: '首页',
        icon: 'dashboard',
        component: './General/General',
      },
      {
        path: '/authoritycontrol',
        icon: 'dashboard',
        name: '权限管理',
        routes: [
          {
            path: '/authoritycontrol/authoritycontrol',
            icon: 'dashboard',
            name: '权限管理',
            component: './AuthorityControl/AuthorityControl',
          },
          {
            path: '/authoritycontrol/usercontrol',
            icon: 'dashboard',
            name: '用户管理',
            component: './AuthorityControl/UserControl',
          },
          {
            path: '/authoritycontrol/menucontrol',
            icon: 'dashboard',
            name: '菜单管理',
            component: './AuthorityControl/MenuControl',
          },
        ],
      }, // 新路由写这里
      {
        path: '/article',
        name: '文章管理',
        icon: 'dashboard',
        authority: ['root'],
        routes: [
          // {
          //   path: '/article/articlelist',
          //   name: '文章列表',
          //   icon: 'dashboard',
          //   component:'./Article/ArticleList',
          // },
          {
            path: '/article/articleEditor',
            name: '文章',
            icon: 'dashboard',
            component: './Article/ArticleEditor', // hideInMenu: true,
          },
        ],
      },
      {
        path: '/demo',
        name: '示例页面',
        icon: 'dashboard',
        authority: ['root'],
        routes: [
          {
            name: '基础详情页',
            path: '/demo/profilebasic',
            icon: 'dashboard',
            component: './ProfileBasic', 
          },
        ],
      },
      {
        path: '/EditPassword',
        icon: 'user',
        hideInMenu: true,
        component: './Account/Settings/EditPassword',
      },
      {
        name: 'account',
        icon: 'user',
        path: '/account',
        hideInMenu:true,
        routes: [
          {
            path: '/account/settings',
            name: 'settings',
            component: './Account/Settings/Info',
            routes: [
              {
                path: '/account/settings',
                redirect: '/account/settings/base',
              },
              {
                path: '/account/settings/security',
                component: './Account/Settings/SecurityView',
              },
            ],
          },
        ],
      },

      {
        name: 'exception',
        icon: 'warning',
        path: '/exception',
        hideInMenu: true,
        routes: [
          // exception
          {
            path: '/exception/403',
            name: 'not-permission',
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            name: 'not-find',
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: 'server-error',
            component: './Exception/500',
          },
          {
            path: '/exception/trigger',
            name: 'trigger',
            component: './Exception/TriggerException',
          },
        ],
      },
     
      {
        component: '404',
      },
    ],
  },
];