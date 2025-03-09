import type IPost from './post'

export default interface IUser {
  id: number,
  username: string,
  email: string,
  name: string,
  bio: string | null | undefined,
  password: string,
  createdAt: string | Date | number,
  avatarUrl: string | null | undefined,
  followers: number,
  following: number
  posts?: IPost[]
}

export type TUserPublic = Omit<IUser, 'password'>

export type TUserContext = Omit<TUserPublic, 'followers', 'following'> & {
  followers: WritableComputedRef<number>,
  following: WritableComputedRef<number>
}