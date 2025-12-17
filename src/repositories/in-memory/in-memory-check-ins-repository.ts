import { randomUUID } from 'node:crypto'
import type { CheckIn } from 'generated/prisma/client'
import type { CheckInUncheckedCreateInput } from 'generated/prisma/models'
import type { CheckInsRepository } from '../check-ins-repository'

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public items: CheckIn[] = []

  async create(data: CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkIn = {
      id: randomUUID(),
      userId: data.userId,
      gymId: data.gymId,
      validatedAt: data.validatedAt ? new Date(data.validatedAt) : null,
      createdAt: new Date(),
    }

    this.items.push(checkIn)

    return checkIn
  }
}
