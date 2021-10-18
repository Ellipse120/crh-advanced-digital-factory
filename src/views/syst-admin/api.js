import request from '@/utils/request'

const baseUrl = `${process.env.VUE_APP_LOCAL_BASE_API}syst/config`

export function getSystList (params) {
  return request({
    url: `${baseUrl}`,
    method: 'get',
    params
  })
}

export function getSystItem (id) {
  return request({
    url: `${baseUrl}/${id}`,
    method: 'get'
  })
}

export function addSystItem (data) {
  return request({
    url: `${baseUrl}`,
    method: 'post',
    data
  })
}

export function modifySystItem (data) {
  return request({
    url: `${baseUrl}/${data.id}`,
    method: 'put',
    data
  })
}

export function deleteSystItem (id) {
  return request({
    url: `${baseUrl}/${id}`,
    method: 'delete'
  })
}
