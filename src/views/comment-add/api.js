import request from '@/utils/request'

const baseUrl = `${process.env.VUE_APP_LOCAL_BASE_API}odoc/rfcdoc`

const addDetail = (data) => {
  return request({
    url: `${baseUrl}`,
    method: 'post',
    data
  })
}

const getDetail = (id) => {
  return request({
    url: `${baseUrl}/${id}`,
    method: 'get'
  })
}

const putDetail = (data) => {
  return request({
    url: `${baseUrl}/${data.id}`,
    method: 'put',
    data
  })
}

const deleteDetail = (id) => {
  return request({
    url: `${baseUrl}/${id}`,
    method: 'delete'
  })
}

export {
  addDetail,
  putDetail,
  deleteDetail,
  getDetail
}
