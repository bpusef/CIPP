import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery, axiosQuery } from './baseQuery'

export const appApi = createApi({
  reducerPath: 'app-api',
  baseQuery: baseQuery({ baseUrl: '/' }),
  endpoints: (builder) => ({
    loadVersions: builder.query({
      queryFn: () =>
        axiosQuery({ path: '/version_latest.txt' }).then(({ data }) =>
          axiosQuery({
            path: '/api/GetVersion',
            params: { localversion: data.replace('\r\n', '') },
          }),
        ),
    }),
    loadVersionLocal: builder.query({
      query: () => ({ path: '/version_latest.txt' }),
    }),
    loadVersionRemote: builder.query({
      query: (localVersion) => ({
        path: '/api/GetVersion',
        params: { localversion: localVersion },
      }),
    }),
    execPermissionsAccessCheck: builder.query({
      query: () => ({
        path: '/api/ExecAccessChecks',
        params: {
          Permissions: true,
        },
      }),
      transformResponse: (result) => {
        if (!result) {
          return []
        }
        if (!Array.isArray(result.Results)) {
          return [result.Results]
        }
        return result.Results
      },
    }),
    execNotificationConfig: builder.query({
      query: ({
        email,
        webhook,
        tokenUpdater,
        removeuser,
        removeStandard,
        addPolicy,
        addUser,
        AddStandardsDeploy,
        addChocoApp,
      }) => ({
        path: '/api/ExecNotificationConfig',
        params: {
          Tenants: true,
        },
        data: {
          email: email,
          webhook: webhook,
          tokenUpdater: tokenUpdater,
          removeuser: removeuser,
          removeStandard: removeStandard,
          addPolicy: addPolicy,
          addUser: addUser,
          AddStandardsDeploy: AddStandardsDeploy,
          addChocoApp: addChocoApp,
        },
        method: 'post',
      }),
      transformResponse: (response) => {
        if (!response?.Results) {
          return []
        }
        return response?.Results.map((res) =>
          res
            .replace('<br>', '')
            .split(': ')
            .reduce((pv, cv) => ({ tenantDomain: pv, result: cv })),
        )
      },
    }),
    execTenantsAccessCheck: builder.query({
      query: ({ tenantDomains }) => ({
        path: '/api/ExecAccessChecks',
        params: {
          Tenants: true,
        },
        data: {
          tenantid: tenantDomains.join(','),
        },
        method: 'post',
      }),
      transformResponse: (response) => {
        if (!response?.Results) {
          return []
        }
        return response?.Results.map((res) =>
          res
            .replace('<br>', '')
            .split(': ')
            .reduce((pv, cv) => ({ tenantDomain: pv, result: cv })),
        )
      },
    }),
    execClearCache: builder.query({
      query: () => ({
        path: '/api/ListTenants',
        params: {
          ClearCache: true,
        },
      }),
    }),
    listNotificationConfig: builder.query({
      query: () => ({
        path: '/api/listNotificationConfig',
      }),
    }),
  }),
})

export const {
  useLoadVersionLocalQuery,
  useLoadVersionRemoteQuery,
  useLoadVersionsQuery,
  useExecPermissionsAccessCheckQuery,
  useLazyExecPermissionsAccessCheckQuery,
  useExecTenantsAccessCheckQuery,
  useLazyExecTenantsAccessCheckQuery,
  useExecClearCacheQuery,
  useLazyExecClearCacheQuery,
  useLazyExecNotificationConfigQuery,
  useLazyListNotificationConfigQuery,
} = appApi