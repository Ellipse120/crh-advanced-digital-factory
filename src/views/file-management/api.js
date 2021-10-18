import request from '@/utils/request'

const baseUrl = `${process.env.VUE_APP_LOCAL_BASE_API}doc/odoc-document`

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

const modifyItem = (id, data) => {
  return request({
    url: `${baseUrl}/${id}`,
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

const exportData = () => {

}

const getTreeInfoList = (id) => {
  return request({
    url: `${process.env.VUE_APP_LOCAL_BASE_API}doc/odoc-document-tree/${id}`,
    method: 'get'
  })
}

const addDocComment = (data) => {
  return request({
    url: `${process.env.VUE_APP_LOCAL_BASE_API}doc/odoc-document-comment`,
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
  getTreeInfoList,
  addDocComment
}
