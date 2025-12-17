import { compare } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { RegisterUseCase } from './register'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })

  it('should be able to register a new user', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'securepassword123',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'securepassword123',
    })

    const isPasswordCorrectlyHashed = await compare(
      'securepassword123',
      user.passwordHash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with an existing email', async () => {
    const email = 'john.doe@example.com'

    await sut.execute({
      name: 'John Doe',
      email,
      password: 'securepassword123',
    })

    await expect(() =>
      sut.execute({
        name: 'John Doe',
        email,
        password: 'anotherpassword456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
