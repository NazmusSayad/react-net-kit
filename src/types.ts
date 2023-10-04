export type Prettify<T extends object> = {
  [Key in keyof T]: T[Key]
} & {}

export type MergeObject<T extends object, U extends object> = Prettify<
  Omit<T, keyof U> & U
>
