import { User } from '~/database/schema'
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod'

export const userCreateSchema = createInsertSchema(User, {
  email: (schema) => schema.email(),
  name: (schema) => schema
    .max(45, { message: 'Name can`t be longer than 45 characters long'}),
  username: (schema) => schema
    .min(3, { message: 'Username must be at least 3 characters long'})
    .max(15, { message: 'Username can`t be longer than 15 characters long'})
    .trim()
    .refine(val => /^[a-z\d_.]+$/.test(val), 
      { message: 'Username can only contain lowercase letters, numbers, dots (.) and underscores (_)'})
    .refine(val => /^(?!\.)(?!.*\.$).+$/.test(val), 
      { message: 'Username can`t start or end with dots (.)'})
    .refine(val => /(?!^\d+$)^.+$/.test(val), 
      { message: 'Username can`t contain only numbers'})
    .refine(val => /^(?!.*[_.]{2}).+$/.test(val), 
      { message: 'Username can`t contain consecutive dots and underscores'}),
  password: (schema) => schema
    .min(8, 'Password must contain at least 8 symbols')
})

export const userUpdateSchema = createUpdateSchema(User, {
  name: (schema) => schema.max(45),
  bio: (schema) => schema.max(160)
})