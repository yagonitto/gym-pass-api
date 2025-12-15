import fastify from 'fastify'
import z, { ZodError } from 'zod'
import { env } from './env'
import { appRoutes } from './http/routes'

export const app = fastify()

app.register(appRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'validation error',
      issues: z.flattenError(error).fieldErrors,
    })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: Integrate with an external logging service like Sentry or DataDog
  }

  return reply.status(500).send({
    message: 'internal server error',
  })
})
