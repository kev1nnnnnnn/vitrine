import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_tokens.store': { paramsTuple?: []; params?: {} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'profile.profile.update': { paramsTuple?: []; params?: {} }
    'profile.access_tokens.destroy': { paramsTuple?: []; params?: {} }
    'profile.artist_followers.following': { paramsTuple?: []; params?: {} }
    'artists.index': { paramsTuple?: []; params?: {} }
    'artists.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'artists.store': { paramsTuple?: []; params?: {} }
    'artists.sync_genres': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'artist_members.index': { paramsTuple: [ParamValue]; params: {'artistId': ParamValue} }
    'artist_members.store': { paramsTuple: [ParamValue]; params: {'artistId': ParamValue} }
    'artist_members.update': { paramsTuple: [ParamValue,ParamValue]; params: {'artistId': ParamValue,'memberId': ParamValue} }
    'artist_members.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'artistId': ParamValue,'memberId': ParamValue} }
    'artist_followers.follow': { paramsTuple: [ParamValue]; params: {'artistId': ParamValue} }
    'artist_followers.unfollow': { paramsTuple: [ParamValue]; params: {'artistId': ParamValue} }
    'artist_followers.artist_followers': { paramsTuple: [ParamValue]; params: {'artistId': ParamValue} }
    'artist_followers.count_followers': { paramsTuple: [ParamValue]; params: {'artistId': ParamValue} }
    'posts.index': { paramsTuple: [ParamValue]; params: {'artistId': ParamValue} }
    'posts.show': { paramsTuple: [ParamValue]; params: {'postId': ParamValue} }
    'posts.store': { paramsTuple: [ParamValue]; params: {'artistId': ParamValue} }
    'posts.update': { paramsTuple: [ParamValue]; params: {'postId': ParamValue} }
    'posts.destroy': { paramsTuple: [ParamValue]; params: {'postId': ParamValue} }
    'post_medias.index': { paramsTuple: [ParamValue]; params: {'postId': ParamValue} }
    'post_medias.store': { paramsTuple: [ParamValue]; params: {'postId': ParamValue} }
    'post_medias.update': { paramsTuple: [ParamValue]; params: {'mediaId': ParamValue} }
    'post_medias.destroy': { paramsTuple: [ParamValue]; params: {'mediaId': ParamValue} }
  }
  GET: {
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'profile.artist_followers.following': { paramsTuple?: []; params?: {} }
    'artists.index': { paramsTuple?: []; params?: {} }
    'artists.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'artist_members.index': { paramsTuple: [ParamValue]; params: {'artistId': ParamValue} }
    'artist_followers.artist_followers': { paramsTuple: [ParamValue]; params: {'artistId': ParamValue} }
    'artist_followers.count_followers': { paramsTuple: [ParamValue]; params: {'artistId': ParamValue} }
    'posts.index': { paramsTuple: [ParamValue]; params: {'artistId': ParamValue} }
    'posts.show': { paramsTuple: [ParamValue]; params: {'postId': ParamValue} }
    'post_medias.index': { paramsTuple: [ParamValue]; params: {'postId': ParamValue} }
  }
  HEAD: {
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'profile.artist_followers.following': { paramsTuple?: []; params?: {} }
    'artists.index': { paramsTuple?: []; params?: {} }
    'artists.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'artist_members.index': { paramsTuple: [ParamValue]; params: {'artistId': ParamValue} }
    'artist_followers.artist_followers': { paramsTuple: [ParamValue]; params: {'artistId': ParamValue} }
    'artist_followers.count_followers': { paramsTuple: [ParamValue]; params: {'artistId': ParamValue} }
    'posts.index': { paramsTuple: [ParamValue]; params: {'artistId': ParamValue} }
    'posts.show': { paramsTuple: [ParamValue]; params: {'postId': ParamValue} }
    'post_medias.index': { paramsTuple: [ParamValue]; params: {'postId': ParamValue} }
  }
  POST: {
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_tokens.store': { paramsTuple?: []; params?: {} }
    'profile.access_tokens.destroy': { paramsTuple?: []; params?: {} }
    'artists.store': { paramsTuple?: []; params?: {} }
    'artist_members.store': { paramsTuple: [ParamValue]; params: {'artistId': ParamValue} }
    'artist_followers.follow': { paramsTuple: [ParamValue]; params: {'artistId': ParamValue} }
    'posts.store': { paramsTuple: [ParamValue]; params: {'artistId': ParamValue} }
    'post_medias.store': { paramsTuple: [ParamValue]; params: {'postId': ParamValue} }
  }
  PUT: {
    'profile.profile.update': { paramsTuple?: []; params?: {} }
    'artists.sync_genres': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'artist_members.update': { paramsTuple: [ParamValue,ParamValue]; params: {'artistId': ParamValue,'memberId': ParamValue} }
    'posts.update': { paramsTuple: [ParamValue]; params: {'postId': ParamValue} }
    'post_medias.update': { paramsTuple: [ParamValue]; params: {'mediaId': ParamValue} }
  }
  DELETE: {
    'artist_members.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'artistId': ParamValue,'memberId': ParamValue} }
    'artist_followers.unfollow': { paramsTuple: [ParamValue]; params: {'artistId': ParamValue} }
    'posts.destroy': { paramsTuple: [ParamValue]; params: {'postId': ParamValue} }
    'post_medias.destroy': { paramsTuple: [ParamValue]; params: {'mediaId': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}