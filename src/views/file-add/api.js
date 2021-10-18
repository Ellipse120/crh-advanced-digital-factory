import request from '@/utils/request'

const baseUrl = `${process.env.VUE_APP_LOCAL_BASE_API}`

const getList = (params) => {
  return request({
    url: `${baseUrl}`,
    method: 'get',
    params
  })
}

const importData = (data) => {
  return request({
    url: `${baseUrl}file/add`,
    method: 'post',
    data
  })
}

const odocDocument = (data) => {
  return request({
    url: `${baseUrl}/doc/odoc-document`,
    method: 'post',
    data
  })
}

const putOdocDocument = (data) => {
  return request({
    url: `${baseUrl}/doc/odoc-document/${data.id}`,
    method: 'put',
    data
  })
}

const getDetail = (id) => {
  return request({
    url: `${baseUrl}/doc/odoc-document/${id}`,
    method: 'get'
  })
}

const superiorDoc = () => {
  return request({
    url: `${baseUrl}/doc/odoc-document/superior-doc`,
    method: 'get'
  })
}

const currentDeptDoc = () => {
  return request({
    url: `${baseUrl}/doc/odoc-document/current-dept-doc`,
    method: 'get'
  })
}

export {
  getList,
  importData,
  getDetail,
  odocDocument,
  putOdocDocument,
  superiorDoc,
  currentDeptDoc
}
