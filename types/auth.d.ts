import type IUser from './User'

declare module '#auth-utils' {
  interface User extends IUser {}

  interface UserSession {
    user: IUser
  }

  interface SecureSessionData {
    // Add your own fields
  }
}

export {}