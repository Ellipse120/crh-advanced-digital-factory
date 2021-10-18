import request from '@/utils/request'

const baseUrl = `${process.env.VUE_APP_LOCAL_BASE_API}odoc/workplan`

const getWorkSummary = (params) => {
  return request({
    url: `${baseUrl}/conclusion/${params.conclusionType}/${params.period}`,
    method: 'get'
  })
}

export {
  getWorkSummary
}
