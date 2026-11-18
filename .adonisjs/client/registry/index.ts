/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

export type { Route, Path } from './schema.d.ts'

const placeholder: any = {}

const routes = {
  'auth.new_account.store': {
    methods: ["POST"],
    pattern: '/api/v1/auth/signup',
    tokens: [[0,"api"],[0,"v1"],[0,"auth"],[0,"signup"]],
    types: placeholder as Registry['auth.new_account.store']['types'],
  },
  'auth.access_tokens.store': {
    methods: ["POST"],
    pattern: '/api/v1/auth/login',
    tokens: [[0,"api"],[0,"v1"],[0,"auth"],[0,"login"]],
    types: placeholder as Registry['auth.access_tokens.store']['types'],
  },
  'profile.profile.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/account/profile',
    tokens: [[0,"api"],[0,"v1"],[0,"account"],[0,"profile"]],
    types: placeholder as Registry['profile.profile.show']['types'],
  },
  'profile.profile.update': {
    methods: ["PUT"],
    pattern: '/api/v1/account/profile',
    tokens: [[0,"api"],[0,"v1"],[0,"account"],[0,"profile"]],
    types: placeholder as Registry['profile.profile.update']['types'],
  },
  'profile.access_tokens.destroy': {
    methods: ["POST"],
    pattern: '/api/v1/account/logout',
    tokens: [[0,"api"],[0,"v1"],[0,"account"],[0,"logout"]],
    types: placeholder as Registry['profile.access_tokens.destroy']['types'],
  },
  'profile.artist_followers.following': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/account/following',
    tokens: [[0,"api"],[0,"v1"],[0,"account"],[0,"following"]],
    types: placeholder as Registry['profile.artist_followers.following']['types'],
  },
  'artists.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/artists',
    tokens: [[0,"api"],[0,"v1"],[0,"artists"]],
    types: placeholder as Registry['artists.index']['types'],
  },
  'artists.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/artists/:id',
    tokens: [[0,"api"],[0,"v1"],[0,"artists"],[1,"id"]],
    types: placeholder as Registry['artists.show']['types'],
  },
  'artists.store': {
    methods: ["POST"],
    pattern: '/api/v1/artists',
    tokens: [[0,"api"],[0,"v1"],[0,"artists"]],
    types: placeholder as Registry['artists.store']['types'],
  },
  'artists.sync_genres': {
    methods: ["PUT"],
    pattern: '/api/v1/artists/:id/genres',
    tokens: [[0,"api"],[0,"v1"],[0,"artists"],[1,"id"],[0,"genres"]],
    types: placeholder as Registry['artists.sync_genres']['types'],
  },
  'artist_members.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/artists/:artistId/members',
    tokens: [[0,"api"],[0,"v1"],[0,"artists"],[1,"artistId"],[0,"members"]],
    types: placeholder as Registry['artist_members.index']['types'],
  },
  'artist_members.store': {
    methods: ["POST"],
    pattern: '/api/v1/artists/:artistId/members',
    tokens: [[0,"api"],[0,"v1"],[0,"artists"],[1,"artistId"],[0,"members"]],
    types: placeholder as Registry['artist_members.store']['types'],
  },
  'artist_members.update': {
    methods: ["PUT"],
    pattern: '/api/v1/artists/:artistId/members/:memberId',
    tokens: [[0,"api"],[0,"v1"],[0,"artists"],[1,"artistId"],[0,"members"],[1,"memberId"]],
    types: placeholder as Registry['artist_members.update']['types'],
  },
  'artist_members.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/artists/:artistId/members/:memberId',
    tokens: [[0,"api"],[0,"v1"],[0,"artists"],[1,"artistId"],[0,"members"],[1,"memberId"]],
    types: placeholder as Registry['artist_members.destroy']['types'],
  },
  'artist_followers.follow': {
    methods: ["POST"],
    pattern: '/api/v1/artists/:artistId/follow',
    tokens: [[0,"api"],[0,"v1"],[0,"artists"],[1,"artistId"],[0,"follow"]],
    types: placeholder as Registry['artist_followers.follow']['types'],
  },
  'artist_followers.unfollow': {
    methods: ["DELETE"],
    pattern: '/api/v1/artists/:artistId/follow',
    tokens: [[0,"api"],[0,"v1"],[0,"artists"],[1,"artistId"],[0,"follow"]],
    types: placeholder as Registry['artist_followers.unfollow']['types'],
  },
  'artist_followers.artist_followers': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/artists/:artistId/followers',
    tokens: [[0,"api"],[0,"v1"],[0,"artists"],[1,"artistId"],[0,"followers"]],
    types: placeholder as Registry['artist_followers.artist_followers']['types'],
  },
  'artist_followers.count_followers': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/artists/:artistId/followers/count',
    tokens: [[0,"api"],[0,"v1"],[0,"artists"],[1,"artistId"],[0,"followers"],[0,"count"]],
    types: placeholder as Registry['artist_followers.count_followers']['types'],
  },
  'posts.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/artists/:artistId/posts',
    tokens: [[0,"api"],[0,"v1"],[0,"artists"],[1,"artistId"],[0,"posts"]],
    types: placeholder as Registry['posts.index']['types'],
  },
  'posts.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/posts/:postId',
    tokens: [[0,"api"],[0,"v1"],[0,"posts"],[1,"postId"]],
    types: placeholder as Registry['posts.show']['types'],
  },
  'posts.store': {
    methods: ["POST"],
    pattern: '/api/v1/artists/:artistId/posts',
    tokens: [[0,"api"],[0,"v1"],[0,"artists"],[1,"artistId"],[0,"posts"]],
    types: placeholder as Registry['posts.store']['types'],
  },
  'posts.update': {
    methods: ["PUT"],
    pattern: '/api/v1/posts/:postId',
    tokens: [[0,"api"],[0,"v1"],[0,"posts"],[1,"postId"]],
    types: placeholder as Registry['posts.update']['types'],
  },
  'posts.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/posts/:postId',
    tokens: [[0,"api"],[0,"v1"],[0,"posts"],[1,"postId"]],
    types: placeholder as Registry['posts.destroy']['types'],
  },
  'post_medias.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/posts/:postId/medias',
    tokens: [[0,"api"],[0,"v1"],[0,"posts"],[1,"postId"],[0,"medias"]],
    types: placeholder as Registry['post_medias.index']['types'],
  },
  'post_medias.store': {
    methods: ["POST"],
    pattern: '/api/v1/posts/:postId/medias',
    tokens: [[0,"api"],[0,"v1"],[0,"posts"],[1,"postId"],[0,"medias"]],
    types: placeholder as Registry['post_medias.store']['types'],
  },
  'post_medias.update': {
    methods: ["PUT"],
    pattern: '/api/v1/post-medias/:mediaId',
    tokens: [[0,"api"],[0,"v1"],[0,"post-medias"],[1,"mediaId"]],
    types: placeholder as Registry['post_medias.update']['types'],
  },
  'post_medias.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/post-medias/:mediaId',
    tokens: [[0,"api"],[0,"v1"],[0,"post-medias"],[1,"mediaId"]],
    types: placeholder as Registry['post_medias.destroy']['types'],
  },
  'events.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/events',
    tokens: [[0,"api"],[0,"v1"],[0,"events"]],
    types: placeholder as Registry['events.index']['types'],
  },
  'events.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/events/:id',
    tokens: [[0,"api"],[0,"v1"],[0,"events"],[1,"id"]],
    types: placeholder as Registry['events.show']['types'],
  },
  'events.store': {
    methods: ["POST"],
    pattern: '/api/v1/events',
    tokens: [[0,"api"],[0,"v1"],[0,"events"]],
    types: placeholder as Registry['events.store']['types'],
  },
  'events.update': {
    methods: ["PUT"],
    pattern: '/api/v1/events/:id',
    tokens: [[0,"api"],[0,"v1"],[0,"events"],[1,"id"]],
    types: placeholder as Registry['events.update']['types'],
  },
  'events.cancel': {
    methods: ["PATCH"],
    pattern: '/api/v1/events/:id/cancel',
    tokens: [[0,"api"],[0,"v1"],[0,"events"],[1,"id"],[0,"cancel"]],
    types: placeholder as Registry['events.cancel']['types'],
  },
  'venues.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/venues',
    tokens: [[0,"api"],[0,"v1"],[0,"venues"]],
    types: placeholder as Registry['venues.index']['types'],
  },
  'venues.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/venues/:id',
    tokens: [[0,"api"],[0,"v1"],[0,"venues"],[1,"id"]],
    types: placeholder as Registry['venues.show']['types'],
  },
  'venues.store': {
    methods: ["POST"],
    pattern: '/api/v1/venues',
    tokens: [[0,"api"],[0,"v1"],[0,"venues"]],
    types: placeholder as Registry['venues.store']['types'],
  },
  'venues.update': {
    methods: ["PUT"],
    pattern: '/api/v1/venues/:id',
    tokens: [[0,"api"],[0,"v1"],[0,"venues"],[1,"id"]],
    types: placeholder as Registry['venues.update']['types'],
  },
  'venues.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/venues/:id',
    tokens: [[0,"api"],[0,"v1"],[0,"venues"],[1,"id"]],
    types: placeholder as Registry['venues.destroy']['types'],
  },
  'event_artists.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/events/:eventId/artists',
    tokens: [[0,"api"],[0,"v1"],[0,"events"],[1,"eventId"],[0,"artists"]],
    types: placeholder as Registry['event_artists.index']['types'],
  },
  'event_artists.store': {
    methods: ["POST"],
    pattern: '/api/v1/events/:eventId/artists',
    tokens: [[0,"api"],[0,"v1"],[0,"events"],[1,"eventId"],[0,"artists"]],
    types: placeholder as Registry['event_artists.store']['types'],
  },
  'event_artists.update': {
    methods: ["PUT"],
    pattern: '/api/v1/event-artists/:eventArtistId',
    tokens: [[0,"api"],[0,"v1"],[0,"event-artists"],[1,"eventArtistId"]],
    types: placeholder as Registry['event_artists.update']['types'],
  },
  'event_artists.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/event-artists/:eventArtistId',
    tokens: [[0,"api"],[0,"v1"],[0,"event-artists"],[1,"eventArtistId"]],
    types: placeholder as Registry['event_artists.destroy']['types'],
  },
  'genres.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/genres',
    tokens: [[0,"api"],[0,"v1"],[0,"genres"]],
    types: placeholder as Registry['genres.index']['types'],
  },
  'genres.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/genres/:id',
    tokens: [[0,"api"],[0,"v1"],[0,"genres"],[1,"id"]],
    types: placeholder as Registry['genres.show']['types'],
  },
  'notifications.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/notifications',
    tokens: [[0,"api"],[0,"v1"],[0,"notifications"]],
    types: placeholder as Registry['notifications.index']['types'],
  },
  'notifications.unread_count': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/notifications/unread-count',
    tokens: [[0,"api"],[0,"v1"],[0,"notifications"],[0,"unread-count"]],
    types: placeholder as Registry['notifications.unread_count']['types'],
  },
  'notifications.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/notifications/:id',
    tokens: [[0,"api"],[0,"v1"],[0,"notifications"],[1,"id"]],
    types: placeholder as Registry['notifications.show']['types'],
  },
  'notifications.mark_as_read': {
    methods: ["PATCH"],
    pattern: '/api/v1/notifications/:id/read',
    tokens: [[0,"api"],[0,"v1"],[0,"notifications"],[1,"id"],[0,"read"]],
    types: placeholder as Registry['notifications.mark_as_read']['types'],
  },
  'notifications.mark_all_as_read': {
    methods: ["PATCH"],
    pattern: '/api/v1/notifications/read-all',
    tokens: [[0,"api"],[0,"v1"],[0,"notifications"],[0,"read-all"]],
    types: placeholder as Registry['notifications.mark_all_as_read']['types'],
  },
  'notifications.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/notifications/:id',
    tokens: [[0,"api"],[0,"v1"],[0,"notifications"],[1,"id"]],
    types: placeholder as Registry['notifications.destroy']['types'],
  },
  'user_devices.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/user-devices',
    tokens: [[0,"api"],[0,"v1"],[0,"user-devices"]],
    types: placeholder as Registry['user_devices.index']['types'],
  },
  'user_devices.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/user-devices/:id',
    tokens: [[0,"api"],[0,"v1"],[0,"user-devices"],[1,"id"]],
    types: placeholder as Registry['user_devices.show']['types'],
  },
  'user_devices.store': {
    methods: ["POST"],
    pattern: '/api/v1/user-devices',
    tokens: [[0,"api"],[0,"v1"],[0,"user-devices"]],
    types: placeholder as Registry['user_devices.store']['types'],
  },
  'user_devices.update': {
    methods: ["PUT"],
    pattern: '/api/v1/user-devices/:id',
    tokens: [[0,"api"],[0,"v1"],[0,"user-devices"],[1,"id"]],
    types: placeholder as Registry['user_devices.update']['types'],
  },
  'user_devices.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/user-devices/:id',
    tokens: [[0,"api"],[0,"v1"],[0,"user-devices"],[1,"id"]],
    types: placeholder as Registry['user_devices.destroy']['types'],
  },
  'reports.store': {
    methods: ["POST"],
    pattern: '/api/v1/reports',
    tokens: [[0,"api"],[0,"v1"],[0,"reports"]],
    types: placeholder as Registry['reports.store']['types'],
  },
  'reports.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/reports',
    tokens: [[0,"api"],[0,"v1"],[0,"reports"]],
    types: placeholder as Registry['reports.index']['types'],
  },
  'reports.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/reports/:id',
    tokens: [[0,"api"],[0,"v1"],[0,"reports"],[1,"id"]],
    types: placeholder as Registry['reports.show']['types'],
  },
  'reports.update_status': {
    methods: ["PATCH"],
    pattern: '/api/v1/reports/:id/status',
    tokens: [[0,"api"],[0,"v1"],[0,"reports"],[1,"id"],[0,"status"]],
    types: placeholder as Registry['reports.update_status']['types'],
  },
  'moderation_logs.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/moderation-logs',
    tokens: [[0,"api"],[0,"v1"],[0,"moderation-logs"]],
    types: placeholder as Registry['moderation_logs.index']['types'],
  },
  'moderation_logs.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/moderation-logs/:id',
    tokens: [[0,"api"],[0,"v1"],[0,"moderation-logs"],[1,"id"]],
    types: placeholder as Registry['moderation_logs.show']['types'],
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
