import type { FastifyReply, FastifyRequest } from 'fastify'
import { ZodError, flattenError } from 'zod'
import { env } from '@/env'

export function errorHandler(
  error: unknown,
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'validation error',
      issues: flattenError(error).fieldErrors,
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
}
