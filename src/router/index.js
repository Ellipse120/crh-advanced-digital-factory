import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout/index-new'

Vue.use(Router)

/**
 * Note: sub-menu only appear when route children.length >= 1
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

const pageType = {
  create: 'create',
  edit: 'edit',
  detail: 'detail'
}

/**
 * Lazy-loads view components, but with better UX. A loading view
 * will be used if the component takes a while to load, falling
 * back to a timeout view in case the page fails to load. You can
 * use this component to lazy-load a route with:
 * @param asyncView
 * @returns {Promise<{functional: boolean, render(*, {data?: *, children?: *}): *}>}
 */
function lazyLoadView (asyncView) {
  const asyncHandler = () => ({
    component: asyncView,
    loading: require('@/views/loading').default,
    delay: 4e2, // Default: 200 (milliseconds).
    error: require('@/views/error').default,
    timeout: 4e4 // Default: Infinity (milliseconds). Time before giving up trying to load the component.
  })

  return Promise.resolve({
    functional: true,
    render (h, { data, children }) {
      return h(asyncHandler, data, children)
    }
  })
}

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => lazyLoadView(import('@/views/login/index')),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => lazyLoadView(import('@/views/dashboard/index')),
        meta: { title: '??????' }
      },
      {
        path: 'search-list',
        name: 'SearchList',
        hidden: true,
        component: () => lazyLoadView(import('@/views/search-management/index')),
        meta: { title: '????????????' }
      }
    ]
  },
  {
    path: '/404',
    component: () => lazyLoadView(import('@/views/404')),
    hidden: true
  }
]

/**
 * checkPermissionRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const checkPermissionRoutes = [
  {
    path: '/file',
    component: Layout,
    name: 'File',
    meta: { title: '????????????' },
    redirect: '/file/file-management',
    children: [
      {
        path: 'file-add',
        name: 'FileAdd',
        component: () => lazyLoadView(import('@/views/file-add/index')),
        meta: { title: '????????????' }
      },
      {
        path: 'file-management',
        name: 'FileManagement',
        component: () => lazyLoadView(import('@/views/file-management/index')),
        meta: { title: '????????????' }
      },
      {
        path: 'file-edit/:id',
        name: 'FileEdit',
        hidden: true,
        component: () => lazyLoadView(import('@/views/file-add/index')),
        meta: { title: '????????????' }
      },
      {
        path: 'file-management-info/:id',
        name: 'FileManagementInfo',
        hidden: true,
        component: () => lazyLoadView(import('@/views/file-management/info')),
        meta: { title: '??????????????????' }
      },
      {
        path: 'take',
        redirect: '/Plan/take/take-advice',
        component: {
          render: (h) => h('router-view')
        },
        children: [
          {
            path: 'comment-add/:id?',
            name: 'CommentAdd',
            hidden: true,
            component: () => lazyLoadView(import('@/views/comment-add/index')),
            meta: { title: '??????????????????' }
          },
          {
            path: 'comment-detail/:id',
            name: 'CommentDetail',
            hidden: true,
            component: () => lazyLoadView(import('@/views/comment-detail/index')),
            meta: { title: '??????????????????' }
          }
        ]
      }
    ]
  },
  {
    path: '/plan',
    component: Layout,
    name: 'Plan',
    redirect: '/plan/revise-plan',
    meta: { title: '????????????' },
    children: [
      {
        path: 'revise-plan',
        name: 'RevisePlan',
        component: () => lazyLoadView(import('@/views/revise-plan/index')),
        meta: { title: '????????????' }
      },
      {
        path: 'take-advice',
        name: 'TakeAdvice',
        component: () => lazyLoadView(import('@/views/take-advice/index')),
        meta: { title: '????????????' }
      }
      // {
      //   path: 'revise-time',
      //   name: 'ReviseTime',
      //   component: () => lazyLoadView(import('@/views/form/index')),
      //   meta: { title: '????????????' }
      // }
    ]
  },
  {
    path: '/advice',
    component: Layout,
    name: 'Advice',
    redirect: '/advice/advice-handle',
    meta: { title: '????????????' },
    children: [
      {
        path: 'advice-handle',
        name: 'AdviceHandle',
        component: () => lazyLoadView(import('@/views/advice-handle/index')),
        meta: { title: '??????????????????' }
      },
      {
        path: 'detail/:id?',
        name: 'AdviceDetailHandle',
        hidden: true,
        component: () => lazyLoadView(import('@/views/advice-handle/detail')),
        meta: { title: '????????????????????????', activeMenu: '/advice/advice-handle' },
        props: (route) => {
          return {
            id: route.query.id
          }
        }
      },
      {
        path: 'advice-collect',
        name: 'AdviceCollect',
        component: () => lazyLoadView(import('@/views/advice-collect/index')),
        meta: { title: '??????????????????' }
      }
    ]
  },
  {
    path: '/regulations',
    component: Layout,
    name: 'Regulations',
    redirect: '/regulations/regulations-plan',
    meta: { title: '????????????' },
    children: [
      {
        path: 'regulations-plan',
        name: 'RegulationsPlan',
        component: () => lazyLoadView(import('@/views/regulations-plan/index')),
        meta: { title: '????????????' }
      },
      {
        path: 'regulations-plan-detail',
        name: 'RegulationsPlanDetail',
        hidden: true,
        component: () => lazyLoadView(import('@/views/regulations-plan/detail')),
        meta: { title: '??????????????????', activeMenu: '/regulations/regulations-plan' },
        props: (route) => {
          return {
            id: route.query.id
          }
        }
      },
      {
        path: 'record-problem',
        name: 'RecordProblem',
        component: () => lazyLoadView(import('@/views/record-problem/index')),
        meta: { title: '????????????' }
      },
      {
        path: 'regulations-report',
        name: 'RegulationsReport',
        component: () => lazyLoadView(import('@/views/regulations-report/index')),
        meta: { title: '????????????' }
      },
      {
        path: 'problem-warehouse',
        name: 'ProblemWarehouse',
        component: () => lazyLoadView(import('@/views/problem-warehouse/index')),
        meta: { title: '?????????' }
      },
      {
        path: 'regulations-report-generate',
        name: 'RegulationsReportGenerate',
        component: () => lazyLoadView(import('@/views/regulations-report-generate/index')),
        meta: { title: '??????????????????' }
      }
    ]
  },
  {
    path: '/statistics',
    component: Layout,
    name: 'Statistics',
    redirect: '/statistics/file-statistics',
    meta: { title: '????????????' },
    children: [
      {
        path: 'file-statistics',
        name: 'FileStatistics',
        component: () => lazyLoadView(import('@/views/file-statistics/index')),
        meta: { title: '????????????' }
      },
      {
        path: 'read-statistics',
        name: 'ReadStatistics',
        component: () => lazyLoadView(import('@/views/read-statistics/index')),
        meta: { title: '????????????' }
      },
      {
        path: 'advice-statistics',
        name: 'AdviceStatistics',
        component: () => lazyLoadView(import('@/views/advice-statistics/index')),
        meta: { title: '????????????' }
      },
      {
        path: 'revise-statistics',
        name: 'ReviseStatistics',
        component: () => lazyLoadView(import('@/views/revise-statistics/index')),
        meta: { title: '????????????' }
      }
    ]
  },
  {
    path: '/work-management',
    component: Layout,
    name: 'WorkManagement',
    redirect: '/work-management/department-work',
    meta: { title: '????????????' },
    children: [
      {
        path: 'department-work',
        name: 'DepartmentWork',
        component: () => lazyLoadView(import('@/views/department-work/index')),
        meta: { title: '????????????' }
      },
      {
        path: 'department-work-create',
        name: 'DepartmentWorkCreate',
        hidden: true,
        component: () => lazyLoadView(import('@/views/department-work/detail')),
        meta: { title: '????????????-??????', activeMenu: '/work-management/department-work' },
        props: () => {
          return {
            action: pageType.create
          }
        }
      },
      {
        path: 'department-work-edit',
        name: 'DepartmentWorkEdit',
        hidden: true,
        component: () => lazyLoadView(import('@/views/personal-work/detail')),
        meta: { title: '????????????-??????', activeMenu: '/work-management/department-work' },
        props: (route) => {
          return {
            id: route.query.id,
            action: pageType.edit
          }
        }
      },
      {
        path: 'personal-work',
        name: 'PersonalWork',
        component: () => lazyLoadView(import('@/views/personal-work/index')),
        meta: { title: '????????????' }
      },
      {
        path: 'personal-work-create',
        name: 'PersonWorkCreate',
        hidden: true,
        component: () => lazyLoadView(import('@/views/personal-work/detail')),
        meta: { title: '????????????-??????', activeMenu: '/work-management/personal-work' },
        props: () => {
          return {
            action: pageType.create
          }
        }
      },
      {
        path: 'personal-work-edit',
        name: 'PersonWorkEdit',
        hidden: true,
        component: () => lazyLoadView(import('@/views/personal-work/detail')),
        meta: { title: '????????????-??????', activeMenu: '/work-management/personal-work' },
        props: (route) => {
          return {
            id: route.query.id,
            action: pageType.edit
          }
        }
      },
      {
        path: 'brief-summary',
        name: 'BriefSummary',
        hidden: true,
        component: () => lazyLoadView(import('@/views/personal-work/brief-summary')),
        meta: { title: '????????????', activeMenu: '/work-management/personal-work' },
        props: (route) => {
          return {
            type: route.query.type
          }
        }
      },
      {
        path: 'work-content-summary',
        name: 'WorkContentSummary',
        component: () => lazyLoadView(import('@/views/work-content-summary/index')),
        meta: { title: '????????????' }
      }
    ]
  },
  {
    path: '/system-management',
    component: Layout,
    name: 'SystemManagement',
    redirect: '/system-management/user-management',
    alwaysShow: true,
    meta: { title: '????????????' },
    children: [
      {
        path: 'user-management',
        name: 'UserManagement',
        component: () => lazyLoadView(import('@/views/user-management/index')),
        meta: { title: '????????????' }
      },
      {
        path: 'organization',
        name: 'Organization',
        component: () => lazyLoadView(import('@/views/organization/index')),
        meta: { title: '????????????' }
      },
      {
        path: 'menu-management',
        name: 'MenuManagement',
        component: () => lazyLoadView(import('@/views/menu-management/index')),
        meta: { title: '????????????' }
      },
      {
        path: 'syst-admin',
        name: 'SystAdmin',
        component: () => lazyLoadView(import('@/views/syst-admin/index')),
        meta: { title: '????????????' }
      },
      {
        path: 'dict-management',
        name: 'DictManagement',
        component: () => lazyLoadView(import('@/views/dict-management/index')),
        meta: { title: '????????????' }
      },
      {
        path: 'x6-demo',
        component: {
          render: (h) => h('router-view')
        },
        meta: { title: 'antV X6 Demo' },
        children: [
          {
            path: '',
            name: 'X6',
            component: () => lazyLoadView(import('@/views/x6/index')),
            meta: { title: 'Index' }
          },
          {
            path: 'flow',
            name: 'FlowChart',
            component: () => lazyLoadView(import('@/views/x6/flow')),
            meta: { title: 'Flow Chart' }
          }
        ]
      }
    ]
  },
  // 404 page must be placed at the end
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
