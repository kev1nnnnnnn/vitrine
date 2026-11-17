/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractRawResponse, ExtractResponse, Method, PathWithRegistry, PatternsByMethod, RouteWithRegistry } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'
import type { routes } from './index.ts'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'auth.new_account.store': {
    methods: ["POST"]
    pattern: '/api/v1/auth/signup'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').signupValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').signupValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'auth.access_tokens.store': {
    methods: ["POST"]
    pattern: '/api/v1/auth/login'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').loginValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').loginValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/access_tokens_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/access_tokens_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/access_tokens_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'profile.profile.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/account/profile'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['show']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['show']>>>
    }
  }
  'profile.profile.update': {
    methods: ["PUT"]
    pattern: '/api/v1/account/profile'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user_profile').updateUserProfileValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user_profile').updateUserProfileValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'profile.access_tokens.destroy': {
    methods: ["POST"]
    pattern: '/api/v1/account/logout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/access_tokens_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/access_tokens_controller').default['destroy']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/access_tokens_controller').default['destroy']>>>
    }
  }
  'profile.artist_followers.following': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/account/following'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/artist_followers_controller').default['following']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/artist_followers_controller').default['following']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/artist_followers_controller').default['following']>>>
    }
  }
  'artists.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/artists'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/artist').listArtistsValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/artists_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/artists_controller').default['index']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/artists_controller').default['index']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'artists.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/artists/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/artists_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/artists_controller').default['show']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/artists_controller').default['show']>>>
    }
  }
  'artists.store': {
    methods: ["POST"]
    pattern: '/api/v1/artists'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/artist').createArtistValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/artist').createArtistValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/artists_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/artists_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/artists_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'artists.sync_genres': {
    methods: ["PUT"]
    pattern: '/api/v1/artists/:id/genres'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/artist').syncArtistGenresValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/artist').syncArtistGenresValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/artists_controller').default['syncGenres']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/artists_controller').default['syncGenres']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/artists_controller').default['syncGenres']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'artist_members.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/artists/:artistId/members'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { artistId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/artist_members_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/artist_members_controller').default['index']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/artist_members_controller').default['index']>>>
    }
  }
  'artist_members.store': {
    methods: ["POST"]
    pattern: '/api/v1/artists/:artistId/members'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/artist_member').createArtistMemberValidator)>>
      paramsTuple: [ParamValue]
      params: { artistId: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/artist_member').createArtistMemberValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/artist_members_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/artist_members_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/artist_members_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'artist_members.update': {
    methods: ["PUT"]
    pattern: '/api/v1/artists/:artistId/members/:memberId'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/artist_member').updateArtistMemberValidator)>>
      paramsTuple: [ParamValue, ParamValue]
      params: { artistId: ParamValue; memberId: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/artist_member').updateArtistMemberValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/artist_members_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/artist_members_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/artist_members_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'artist_members.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/artists/:artistId/members/:memberId'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { artistId: ParamValue; memberId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/artist_members_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/artist_members_controller').default['destroy']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/artist_members_controller').default['destroy']>>>
    }
  }
  'artist_followers.follow': {
    methods: ["POST"]
    pattern: '/api/v1/artists/:artistId/follow'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { artistId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/artist_followers_controller').default['follow']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/artist_followers_controller').default['follow']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/artist_followers_controller').default['follow']>>>
    }
  }
  'artist_followers.unfollow': {
    methods: ["DELETE"]
    pattern: '/api/v1/artists/:artistId/follow'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { artistId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/artist_followers_controller').default['unfollow']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/artist_followers_controller').default['unfollow']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/artist_followers_controller').default['unfollow']>>>
    }
  }
  'artist_followers.artist_followers': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/artists/:artistId/followers'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { artistId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/artist_followers_controller').default['artistFollowers']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/artist_followers_controller').default['artistFollowers']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/artist_followers_controller').default['artistFollowers']>>>
    }
  }
  'artist_followers.count_followers': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/artists/:artistId/followers/count'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { artistId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/artist_followers_controller').default['countFollowers']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/artist_followers_controller').default['countFollowers']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/artist_followers_controller').default['countFollowers']>>>
    }
  }
  'posts.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/artists/:artistId/posts'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { artistId: ParamValue }
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/post').listPostsValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/posts_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/posts_controller').default['index']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/posts_controller').default['index']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'posts.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/posts/:postId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { postId: ParamValue }
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/post').showPostValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/posts_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/posts_controller').default['show']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/posts_controller').default['show']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'posts.store': {
    methods: ["POST"]
    pattern: '/api/v1/artists/:artistId/posts'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/post').createPostValidator)>>
      paramsTuple: [ParamValue]
      params: { artistId: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/post').createPostValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/posts_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/posts_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/posts_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'posts.update': {
    methods: ["PUT"]
    pattern: '/api/v1/posts/:postId'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/post').updatePostValidator)>>
      paramsTuple: [ParamValue]
      params: { postId: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/post').updatePostValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/posts_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/posts_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/posts_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'posts.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/posts/:postId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { postId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/posts_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/posts_controller').default['destroy']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/posts_controller').default['destroy']>>>
    }
  }
  'post_medias.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/posts/:postId/medias'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { postId: ParamValue }
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/post_media').listPostMediasValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/post_medias_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/post_medias_controller').default['index']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/post_medias_controller').default['index']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'post_medias.store': {
    methods: ["POST"]
    pattern: '/api/v1/posts/:postId/medias'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/post_media').createPostMediaValidator)>>
      paramsTuple: [ParamValue]
      params: { postId: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/post_media').createPostMediaValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/post_medias_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/post_medias_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/post_medias_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'post_medias.update': {
    methods: ["PUT"]
    pattern: '/api/v1/post-medias/:mediaId'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/post_media').updatePostMediaValidator)>>
      paramsTuple: [ParamValue]
      params: { mediaId: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/post_media').updatePostMediaValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/post_medias_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/post_medias_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/post_medias_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'post_medias.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/post-medias/:mediaId'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/post_media').showPostMediaValidator)>>
      paramsTuple: [ParamValue]
      params: { mediaId: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/post_media').showPostMediaValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/post_medias_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/post_medias_controller').default['destroy']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/post_medias_controller').default['destroy']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'events.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/events'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/event').listEventsValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/events_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/events_controller').default['index']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/events_controller').default['index']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'events.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/events/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/event').showEventValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/events_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/events_controller').default['show']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/events_controller').default['show']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'events.store': {
    methods: ["POST"]
    pattern: '/api/v1/events'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/event').createEventValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/event').createEventValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/events_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/events_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/events_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'events.update': {
    methods: ["PUT"]
    pattern: '/api/v1/events/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/event').updateEventValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/event').updateEventValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/events_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/events_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/events_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'events.cancel': {
    methods: ["PATCH"]
    pattern: '/api/v1/events/:id/cancel'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/event').showEventValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/event').showEventValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/events_controller').default['cancel']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/events_controller').default['cancel']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/events_controller').default['cancel']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'venues.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/venues'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/venue').listVenuesValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/venues_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/venues_controller').default['index']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/venues_controller').default['index']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'venues.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/venues/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/venue').showVenueValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/venues_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/venues_controller').default['show']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/venues_controller').default['show']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'venues.store': {
    methods: ["POST"]
    pattern: '/api/v1/venues'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/venue').createVenueValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/venue').createVenueValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/venues_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/venues_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/venues_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'venues.update': {
    methods: ["PUT"]
    pattern: '/api/v1/venues/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/venue').updateVenueValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/venue').updateVenueValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/venues_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/venues_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/venues_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'venues.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/venues/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/venue').showVenueValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/venue').showVenueValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/venues_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/venues_controller').default['destroy']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/venues_controller').default['destroy']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'event_artists.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/events/:eventId/artists'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { eventId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/event_artists_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/event_artists_controller').default['index']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/event_artists_controller').default['index']>>>
    }
  }
  'event_artists.store': {
    methods: ["POST"]
    pattern: '/api/v1/events/:eventId/artists'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/event_artist').attachArtistValidator)>>
      paramsTuple: [ParamValue]
      params: { eventId: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/event_artist').attachArtistValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/event_artists_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/event_artists_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/event_artists_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'event_artists.update': {
    methods: ["PUT"]
    pattern: '/api/v1/event-artists/:eventArtistId'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/event_artist').updateArtistPerformanceValidator)>>
      paramsTuple: [ParamValue]
      params: { eventArtistId: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/event_artist').updateArtistPerformanceValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/event_artists_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/event_artists_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/event_artists_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'event_artists.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/event-artists/:eventArtistId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { eventArtistId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/event_artists_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/event_artists_controller').default['destroy']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/event_artists_controller').default['destroy']>>>
    }
  }
}

export namespace Route {
  export type Request<Name extends keyof typeof routes> = RouteWithRegistry.Request<typeof routes, Name>
  export type Response<Name extends keyof typeof routes> = RouteWithRegistry.Response<typeof routes, Name>
  export type Params<Name extends keyof typeof routes> = RouteWithRegistry.Params<typeof routes, Name>
  export type Body<Name extends keyof typeof routes> = RouteWithRegistry.Body<typeof routes, Name>
  export type Query<Name extends keyof typeof routes> = RouteWithRegistry.Query<typeof routes, Name>
  export type Error<Name extends keyof typeof routes> = RouteWithRegistry.Error<typeof routes, Name>
}

export namespace Path {
  export type Request<M extends Method, P extends PatternsByMethod<typeof routes, M>> =
    PathWithRegistry.Request<typeof routes, M, P>
  export type Response<M extends Method, P extends PatternsByMethod<typeof routes, M>> =
    PathWithRegistry.Response<typeof routes, M, P>
  export type Params<M extends Method, P extends PatternsByMethod<typeof routes, M>> =
    PathWithRegistry.Params<typeof routes, M, P>
  export type Body<M extends Method, P extends PatternsByMethod<typeof routes, M>> =
    PathWithRegistry.Body<typeof routes, M, P>
  export type Query<M extends Method, P extends PatternsByMethod<typeof routes, M>> =
    PathWithRegistry.Query<typeof routes, M, P>
  export type Error<M extends Method, P extends PatternsByMethod<typeof routes, M>> =
    PathWithRegistry.Error<typeof routes, M, P>
}
