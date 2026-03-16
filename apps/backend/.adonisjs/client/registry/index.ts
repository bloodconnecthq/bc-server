/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'auth.new_account.store': {
    methods: ["POST"],
    pattern: '/api/v1/auth/signup',
    tokens: [{"old":"/api/v1/auth/signup","type":0,"val":"api","end":""},{"old":"/api/v1/auth/signup","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/signup","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['auth.new_account.store']['types'],
  },
  'auth.access_token.store': {
    methods: ["POST"],
    pattern: '/api/v1/auth/login',
    tokens: [{"old":"/api/v1/auth/login","type":0,"val":"api","end":""},{"old":"/api/v1/auth/login","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/login","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['auth.access_token.store']['types'],
  },
  'auth.access_token.destroy': {
    methods: ["POST"],
    pattern: '/api/v1/auth/logout',
    tokens: [{"old":"/api/v1/auth/logout","type":0,"val":"api","end":""},{"old":"/api/v1/auth/logout","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/logout","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['auth.access_token.destroy']['types'],
  },
  'profile.profile.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/account/profile',
    tokens: [{"old":"/api/v1/account/profile","type":0,"val":"api","end":""},{"old":"/api/v1/account/profile","type":0,"val":"v1","end":""},{"old":"/api/v1/account/profile","type":0,"val":"account","end":""},{"old":"/api/v1/account/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['profile.profile.show']['types'],
  },
  'donors.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/donors',
    tokens: [{"old":"/api/v1/donors","type":0,"val":"api","end":""},{"old":"/api/v1/donors","type":0,"val":"v1","end":""},{"old":"/api/v1/donors","type":0,"val":"donors","end":""}],
    types: placeholder as Registry['donors.index']['types'],
  },
  'donors.store': {
    methods: ["POST"],
    pattern: '/api/v1/donors',
    tokens: [{"old":"/api/v1/donors","type":0,"val":"api","end":""},{"old":"/api/v1/donors","type":0,"val":"v1","end":""},{"old":"/api/v1/donors","type":0,"val":"donors","end":""}],
    types: placeholder as Registry['donors.store']['types'],
  },
  'donors.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/donors/:id',
    tokens: [{"old":"/api/v1/donors/:id","type":0,"val":"api","end":""},{"old":"/api/v1/donors/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/donors/:id","type":0,"val":"donors","end":""},{"old":"/api/v1/donors/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['donors.show']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
