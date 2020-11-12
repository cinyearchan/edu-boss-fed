import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'
import store from '@/store'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: 'login' */ '@/views/login/index.vue')
  },
  {
    path: '/',
    redirect: '/course',
    component: Layout,
    children: [
      {
        path: '',
        name: 'home',
        component: () => import(/* webpackChunkName: 'home' */ '@/views/course/index.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/role',
        name: 'role',
        component: () => import(/* webpackChunkName: 'role' */ '@/views/role/index.vue'),
        meta: {
          requiresAuth: true,
          bread: [{
            label: '角色管理'
          }]
        }
      },
      {
        path: '/role/:roleId/alloc-menu',
        name: 'alloc-menu',
        component: () => import(/* webpackChunkName: 'allocMenu' */ '@/views/role/alloc-menu.vue'),
        props: true,
        meta: {
          requiresAuth: true,
          bread: [{
            label: '角色管理',
            name: 'role'
          }, {
            label: '角色菜单管理'
          }]
        }
      },
      {
        path: '/role/:roleId/alloc-resource',
        name: 'alloc-resource',
        component: () => import(/* webpackChunkName: 'allocResource' */ '@/views/role/alloc-resource.vue'),
        props: true,
        meta: {
          requiresAuth: true,
          bread: [{
            label: '角色管理',
            name: 'role'
          }, {
            label: '角色资源管理'
          }]
        }
      },
      {
        path: '/menu',
        name: 'menu',
        component: () => import(/* webpackChunkName: 'menu' */ '@/views/menu/index.vue'),
        meta: {
          requiresAuth: true,
          bread: [{
            label: '菜单管理'
          }]
        }
      },
      {
        path: '/menu/create',
        name: 'menu-create',
        component: () => import(/* webpackChunkName: 'menuCreateEdit' */ '@/views/menu/create.vue'),
        meta: {
          requiresAuth: true,
          bread: [{
            label: '菜单管理',
            name: 'menu'
          }, {
            label: '添加菜单'
          }]
        }
      },
      {
        path: '/menu/:id/edit',
        name: 'menu-edit',
        component: () => import(/* webpackChunkName: 'menuCreateEdit' */ '@/views/menu/edit.vue'),
        meta: {
          requiresAuth: true,
          bread: [{
            label: '菜单管理',
            name: 'menu'
          }, {
            label: '编辑菜单'
          }]
        }
      },
      {
        path: '/resource',
        name: 'resource',
        component: () => import(/* webpackChunkName: 'resource' */ '@/views/resource/index.vue'),
        meta: {
          requiresAuth: true,
          bread: [{
            label: '资源管理'
          }]
        }
      },
      {
        path: '/resourceCategory',
        name: 'resourceCategory',
        component: () => import(/* webpackChunkName: 'resourceCategory' */ '@/views/resourceCategory/index.vue'),
        meta: {
          requiresAuth: true,
          bread: [{
            label: '资源分类'
          }]
        }
      },
      {
        path: '/course',
        name: 'course',
        component: () => import(/* webpackChunkName: 'course' */ '@/views/course/index.vue'),
        meta: {
          requiresAuth: true,
          bread: [{
            label: '课程管理'
          }]
        }
      },
      {
        path: '/course/create',
        name: 'course-create',
        component: () => import(/* webpackChunkName: 'courseCreate' */ '@/views/course/create.vue'),
        meta: {
          requiresAuth: true,
          bread: [{
            label: '课程管理',
            name: 'course'
          }, {
            label: '添加课程'
          }]
        }
      },
      {
        path: '/course/:courseId/edit',
        name: 'course-edit',
        component: () => import(/* webpackChunkName: 'courseEdit' */ '@/views/course/edit.vue'),
        props: true,
        meta: {
          requiresAuth: true,
          bread: [{
            label: '课程管理',
            name: 'course'
          }, {
            label: '编辑菜单'
          }]
        }
      },
      {
        path: '/course/:courseId/section',
        name: 'course-section',
        component: () => import(/* webpackChunkName: 'courseSection' */ '@/views/course/section.vue'),
        props: true,
        meta: {
          requiresAuth: true,
          bread: [{
            label: '课程管理',
            name: 'course'
          }, {
            label: '课程结构'
          }]
        }
      },
      {
        path: '/course/:courseId/video',
        name: 'course-video',
        component: () => import(/* webpackChunkName: 'courseVideo' */ '@/views/course/video.vue'),
        props: true,
        meta: {
          requiresAuth: true,
          bread: [{
            label: '上传视频'
          }]
        }
      },
      {
        path: '/user',
        name: 'user',
        component: () => import(/* webpackChunkName: 'user' */ '@/views/user/index.vue'),
        meta: {
          requiresAuth: true,
          bread: [{
            label: '用户管理'
          }]
        }
      },
      {
        path: '/advert',
        name: 'advert',
        component: () => import(/* webpackChunkName: 'advert' */ '@/views/advert/index.vue'),
        meta: {
          requiresAuth: true,
          bread: [{
            label: '广告管理'
          }]
        }
      },
      {
        path: '/advert-space',
        name: 'advert-space',
        component: () => import(/* webpackChunkName: 'advertspace' */ '@/views/advert-space/index.vue'),
        meta: {
          requiresAuth: true,
          bread: [{
            label: '广告位管理'
          }]
        }
      }
    ]
  },
  {
    path: '*',
    name: '404',
    component: () => import(/* webpackChunkName: '404' */ '@/views/error-page/404.vue')
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.state.user) {
      next({
        name: 'login',
        query: {
          redirect: to.fullPath
        }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
