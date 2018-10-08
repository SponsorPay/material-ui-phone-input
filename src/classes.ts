export type Classes<T> =
  T extends (...args: any[]) => any ? Record<keyof ReturnType<T>, string> :
    Record<keyof T, string>
