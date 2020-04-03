// 统一请求路径前缀在libs/axios.js中修改
import { getRequest, postRequest,postRequestX } from '@/libs/axios';
import {getRequestDownload} from "../libs/axios";

export const completeProduceV2 = (orderId) => {
  return postRequest(`/orderManager/completeProduceV2/order/${orderId}`);
}

//统计数据
export const countNumberInterface = (params) => {
  return getRequest(`/static/info`, params);
}

//search fusion list
export const fusionListData = (params) => {
  return postRequestX(`/sample`, params);
}

//fusion sample info
export const querySampleInfoData = (id, params) => {
  return getRequest(`/sampleBasic/sampleId/${id}`, params);
}

//public list
export const publicListData = (params) => {
  return postRequestX(`/chimer/info`, params);
}

export const getPrivateDataList = (params) => {
  return postRequestX(`/sampleBasic/private`, params);
}

export const getPublicDataList = (params) => {
  return postRequestX(`/sampleBasic/public`, params);
}

export const getShareDataList = (params) => {
  return postRequestX(`/sampleBasic/share`, params);
}

//sample 设置为public、private
export const settingSampleStatusInfo = (params) => {
  return postRequestX('/sampleBasic/update', params);
}

//sample 回显接口
export const querySampleData = (id, params) => {
  return getRequest(`/sampleBasic/${id}`, params);
}

//sample编辑修改接口
export const saveSampleData = (params) => {
  return postRequestX('/sampleBasic/update', params);
}

//share list 读取
export const queryGroupDataList = (params) => {
  return postRequestX('/group/owner/info', params);
}

//share 保存接口
export const saveShareGroupInfo = (params) => {
  return postRequestX('/sampleBasic/share/group', params);
}

//样本详情列表展示
export const querySingleSampleList = (params) => {
  return postRequestX('/sample/sampleId/info', params);
}

//查询fusion detail
export const getSampleCountFreqNumberList = (params) => {
  return postRequestX('/static/fusion', params);
}

export const getSampleFieldDataList = (id, params) => {
  return getRequest(`/sample/${id}`, params);
}

export const getGeneAnnoList = (id, params) => {
  return getRequest(`/geneAnno/${id}`,params);
}

export const getFusionAnnoList = (id, params) => {
  return getRequest(`/fusionAnno/${id}`,params);
}

export const getChimerFieldList = (id, params) => {
  return getRequest(`/chimer/${id}`, params);
}

//group list
export const getGroupDataList = (params) => {
  return postRequestX('/group/info', params);
}

//notice list
export const getNoticeDataList = (params) => {
  return getRequest('/message/invite/info', params);
}

//add group
export const addGroupInterface = (params) => {
  return postRequestX('/group/add', params);
}

//edit view
export const queryGroupMessage = (id, params) => {
  return getRequest(`/group/info/${id}`, params);
}

//edit group
export const editGroupInterface = (params) => {
  return postRequestX('/group/update', params);
}

//delete group
export const deleteGroupInterface = (params) => {
  return postRequestX('/group/delete', params);
}

//invite group list
export const  inviteGroupList  = (params) => {
  return postRequestX('/user/invitee/info', params);
}

export const saveInviteInterface = (params) => {
  return postRequestX('/message/invite/user', params);
}

//remove user
export const queryExistGroupList  = (params) => {
  return postRequestX('/group/member', params);
}

export const removeUserInterface = (params) => {
  return postRequestX('/group/quit', params);
}

//notice accept/refuse
export const noticeInviteInterface = (params) => {
  return postRequestX('/message/invite/deal', params);
}

//feedback
export const feedbackCommitInterface = (params) => {
  return postRequestX('/feedback/add', params);
}
