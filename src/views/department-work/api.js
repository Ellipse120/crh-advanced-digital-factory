import request from '@/utils/request'

const baseUrl = `${process.env.VUE_APP_LOCAL_BASE_API}odoc/workplan`

const getList = (params) => {
  return request({
    url: `${baseUrl}`,
    method: 'get',
    params
  })
}

const getItem = (id) => {
  return request({
    url: `${baseUrl}/${id}`,
    method: 'get'
  })
}

const addItem = (data) => {
  return request({
    url: `${baseUrl}`,
    method: 'post',
    data
  })
}

const modifyItem = (data) => {
  return request({
    url: `${baseUrl}/${data.id}`,
    method: 'put',
    data
  })
}

const deleteItem = (id) => {
  return request({
    url: `${baseUrl}/${id}`,
    method: 'delete'
  })
}

const exportData = (params) => {
  return request({
    url: `${baseUrl}/export`,
    method: 'get',
    params,
    responseType: 'arraybuffer'
  })
}

const addWorkContent = (data) => {
  return request({
    url: `${baseUrl}/${data.workPlanId}/content`,
    method: 'post',
    data
  })
}

const modifyWorkContent = (data) => {
  return request({
    url: `${baseUrl}/content/${data.id}`,
    method: 'put',
    data
  })
}

/**
 * @description 销号
 * @param data
 * @returns {Promise}
 */
const cancelWorkContent = (data) => {
  return request({
    url: `${baseUrl}/content/${data.id}/finishstatus/${data.finishStatus}`,
    method: 'put'
  })
}

/**
 * @description 加急
 * @param data
 * @returns {Promise}
 */
const urgentWorkContent = (data) => {
  return request({
    url: `${baseUrl}/content/${data.id}/emerstatus/${data.emerStatus}`,
    method: 'put'
  })
}

/**
 * @description 收回
 * @param data
 * @returns {Promise}
 */
const revokeWorkContent = (data) => {
  return request({
    url: `${baseUrl}/content/${data.id}/revoke`,
    method: 'put'
  })
}

/**
 * @description 推送 （创建人 => 责任人）
 * @param data
 * @returns {Promise}
 */
const pushWorkContent = (data) => {
  return request({
    url: `${baseUrl}/content/${data.id}/push`,
    method: 'put'
  })
}

/**
 * @description 推送回 （责任人 => 创建人）
 * @param data
 * @returns {Promise}
 */
const pushBackWorkContent = (data) => {
  return request({
    url: `${baseUrl}/content/${data.id}/pushback`,
    method: 'put'
  })
}

/**
 * @description 个人工作推送 （个人工作 => 部门）
 * @param data
 * @returns {Promise}
 */
const pushToDepartmentWorkContent = (data) => {
  return request({
    url: `${baseUrl}/content/${data.id}/pushdept`,
    method: 'put'
  })
}

/**
 * @description 生成小结
 * @param params
 * @returns {Promise}
 */
const generateWorkSummary = (params) => {
  return request({
    url: `${baseUrl}/conclusion/${params.conclusionType}/${params.periodType}/gen`,
    method: 'get',
    params: {
      workPlanIds: params.workPlanIds
    }
  })
}

/**
 * @description 保存小结
 * @param data
 * @returns {Promise}
 */
const saveWorkSummary = (data) => {
  return request({
    url: `${baseUrl}/conclusion`,
    method: 'post',
    data
  })
}

export {
  getList,
  getItem,
  addItem,
  modifyItem,
  deleteItem,
  exportData,
  addWorkContent,
  modifyWorkContent,
  cancelWorkContent,
  urgentWorkContent,
  revokeWorkContent,
  pushWorkContent,
  pushBackWorkContent,
  pushToDepartmentWorkContent,
  generateWorkSummary,
  saveWorkSummary
}
