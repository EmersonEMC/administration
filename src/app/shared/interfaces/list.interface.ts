export interface List<T = unknown, P = unknown, F = unknown> {
  filter(list: T): F;
  orderBy(list: T, param: P): T;
}
