/**
 * 资源相关请求模块
 */

import request from '@/utils/request'

export const getResourcePages = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/resource/getResourcePages',
    data
  })
}

export const getAllResource = () => {
  return request({
    method: 'GET',
    url: '/boss/resource/getAll'
  })
}

export const allocRoleResources = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/resource/allocateRoleResources',
    data
  })
}

export const getRoleMenus = (roleId: string | number) => {
  return request({
    method: 'GET',
    url: `/boss/menu/getRoleResources?roleId=${roleId}`
  })
}

export const getRoleResources = (roleId: string | number) => {
  return request({
    method: 'GET',
    url: `boss/resource/getRoleResources?roleId=${roleId}`
  })
}

export const deleteResource = (resourceId: string | number) => {
  return request({
    method: 'DELETE',
    url: `/boss/resource/${resourceId}`
  })
}
