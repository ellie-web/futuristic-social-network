import type IPost from './post'

export default interface IUser {
  id: number,
  email: string,
  name: string,
  password: string,
  createdAt: string | Date | number,
  avatarUrl: string | undefined,
  followers: number,
  following: number
  posts?: IPost[]
}

export type TUserPublic = Omit<IUser, 'password'>

export type TUserContext = Omit<TUserPublic, 'followers', 'following'> & {
  followers: WritableComputedRef<number>,
  following: WritableComputedRef<number>
}