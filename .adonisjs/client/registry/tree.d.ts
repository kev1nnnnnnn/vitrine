/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  auth: {
    newAccount: {
      store: typeof routes['auth.new_account.store']
    }
    accessTokens: {
      store: typeof routes['auth.access_tokens.store']
    }
  }
  profile: {
    profile: {
      show: typeof routes['profile.profile.show']
      update: typeof routes['profile.profile.update']
    }
    accessTokens: {
      destroy: typeof routes['profile.access_tokens.destroy']
    }
    artistFollowers: {
      following: typeof routes['profile.artist_followers.following']
    }
  }
  artists: {
    index: typeof routes['artists.index']
    show: typeof routes['artists.show']
    store: typeof routes['artists.store']
    syncGenres: typeof routes['artists.sync_genres']
  }
  artistMembers: {
    index: typeof routes['artist_members.index']
    store: typeof routes['artist_members.store']
    update: typeof routes['artist_members.update']
    destroy: typeof routes['artist_members.destroy']
  }
  artistFollowers: {
    follow: typeof routes['artist_followers.follow']
    unfollow: typeof routes['artist_followers.unfollow']
    artistFollowers: typeof routes['artist_followers.artist_followers']
    countFollowers: typeof routes['artist_followers.count_followers']
  }
  posts: {
    index: typeof routes['posts.index']
    show: typeof routes['posts.show']
    store: typeof routes['posts.store']
    update: typeof routes['posts.update']
    destroy: typeof routes['posts.destroy']
  }
  postMedias: {
    index: typeof routes['post_medias.index']
    store: typeof routes['post_medias.store']
    update: typeof routes['post_medias.update']
    destroy: typeof routes['post_medias.destroy']
  }
  events: {
    index: typeof routes['events.index']
    show: typeof routes['events.show']
    store: typeof routes['events.store']
    update: typeof routes['events.update']
    cancel: typeof routes['events.cancel']
  }
  venues: {
    index: typeof routes['venues.index']
    show: typeof routes['venues.show']
    store: typeof routes['venues.store']
    update: typeof routes['venues.update']
    destroy: typeof routes['venues.destroy']
  }
  eventArtists: {
    index: typeof routes['event_artists.index']
    store: typeof routes['event_artists.store']
    update: typeof routes['event_artists.update']
    destroy: typeof routes['event_artists.destroy']
  }
}
