import type { TUserPublic } from './User'

export interface IPost {
  id: number,
  content: string,
  author: TUserPublic,
  createdAt: string | Date | number,
  updatedAt: string | Date | number | null,
  authorId: number
}

