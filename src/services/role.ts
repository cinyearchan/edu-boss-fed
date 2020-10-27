/**
 * 角色相关请求模块
 */

import request from '@/utils/request'

// 按条件查询角色
export const getRolePages = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/role/getRolePages',
    data
  })
}

// 获取所有角色，无分页信息
export const getAllRoles = () => {
  return request({
    method: 'GET',
    url: '/boss/role/all'
  })
}

export const saveOrUpdateRole = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/role/saveOrUpdate',
    data
  })
}

export const getEditRoleInfo = (id: string | number) => {
  return request({
    method: 'GET',
    url: `/boss/role/${id}`
  })
}

export const getUserRole = (userId: string | number) => {
  return request({
    method: 'GET',
    url: `/boss/role/user/${userId}`
  })
}

export const getRolesWithUserPermission = (userId: number) => {
  return request({
    method: 'GET',
    url: '/boss/role/getRolesWithUserPermission',
    params: {
      userId
    }
  })
}

export const deleteRole = (id: number | string) => {
  return request({
    method: 'DELETE',
    url: `/boss/role/${id}`
  })
}
