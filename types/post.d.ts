import type IUser from './User'

export interface IPost {
  id: number,
  content: string,
  author: IUser,
  createdAt: string | Date | number,
  authorId: number
}

