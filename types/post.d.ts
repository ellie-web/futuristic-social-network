import type IUser from './User'

export interface IPost {
  id: number,
  content: string,
  author: IUser,
  createdAt: string | Date,
  authorId: number
}

export interface IFeedPost extends IPost {
  author: {
    name: string,
    avatarUrl?: string
  }
}