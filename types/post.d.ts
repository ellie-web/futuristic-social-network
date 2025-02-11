import type IUser from './User'

export default interface IPost {
  id: number,
  content: string,
  author: IUser,
  createdAt: Date,
  authorId: number
}