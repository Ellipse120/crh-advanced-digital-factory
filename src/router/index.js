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
        meta: { title: '首页' }
      },
      {
        path: 'search-list',
        name: 'SearchList',
        hidden: true,
        component: () => lazyLoadView(import('@/views/search-management/index')),
        meta: { title: '搜索详情' }
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
    meta: { title: '文件维护' },
    redirect: '/file/file-management',
    children: [
      {
        path: 'file-add',
        name: 'FileAdd',
        component: () => lazyLoadView(import('@/views/file-add/index')),
        meta: { title: '文件添加' }
      },
      {
        path: 'file-management',
        name: 'FileManagement',
        component: () => lazyLoadView(import('@/views/file-management/index')),
        meta: { title: '文件维护' }
      },
      {
        path: 'file-edit/:id',
        name: 'FileEdit',
        hidden: true,
        component: () => lazyLoadView(import('@/views/file-add/index')),
        meta: { title: '文件编辑' }
      },
      {
        path: 'file-management-info/:id',
        name: 'FileManagementInfo',
        hidden: true,
        component: () => lazyLoadView(import('@/views/file-management/info')),
        meta: { title: '文件维护详情' }
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
            meta: { title: '添加征求意见' }
          },
          {
            path: 'comment-detail/:id',
            name: 'CommentDetail',
            hidden: true,
            component: () => lazyLoadView(import('@/views/comment-detail/index')),
            meta: { title: '征求意见详情' }
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
    meta: { title: '修订计划' },
    children: [
      {
        path: 'revise-plan',
        name: 'RevisePlan',
        component: () => lazyLoadView(import('@/views/revise-plan/index')),
        meta: { title: '修订计划' }
      },
      {
        path: 'take-advice',
        name: 'TakeAdvice',
        component: () => lazyLoadView(import('@/views/take-advice/index')),
        meta: { title: '征求意见' }
      }
      // {
      //   path: 'revise-time',
      //   name: 'ReviseTime',
      //   component: () => lazyLoadView(import('@/views/form/index')),
      //   meta: { title: '修订期限' }
      // }
    ]
  },
  {
    path: '/advice',
    component: Layout,
    name: 'Advice',
    redirect: '/advice/advice-handle',
    meta: { title: '意见处理' },
    children: [
      {
        path: 'advice-handle',
        name: 'AdviceHandle',
        component: () => lazyLoadView(import('@/views/advice-handle/index')),
        meta: { title: '意见提报处理' }
      },
      {
        path: 'detail/:id?',
        name: 'AdviceDetailHandle',
        hidden: true,
        component: () => lazyLoadView(import('@/views/advice-handle/detail')),
        meta: { title: '意见提报处理详情', activeMenu: '/advice/advice-handle' },
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
        meta: { title: '意见处理汇总' }
      }
    ]
  },
  {
    path: '/regulations',
    component: Layout,
    name: 'Regulations',
    redirect: '/regulations/regulations-plan',
    meta: { title: '对规管理' },
    children: [
      {
        path: 'regulations-plan',
        name: 'RegulationsPlan',
        component: () => lazyLoadView(import('@/views/regulations-plan/index')),
        meta: { title: '对规计划' }
      },
      {
        path: 'regulations-plan-detail',
        name: 'RegulationsPlanDetail',
        hidden: true,
        component: () => lazyLoadView(import('@/views/regulations-plan/detail')),
        meta: { title: '对规计划详情', activeMenu: '/regulations/regulations-plan' },
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
        meta: { title: '问题录入' }
      },
      {
        path: 'regulations-report',
        name: 'RegulationsReport',
        component: () => lazyLoadView(import('@/views/regulations-report/index')),
        meta: { title: '对规通报' }
      },
      {
        path: 'problem-warehouse',
        name: 'ProblemWarehouse',
        component: () => lazyLoadView(import('@/views/problem-warehouse/index')),
        meta: { title: '问题库' }
      },
      {
        path: 'regulations-report-generate',
        name: 'RegulationsReportGenerate',
        component: () => lazyLoadView(import('@/views/regulations-report-generate/index')),
        meta: { title: '对规通报生成' }
      }
    ]
  },
  {
    path: '/statistics',
    component: Layout,
    name: 'Statistics',
    redirect: '/statistics/file-statistics',
    meta: { title: '统计分析' },
    children: [
      {
        path: 'file-statistics',
        name: 'FileStatistics',
        component: () => lazyLoadView(import('@/views/file-statistics/index')),
        meta: { title: '文件统计' }
      },
      {
        path: 'read-statistics',
        name: 'ReadStatistics',
        component: () => lazyLoadView(import('@/views/read-statistics/index')),
        meta: { title: '阅读统计' }
      },
      {
        path: 'advice-statistics',
        name: 'AdviceStatistics',
        component: () => lazyLoadView(import('@/views/advice-statistics/index')),
        meta: { title: '意见统计' }
      },
      {
        path: 'revise-statistics',
        name: 'ReviseStatistics',
        component: () => lazyLoadView(import('@/views/revise-statistics/index')),
        meta: { title: '修订统计' }
      }
    ]
  },
  {
    path: '/work-management',
    component: Layout,
    name: 'WorkManagement',
    redirect: '/work-management/department-work',
    meta: { title: '工作管理' },
    children: [
      {
        path: 'department-work',
        name: 'DepartmentWork',
        component: () => lazyLoadView(import('@/views/department-work/index')),
        meta: { title: '部门工作' }
      },
      {
        path: 'department-work-create',
        name: 'DepartmentWorkCreate',
        hidden: true,
        component: () => lazyLoadView(import('@/views/department-work/detail')),
        meta: { title: '部门工作-添加', activeMenu: '/work-management/department-work' },
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
        meta: { title: '部门工作-编辑', activeMenu: '/work-management/department-work' },
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
        meta: { title: '个人工作' }
      },
      {
        path: 'personal-work-create',
        name: 'PersonWorkCreate',
        hidden: true,
        component: () => lazyLoadView(import('@/views/personal-work/detail')),
        meta: { title: '个人工作-添加', activeMenu: '/work-management/personal-work' },
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
        meta: { title: '个人工作-编辑', activeMenu: '/work-management/personal-work' },
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
        meta: { title: '工作小结', activeMenu: '/work-management/personal-work' },
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
        meta: { title: '总结查看' }
      }
    ]
  },
  {
    path: '/system-management',
    component: Layout,
    name: 'SystemManagement',
    redirect: '/system-management/user-management',
    alwaysShow: true,
    meta: { title: '系统管理' },
    children: [
      {
        path: 'user-management',
        name: 'UserManagement',
        component: () => lazyLoadView(import('@/views/user-management/index')),
        meta: { title: '用户管理' }
      },
      {
        path: 'organization',
        name: 'Organization',
        component: () => lazyLoadView(import('@/views/organization/index')),
        meta: { title: '组织机构' }
      },
      {
        path: 'menu-management',
        name: 'MenuManagement',
        component: () => lazyLoadView(import('@/views/menu-management/index')),
        meta: { title: '菜单管理' }
      },
      {
        path: 'syst-admin',
        name: 'SystAdmin',
        component: () => lazyLoadView(import('@/views/syst-admin/index')),
        meta: { title: '参数配置' }
      },
      {
        path: 'dict-management',
        name: 'DictManagement',
        component: () => lazyLoadView(import('@/views/dict-management/index')),
        meta: { title: '字典管理' }
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
