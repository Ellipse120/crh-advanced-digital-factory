import request from '@/utils/request'

const baseUrl = '/crew/operation/dict'

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

const importData = () => {

}

export {
  getList,
  addItem,
  modifyItem,
  deleteItem,
  importData
}
