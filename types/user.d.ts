import type IPost from './post'

export default interface IUser {
  id: number,
  email: string,
  name: string,
  password: string,
  createdAt: string | Date,
  avatarUrl: string | null,
  posts?: IPost[]
}