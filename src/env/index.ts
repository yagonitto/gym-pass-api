import z from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'production', 'test']),
  PORT: z.coerce.number().default(3333),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error(
    '❌ invalid environment variables:',
    z.flattenError(_env.error).fieldErrors,
  )

  throw new Error('invalid environment variables')
}

export const env = _env.data
