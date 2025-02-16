import { relations } from 'drizzle-orm'
import { integer, pgTable, primaryKey, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const User = pgTable('User', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
	avatarUrl: text('avatarUrl')
})

export const Post = pgTable('Post', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  authorId: integer('authorId')
    .notNull()
    .references(() => User.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  // updatedAt: timestamp('updated_at')
  //   .notNull()
  //   .$onUpdate(() => new Date()),
})

export const Subscription = pgTable('Subscription', {
  followerId: integer('followerId')
    .notNull()
    .references(() => User.id, { onDelete: 'cascade' }),
  followingId: integer('followingId')
    .notNull()
    .references(() => User.id, { onDelete: 'cascade' })
}, (table) => [
  primaryKey({ columns: [table.followerId, table.followingId]})
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