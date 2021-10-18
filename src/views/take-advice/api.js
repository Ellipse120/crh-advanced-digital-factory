import request from '@/utils/request'

const baseUrl = `${process.env.VUE_APP_LOCAL_BASE_API}odoc/rfcdoc`

const getList = (params) => {
  return request({
    url: `${baseUrl}`,
    method: 'get',
    params
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

export {
  getList,
  addItem,
  modifyItem,
  deleteItem
}
