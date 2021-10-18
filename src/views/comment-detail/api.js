import request from '@/utils/request'

const baseUrl = `${process.env.VUE_APP_LOCAL_BASE_API}odoc/rfcdoc`

const getDetail = (id) => {
  return request({
    url: `${baseUrl}/${id}`,
    method: 'get'
  })
}

const addComment = (data) => {
  return request({
    url: `${baseUrl}/${data.rfcDocId}/comment`,
    method: 'post',
    data
  })
}

export {
  getDetail,
  addComment
}
