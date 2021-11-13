export interface Mapper<Persistence, Entity, Dto> {
  toPersistence(entity: Entity): Persistence;
  toDomain(persistence: Persistence): Entity;
  toDTO(entity: Entity): Dto;
}
