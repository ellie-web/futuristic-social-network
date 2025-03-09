import type { IPost } from './post'

export type TFeedNextCursor = number | string | undefined
export type TFeedResponse = {
  posts: IFeedPost[],
  nextCursor: TNextCursor,
  hasMore: boolean
}

export interface IFeedPost extends IPost {
  author: {
    name: string,
    username: string,
    avatarUrl?: string
  }
}