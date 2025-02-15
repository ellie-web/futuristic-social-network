import { relations, sql } from 'drizzle-orm'
import { foreignKey, int, numeric, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const User = sqliteTable('User', {
	id: int('id').notNull().primaryKey(),
	email: text('email').notNull().unique(),
	name: text('name').notNull(),
	password: text('password').notNull(),
	createdAt: numeric('createdAt').notNull().default(sql`DATE('now')`),
	avatarUrl: text('avatarUrl')
});

export const Post = sqliteTable('Post', {
	id: int('id').notNull().primaryKey(),
	content: text('content').notNull(),
	createdAt: numeric('createdAt').notNull().default(sql`DATE('now')`),
	authorId: int('authorId').notNull()
}, (Post) => ({
	'Post_author_fkey': foreignKey({
		name: 'Post_author_fkey',
		columns: [Post.authorId],
		foreignColumns: [User.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade')
}));

export const UserRelations = relations(User, ({ many }) => ({
	posts: many(Post, {
		relationName: 'PostToUser'
	})
}));

export const PostRelations = relations(Post, ({ one }) => ({
	author: one(User, {
		relationName: 'PostToUser',
		fields: [Post.authorId],
		references: [User.id]
	})
}));