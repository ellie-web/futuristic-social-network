import { relations, sql } from 'drizzle-orm'
import { integer, pgTable, primaryKey, serial, text, timestamp, index } from 'drizzle-orm/pg-core'

export const User = pgTable('User', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  username: text('username').notNull().unique(),
  bio: text('bio'),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
	avatarUrl: text('avatarUrl'),
  followers: integer('followers').notNull().default(0),
  following: integer('following').notNull().default(0),
},
(table) => [
  index('search_index').using(
    'gin',
    sql`(
        setweight(to_tsvector('english', ${table.name}), 'A') ||
        setweight(to_tsvector('english', ${table.username}), 'B')
    )`,
  ),
])

export const Post = pgTable('Post', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  authorId: integer('authorId')
    .notNull()
    .references(() => User.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at'),
  likes: integer('likes').notNull().default(0)
})

export const Subscription = pgTable('Subscription', {
  followerId: integer('followerId')
    .notNull()
    .references(() => User.id, { onDelete: 'cascade' }),
  followingId: integer('followingId')
    .notNull()
    .references(() => User.id, { onDelete: 'cascade' })
}, (table) => [
  primaryKey({ columns: [table.followerId, table.followingId]}),
  index('followerId_idx').on(table.followerId),
  index('followingId_idx').on(table.followingId)
])

export const Like = pgTable('Like', {
  userId: integer('userId')
    .notNull()
    .references(() => User.id, { onDelete: 'cascade' }),
  postId: integer('postId')
    .notNull()
    .references(() => Post.id, { onDelete: 'cascade' }),
}, (table) => [
  primaryKey({ columns: [table.userId, table.postId]}),
  index('userId_idx').on(table.userId),
  index('postId_idx').on(table.postId)
])

export const postsRelations = relations(Post, ({ one }) => ({
	author: one(User, { fields: [Post.authorId], references: [User.id] }),
}))

export type InsertUser = typeof User.$inferInsert
export type SelectUser = typeof User.$inferSelect

export type InsertPost = typeof Post.$inferInsert
export type SelectPost = typeof Post.$inferSelect

export type InsertSubscription = typeof Subscription.$inferInsert
export type SelectSubscription = typeof Subscription.$inferSelect

export type InsertLike = typeof Like.$inferInsert
export type SelectLike = typeof Like.$inferSelect