
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model WatchModel
 * 
 */
export type WatchModel = $Result.DefaultSelection<Prisma.$WatchModelPayload>
/**
 * Model WatchSize
 * 
 */
export type WatchSize = $Result.DefaultSelection<Prisma.$WatchSizePayload>
/**
 * Model FrameColor
 * 
 */
export type FrameColor = $Result.DefaultSelection<Prisma.$FrameColorPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more WatchModels
 * const watchModels = await prisma.watchModel.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more WatchModels
   * const watchModels = await prisma.watchModel.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.watchModel`: Exposes CRUD operations for the **WatchModel** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more WatchModels
    * const watchModels = await prisma.watchModel.findMany()
    * ```
    */
  get watchModel(): Prisma.WatchModelDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.watchSize`: Exposes CRUD operations for the **WatchSize** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more WatchSizes
    * const watchSizes = await prisma.watchSize.findMany()
    * ```
    */
  get watchSize(): Prisma.WatchSizeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.frameColor`: Exposes CRUD operations for the **FrameColor** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more FrameColors
    * const frameColors = await prisma.frameColor.findMany()
    * ```
    */
  get frameColor(): Prisma.FrameColorDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.17.1
   * Query Engine version: 272a37d34178c2894197e17273bf937f25acdeac
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    WatchModel: 'WatchModel',
    WatchSize: 'WatchSize',
    FrameColor: 'FrameColor'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "watchModel" | "watchSize" | "frameColor"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      WatchModel: {
        payload: Prisma.$WatchModelPayload<ExtArgs>
        fields: Prisma.WatchModelFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WatchModelFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WatchModelPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WatchModelFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WatchModelPayload>
          }
          findFirst: {
            args: Prisma.WatchModelFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WatchModelPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WatchModelFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WatchModelPayload>
          }
          findMany: {
            args: Prisma.WatchModelFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WatchModelPayload>[]
          }
          create: {
            args: Prisma.WatchModelCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WatchModelPayload>
          }
          createMany: {
            args: Prisma.WatchModelCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WatchModelCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WatchModelPayload>[]
          }
          delete: {
            args: Prisma.WatchModelDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WatchModelPayload>
          }
          update: {
            args: Prisma.WatchModelUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WatchModelPayload>
          }
          deleteMany: {
            args: Prisma.WatchModelDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WatchModelUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.WatchModelUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WatchModelPayload>[]
          }
          upsert: {
            args: Prisma.WatchModelUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WatchModelPayload>
          }
          aggregate: {
            args: Prisma.WatchModelAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWatchModel>
          }
          groupBy: {
            args: Prisma.WatchModelGroupByArgs<ExtArgs>
            result: $Utils.Optional<WatchModelGroupByOutputType>[]
          }
          count: {
            args: Prisma.WatchModelCountArgs<ExtArgs>
            result: $Utils.Optional<WatchModelCountAggregateOutputType> | number
          }
        }
      }
      WatchSize: {
        payload: Prisma.$WatchSizePayload<ExtArgs>
        fields: Prisma.WatchSizeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WatchSizeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WatchSizePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WatchSizeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WatchSizePayload>
          }
          findFirst: {
            args: Prisma.WatchSizeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WatchSizePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WatchSizeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WatchSizePayload>
          }
          findMany: {
            args: Prisma.WatchSizeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WatchSizePayload>[]
          }
          create: {
            args: Prisma.WatchSizeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WatchSizePayload>
          }
          createMany: {
            args: Prisma.WatchSizeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WatchSizeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WatchSizePayload>[]
          }
          delete: {
            args: Prisma.WatchSizeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WatchSizePayload>
          }
          update: {
            args: Prisma.WatchSizeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WatchSizePayload>
          }
          deleteMany: {
            args: Prisma.WatchSizeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WatchSizeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.WatchSizeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WatchSizePayload>[]
          }
          upsert: {
            args: Prisma.WatchSizeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WatchSizePayload>
          }
          aggregate: {
            args: Prisma.WatchSizeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWatchSize>
          }
          groupBy: {
            args: Prisma.WatchSizeGroupByArgs<ExtArgs>
            result: $Utils.Optional<WatchSizeGroupByOutputType>[]
          }
          count: {
            args: Prisma.WatchSizeCountArgs<ExtArgs>
            result: $Utils.Optional<WatchSizeCountAggregateOutputType> | number
          }
        }
      }
      FrameColor: {
        payload: Prisma.$FrameColorPayload<ExtArgs>
        fields: Prisma.FrameColorFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FrameColorFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FrameColorPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FrameColorFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FrameColorPayload>
          }
          findFirst: {
            args: Prisma.FrameColorFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FrameColorPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FrameColorFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FrameColorPayload>
          }
          findMany: {
            args: Prisma.FrameColorFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FrameColorPayload>[]
          }
          create: {
            args: Prisma.FrameColorCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FrameColorPayload>
          }
          createMany: {
            args: Prisma.FrameColorCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FrameColorCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FrameColorPayload>[]
          }
          delete: {
            args: Prisma.FrameColorDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FrameColorPayload>
          }
          update: {
            args: Prisma.FrameColorUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FrameColorPayload>
          }
          deleteMany: {
            args: Prisma.FrameColorDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FrameColorUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FrameColorUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FrameColorPayload>[]
          }
          upsert: {
            args: Prisma.FrameColorUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FrameColorPayload>
          }
          aggregate: {
            args: Prisma.FrameColorAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFrameColor>
          }
          groupBy: {
            args: Prisma.FrameColorGroupByArgs<ExtArgs>
            result: $Utils.Optional<FrameColorGroupByOutputType>[]
          }
          count: {
            args: Prisma.FrameColorCountArgs<ExtArgs>
            result: $Utils.Optional<FrameColorCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    watchModel?: WatchModelOmit
    watchSize?: WatchSizeOmit
    frameColor?: FrameColorOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type WatchModelCountOutputType
   */

  export type WatchModelCountOutputType = {
    watch_sizes: number
    frame_colors: number
  }

  export type WatchModelCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    watch_sizes?: boolean | WatchModelCountOutputTypeCountWatch_sizesArgs
    frame_colors?: boolean | WatchModelCountOutputTypeCountFrame_colorsArgs
  }

  // Custom InputTypes
  /**
   * WatchModelCountOutputType without action
   */
  export type WatchModelCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WatchModelCountOutputType
     */
    select?: WatchModelCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * WatchModelCountOutputType without action
   */
  export type WatchModelCountOutputTypeCountWatch_sizesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WatchSizeWhereInput
  }

  /**
   * WatchModelCountOutputType without action
   */
  export type WatchModelCountOutputTypeCountFrame_colorsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FrameColorWhereInput
  }


  /**
   * Models
   */

  /**
   * Model WatchModel
   */

  export type AggregateWatchModel = {
    _count: WatchModelCountAggregateOutputType | null
    _avg: WatchModelAvgAggregateOutputType | null
    _sum: WatchModelSumAggregateOutputType | null
    _min: WatchModelMinAggregateOutputType | null
    _max: WatchModelMaxAggregateOutputType | null
  }

  export type WatchModelAvgAggregateOutputType = {
    id: number | null
  }

  export type WatchModelSumAggregateOutputType = {
    id: number | null
  }

  export type WatchModelMinAggregateOutputType = {
    id: number | null
    model_name: string | null
    watch_model_name: string | null
    watch_model_manufacturer: string | null
    main_image: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type WatchModelMaxAggregateOutputType = {
    id: number | null
    model_name: string | null
    watch_model_name: string | null
    watch_model_manufacturer: string | null
    main_image: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type WatchModelCountAggregateOutputType = {
    id: number
    model_name: number
    watch_model_name: number
    watch_model_manufacturer: number
    main_image: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type WatchModelAvgAggregateInputType = {
    id?: true
  }

  export type WatchModelSumAggregateInputType = {
    id?: true
  }

  export type WatchModelMinAggregateInputType = {
    id?: true
    model_name?: true
    watch_model_name?: true
    watch_model_manufacturer?: true
    main_image?: true
    createdAt?: true
    updatedAt?: true
  }

  export type WatchModelMaxAggregateInputType = {
    id?: true
    model_name?: true
    watch_model_name?: true
    watch_model_manufacturer?: true
    main_image?: true
    createdAt?: true
    updatedAt?: true
  }

  export type WatchModelCountAggregateInputType = {
    id?: true
    model_name?: true
    watch_model_name?: true
    watch_model_manufacturer?: true
    main_image?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type WatchModelAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WatchModel to aggregate.
     */
    where?: WatchModelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WatchModels to fetch.
     */
    orderBy?: WatchModelOrderByWithRelationInput | WatchModelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WatchModelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WatchModels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WatchModels.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned WatchModels
    **/
    _count?: true | WatchModelCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: WatchModelAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: WatchModelSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WatchModelMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WatchModelMaxAggregateInputType
  }

  export type GetWatchModelAggregateType<T extends WatchModelAggregateArgs> = {
        [P in keyof T & keyof AggregateWatchModel]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWatchModel[P]>
      : GetScalarType<T[P], AggregateWatchModel[P]>
  }




  export type WatchModelGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WatchModelWhereInput
    orderBy?: WatchModelOrderByWithAggregationInput | WatchModelOrderByWithAggregationInput[]
    by: WatchModelScalarFieldEnum[] | WatchModelScalarFieldEnum
    having?: WatchModelScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WatchModelCountAggregateInputType | true
    _avg?: WatchModelAvgAggregateInputType
    _sum?: WatchModelSumAggregateInputType
    _min?: WatchModelMinAggregateInputType
    _max?: WatchModelMaxAggregateInputType
  }

  export type WatchModelGroupByOutputType = {
    id: number
    model_name: string
    watch_model_name: string
    watch_model_manufacturer: string | null
    main_image: string | null
    createdAt: Date
    updatedAt: Date
    _count: WatchModelCountAggregateOutputType | null
    _avg: WatchModelAvgAggregateOutputType | null
    _sum: WatchModelSumAggregateOutputType | null
    _min: WatchModelMinAggregateOutputType | null
    _max: WatchModelMaxAggregateOutputType | null
  }

  type GetWatchModelGroupByPayload<T extends WatchModelGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WatchModelGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WatchModelGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WatchModelGroupByOutputType[P]>
            : GetScalarType<T[P], WatchModelGroupByOutputType[P]>
        }
      >
    >


  export type WatchModelSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    model_name?: boolean
    watch_model_name?: boolean
    watch_model_manufacturer?: boolean
    main_image?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    watch_sizes?: boolean | WatchModel$watch_sizesArgs<ExtArgs>
    frame_colors?: boolean | WatchModel$frame_colorsArgs<ExtArgs>
    _count?: boolean | WatchModelCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["watchModel"]>

  export type WatchModelSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    model_name?: boolean
    watch_model_name?: boolean
    watch_model_manufacturer?: boolean
    main_image?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["watchModel"]>

  export type WatchModelSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    model_name?: boolean
    watch_model_name?: boolean
    watch_model_manufacturer?: boolean
    main_image?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["watchModel"]>

  export type WatchModelSelectScalar = {
    id?: boolean
    model_name?: boolean
    watch_model_name?: boolean
    watch_model_manufacturer?: boolean
    main_image?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type WatchModelOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "model_name" | "watch_model_name" | "watch_model_manufacturer" | "main_image" | "createdAt" | "updatedAt", ExtArgs["result"]["watchModel"]>
  export type WatchModelInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    watch_sizes?: boolean | WatchModel$watch_sizesArgs<ExtArgs>
    frame_colors?: boolean | WatchModel$frame_colorsArgs<ExtArgs>
    _count?: boolean | WatchModelCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type WatchModelIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type WatchModelIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $WatchModelPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "WatchModel"
    objects: {
      watch_sizes: Prisma.$WatchSizePayload<ExtArgs>[]
      frame_colors: Prisma.$FrameColorPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      model_name: string
      watch_model_name: string
      watch_model_manufacturer: string | null
      main_image: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["watchModel"]>
    composites: {}
  }

  type WatchModelGetPayload<S extends boolean | null | undefined | WatchModelDefaultArgs> = $Result.GetResult<Prisma.$WatchModelPayload, S>

  type WatchModelCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WatchModelFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: WatchModelCountAggregateInputType | true
    }

  export interface WatchModelDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['WatchModel'], meta: { name: 'WatchModel' } }
    /**
     * Find zero or one WatchModel that matches the filter.
     * @param {WatchModelFindUniqueArgs} args - Arguments to find a WatchModel
     * @example
     * // Get one WatchModel
     * const watchModel = await prisma.watchModel.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WatchModelFindUniqueArgs>(args: SelectSubset<T, WatchModelFindUniqueArgs<ExtArgs>>): Prisma__WatchModelClient<$Result.GetResult<Prisma.$WatchModelPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one WatchModel that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WatchModelFindUniqueOrThrowArgs} args - Arguments to find a WatchModel
     * @example
     * // Get one WatchModel
     * const watchModel = await prisma.watchModel.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WatchModelFindUniqueOrThrowArgs>(args: SelectSubset<T, WatchModelFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WatchModelClient<$Result.GetResult<Prisma.$WatchModelPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WatchModel that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WatchModelFindFirstArgs} args - Arguments to find a WatchModel
     * @example
     * // Get one WatchModel
     * const watchModel = await prisma.watchModel.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WatchModelFindFirstArgs>(args?: SelectSubset<T, WatchModelFindFirstArgs<ExtArgs>>): Prisma__WatchModelClient<$Result.GetResult<Prisma.$WatchModelPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WatchModel that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WatchModelFindFirstOrThrowArgs} args - Arguments to find a WatchModel
     * @example
     * // Get one WatchModel
     * const watchModel = await prisma.watchModel.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WatchModelFindFirstOrThrowArgs>(args?: SelectSubset<T, WatchModelFindFirstOrThrowArgs<ExtArgs>>): Prisma__WatchModelClient<$Result.GetResult<Prisma.$WatchModelPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more WatchModels that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WatchModelFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all WatchModels
     * const watchModels = await prisma.watchModel.findMany()
     * 
     * // Get first 10 WatchModels
     * const watchModels = await prisma.watchModel.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const watchModelWithIdOnly = await prisma.watchModel.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WatchModelFindManyArgs>(args?: SelectSubset<T, WatchModelFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WatchModelPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a WatchModel.
     * @param {WatchModelCreateArgs} args - Arguments to create a WatchModel.
     * @example
     * // Create one WatchModel
     * const WatchModel = await prisma.watchModel.create({
     *   data: {
     *     // ... data to create a WatchModel
     *   }
     * })
     * 
     */
    create<T extends WatchModelCreateArgs>(args: SelectSubset<T, WatchModelCreateArgs<ExtArgs>>): Prisma__WatchModelClient<$Result.GetResult<Prisma.$WatchModelPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many WatchModels.
     * @param {WatchModelCreateManyArgs} args - Arguments to create many WatchModels.
     * @example
     * // Create many WatchModels
     * const watchModel = await prisma.watchModel.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WatchModelCreateManyArgs>(args?: SelectSubset<T, WatchModelCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many WatchModels and returns the data saved in the database.
     * @param {WatchModelCreateManyAndReturnArgs} args - Arguments to create many WatchModels.
     * @example
     * // Create many WatchModels
     * const watchModel = await prisma.watchModel.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many WatchModels and only return the `id`
     * const watchModelWithIdOnly = await prisma.watchModel.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WatchModelCreateManyAndReturnArgs>(args?: SelectSubset<T, WatchModelCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WatchModelPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a WatchModel.
     * @param {WatchModelDeleteArgs} args - Arguments to delete one WatchModel.
     * @example
     * // Delete one WatchModel
     * const WatchModel = await prisma.watchModel.delete({
     *   where: {
     *     // ... filter to delete one WatchModel
     *   }
     * })
     * 
     */
    delete<T extends WatchModelDeleteArgs>(args: SelectSubset<T, WatchModelDeleteArgs<ExtArgs>>): Prisma__WatchModelClient<$Result.GetResult<Prisma.$WatchModelPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one WatchModel.
     * @param {WatchModelUpdateArgs} args - Arguments to update one WatchModel.
     * @example
     * // Update one WatchModel
     * const watchModel = await prisma.watchModel.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WatchModelUpdateArgs>(args: SelectSubset<T, WatchModelUpdateArgs<ExtArgs>>): Prisma__WatchModelClient<$Result.GetResult<Prisma.$WatchModelPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more WatchModels.
     * @param {WatchModelDeleteManyArgs} args - Arguments to filter WatchModels to delete.
     * @example
     * // Delete a few WatchModels
     * const { count } = await prisma.watchModel.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WatchModelDeleteManyArgs>(args?: SelectSubset<T, WatchModelDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WatchModels.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WatchModelUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many WatchModels
     * const watchModel = await prisma.watchModel.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WatchModelUpdateManyArgs>(args: SelectSubset<T, WatchModelUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WatchModels and returns the data updated in the database.
     * @param {WatchModelUpdateManyAndReturnArgs} args - Arguments to update many WatchModels.
     * @example
     * // Update many WatchModels
     * const watchModel = await prisma.watchModel.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more WatchModels and only return the `id`
     * const watchModelWithIdOnly = await prisma.watchModel.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends WatchModelUpdateManyAndReturnArgs>(args: SelectSubset<T, WatchModelUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WatchModelPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one WatchModel.
     * @param {WatchModelUpsertArgs} args - Arguments to update or create a WatchModel.
     * @example
     * // Update or create a WatchModel
     * const watchModel = await prisma.watchModel.upsert({
     *   create: {
     *     // ... data to create a WatchModel
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the WatchModel we want to update
     *   }
     * })
     */
    upsert<T extends WatchModelUpsertArgs>(args: SelectSubset<T, WatchModelUpsertArgs<ExtArgs>>): Prisma__WatchModelClient<$Result.GetResult<Prisma.$WatchModelPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of WatchModels.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WatchModelCountArgs} args - Arguments to filter WatchModels to count.
     * @example
     * // Count the number of WatchModels
     * const count = await prisma.watchModel.count({
     *   where: {
     *     // ... the filter for the WatchModels we want to count
     *   }
     * })
    **/
    count<T extends WatchModelCountArgs>(
      args?: Subset<T, WatchModelCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WatchModelCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a WatchModel.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WatchModelAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WatchModelAggregateArgs>(args: Subset<T, WatchModelAggregateArgs>): Prisma.PrismaPromise<GetWatchModelAggregateType<T>>

    /**
     * Group by WatchModel.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WatchModelGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WatchModelGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WatchModelGroupByArgs['orderBy'] }
        : { orderBy?: WatchModelGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WatchModelGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWatchModelGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the WatchModel model
   */
  readonly fields: WatchModelFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for WatchModel.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WatchModelClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    watch_sizes<T extends WatchModel$watch_sizesArgs<ExtArgs> = {}>(args?: Subset<T, WatchModel$watch_sizesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WatchSizePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    frame_colors<T extends WatchModel$frame_colorsArgs<ExtArgs> = {}>(args?: Subset<T, WatchModel$frame_colorsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FrameColorPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the WatchModel model
   */
  interface WatchModelFieldRefs {
    readonly id: FieldRef<"WatchModel", 'Int'>
    readonly model_name: FieldRef<"WatchModel", 'String'>
    readonly watch_model_name: FieldRef<"WatchModel", 'String'>
    readonly watch_model_manufacturer: FieldRef<"WatchModel", 'String'>
    readonly main_image: FieldRef<"WatchModel", 'String'>
    readonly createdAt: FieldRef<"WatchModel", 'DateTime'>
    readonly updatedAt: FieldRef<"WatchModel", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * WatchModel findUnique
   */
  export type WatchModelFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WatchModel
     */
    select?: WatchModelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WatchModel
     */
    omit?: WatchModelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WatchModelInclude<ExtArgs> | null
    /**
     * Filter, which WatchModel to fetch.
     */
    where: WatchModelWhereUniqueInput
  }

  /**
   * WatchModel findUniqueOrThrow
   */
  export type WatchModelFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WatchModel
     */
    select?: WatchModelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WatchModel
     */
    omit?: WatchModelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WatchModelInclude<ExtArgs> | null
    /**
     * Filter, which WatchModel to fetch.
     */
    where: WatchModelWhereUniqueInput
  }

  /**
   * WatchModel findFirst
   */
  export type WatchModelFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WatchModel
     */
    select?: WatchModelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WatchModel
     */
    omit?: WatchModelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WatchModelInclude<ExtArgs> | null
    /**
     * Filter, which WatchModel to fetch.
     */
    where?: WatchModelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WatchModels to fetch.
     */
    orderBy?: WatchModelOrderByWithRelationInput | WatchModelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WatchModels.
     */
    cursor?: WatchModelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WatchModels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WatchModels.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WatchModels.
     */
    distinct?: WatchModelScalarFieldEnum | WatchModelScalarFieldEnum[]
  }

  /**
   * WatchModel findFirstOrThrow
   */
  export type WatchModelFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WatchModel
     */
    select?: WatchModelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WatchModel
     */
    omit?: WatchModelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WatchModelInclude<ExtArgs> | null
    /**
     * Filter, which WatchModel to fetch.
     */
    where?: WatchModelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WatchModels to fetch.
     */
    orderBy?: WatchModelOrderByWithRelationInput | WatchModelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WatchModels.
     */
    cursor?: WatchModelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WatchModels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WatchModels.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WatchModels.
     */
    distinct?: WatchModelScalarFieldEnum | WatchModelScalarFieldEnum[]
  }

  /**
   * WatchModel findMany
   */
  export type WatchModelFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WatchModel
     */
    select?: WatchModelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WatchModel
     */
    omit?: WatchModelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WatchModelInclude<ExtArgs> | null
    /**
     * Filter, which WatchModels to fetch.
     */
    where?: WatchModelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WatchModels to fetch.
     */
    orderBy?: WatchModelOrderByWithRelationInput | WatchModelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing WatchModels.
     */
    cursor?: WatchModelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WatchModels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WatchModels.
     */
    skip?: number
    distinct?: WatchModelScalarFieldEnum | WatchModelScalarFieldEnum[]
  }

  /**
   * WatchModel create
   */
  export type WatchModelCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WatchModel
     */
    select?: WatchModelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WatchModel
     */
    omit?: WatchModelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WatchModelInclude<ExtArgs> | null
    /**
     * The data needed to create a WatchModel.
     */
    data: XOR<WatchModelCreateInput, WatchModelUncheckedCreateInput>
  }

  /**
   * WatchModel createMany
   */
  export type WatchModelCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many WatchModels.
     */
    data: WatchModelCreateManyInput | WatchModelCreateManyInput[]
  }

  /**
   * WatchModel createManyAndReturn
   */
  export type WatchModelCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WatchModel
     */
    select?: WatchModelSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WatchModel
     */
    omit?: WatchModelOmit<ExtArgs> | null
    /**
     * The data used to create many WatchModels.
     */
    data: WatchModelCreateManyInput | WatchModelCreateManyInput[]
  }

  /**
   * WatchModel update
   */
  export type WatchModelUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WatchModel
     */
    select?: WatchModelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WatchModel
     */
    omit?: WatchModelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WatchModelInclude<ExtArgs> | null
    /**
     * The data needed to update a WatchModel.
     */
    data: XOR<WatchModelUpdateInput, WatchModelUncheckedUpdateInput>
    /**
     * Choose, which WatchModel to update.
     */
    where: WatchModelWhereUniqueInput
  }

  /**
   * WatchModel updateMany
   */
  export type WatchModelUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update WatchModels.
     */
    data: XOR<WatchModelUpdateManyMutationInput, WatchModelUncheckedUpdateManyInput>
    /**
     * Filter which WatchModels to update
     */
    where?: WatchModelWhereInput
    /**
     * Limit how many WatchModels to update.
     */
    limit?: number
  }

  /**
   * WatchModel updateManyAndReturn
   */
  export type WatchModelUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WatchModel
     */
    select?: WatchModelSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WatchModel
     */
    omit?: WatchModelOmit<ExtArgs> | null
    /**
     * The data used to update WatchModels.
     */
    data: XOR<WatchModelUpdateManyMutationInput, WatchModelUncheckedUpdateManyInput>
    /**
     * Filter which WatchModels to update
     */
    where?: WatchModelWhereInput
    /**
     * Limit how many WatchModels to update.
     */
    limit?: number
  }

  /**
   * WatchModel upsert
   */
  export type WatchModelUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WatchModel
     */
    select?: WatchModelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WatchModel
     */
    omit?: WatchModelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WatchModelInclude<ExtArgs> | null
    /**
     * The filter to search for the WatchModel to update in case it exists.
     */
    where: WatchModelWhereUniqueInput
    /**
     * In case the WatchModel found by the `where` argument doesn't exist, create a new WatchModel with this data.
     */
    create: XOR<WatchModelCreateInput, WatchModelUncheckedCreateInput>
    /**
     * In case the WatchModel was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WatchModelUpdateInput, WatchModelUncheckedUpdateInput>
  }

  /**
   * WatchModel delete
   */
  export type WatchModelDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WatchModel
     */
    select?: WatchModelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WatchModel
     */
    omit?: WatchModelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WatchModelInclude<ExtArgs> | null
    /**
     * Filter which WatchModel to delete.
     */
    where: WatchModelWhereUniqueInput
  }

  /**
   * WatchModel deleteMany
   */
  export type WatchModelDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WatchModels to delete
     */
    where?: WatchModelWhereInput
    /**
     * Limit how many WatchModels to delete.
     */
    limit?: number
  }

  /**
   * WatchModel.watch_sizes
   */
  export type WatchModel$watch_sizesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WatchSize
     */
    select?: WatchSizeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WatchSize
     */
    omit?: WatchSizeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WatchSizeInclude<ExtArgs> | null
    where?: WatchSizeWhereInput
    orderBy?: WatchSizeOrderByWithRelationInput | WatchSizeOrderByWithRelationInput[]
    cursor?: WatchSizeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WatchSizeScalarFieldEnum | WatchSizeScalarFieldEnum[]
  }

  /**
   * WatchModel.frame_colors
   */
  export type WatchModel$frame_colorsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FrameColor
     */
    select?: FrameColorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FrameColor
     */
    omit?: FrameColorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FrameColorInclude<ExtArgs> | null
    where?: FrameColorWhereInput
    orderBy?: FrameColorOrderByWithRelationInput | FrameColorOrderByWithRelationInput[]
    cursor?: FrameColorWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FrameColorScalarFieldEnum | FrameColorScalarFieldEnum[]
  }

  /**
   * WatchModel without action
   */
  export type WatchModelDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WatchModel
     */
    select?: WatchModelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WatchModel
     */
    omit?: WatchModelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WatchModelInclude<ExtArgs> | null
  }


  /**
   * Model WatchSize
   */

  export type AggregateWatchSize = {
    _count: WatchSizeCountAggregateOutputType | null
    _avg: WatchSizeAvgAggregateOutputType | null
    _sum: WatchSizeSumAggregateOutputType | null
    _min: WatchSizeMinAggregateOutputType | null
    _max: WatchSizeMaxAggregateOutputType | null
  }

  export type WatchSizeAvgAggregateOutputType = {
    id: number | null
    watchModelId: number | null
  }

  export type WatchSizeSumAggregateOutputType = {
    id: number | null
    watchModelId: number | null
  }

  export type WatchSizeMinAggregateOutputType = {
    id: number | null
    watch_size: string | null
    watchModelId: number | null
  }

  export type WatchSizeMaxAggregateOutputType = {
    id: number | null
    watch_size: string | null
    watchModelId: number | null
  }

  export type WatchSizeCountAggregateOutputType = {
    id: number
    watch_size: number
    watchModelId: number
    _all: number
  }


  export type WatchSizeAvgAggregateInputType = {
    id?: true
    watchModelId?: true
  }

  export type WatchSizeSumAggregateInputType = {
    id?: true
    watchModelId?: true
  }

  export type WatchSizeMinAggregateInputType = {
    id?: true
    watch_size?: true
    watchModelId?: true
  }

  export type WatchSizeMaxAggregateInputType = {
    id?: true
    watch_size?: true
    watchModelId?: true
  }

  export type WatchSizeCountAggregateInputType = {
    id?: true
    watch_size?: true
    watchModelId?: true
    _all?: true
  }

  export type WatchSizeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WatchSize to aggregate.
     */
    where?: WatchSizeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WatchSizes to fetch.
     */
    orderBy?: WatchSizeOrderByWithRelationInput | WatchSizeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WatchSizeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WatchSizes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WatchSizes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned WatchSizes
    **/
    _count?: true | WatchSizeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: WatchSizeAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: WatchSizeSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WatchSizeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WatchSizeMaxAggregateInputType
  }

  export type GetWatchSizeAggregateType<T extends WatchSizeAggregateArgs> = {
        [P in keyof T & keyof AggregateWatchSize]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWatchSize[P]>
      : GetScalarType<T[P], AggregateWatchSize[P]>
  }




  export type WatchSizeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WatchSizeWhereInput
    orderBy?: WatchSizeOrderByWithAggregationInput | WatchSizeOrderByWithAggregationInput[]
    by: WatchSizeScalarFieldEnum[] | WatchSizeScalarFieldEnum
    having?: WatchSizeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WatchSizeCountAggregateInputType | true
    _avg?: WatchSizeAvgAggregateInputType
    _sum?: WatchSizeSumAggregateInputType
    _min?: WatchSizeMinAggregateInputType
    _max?: WatchSizeMaxAggregateInputType
  }

  export type WatchSizeGroupByOutputType = {
    id: number
    watch_size: string
    watchModelId: number
    _count: WatchSizeCountAggregateOutputType | null
    _avg: WatchSizeAvgAggregateOutputType | null
    _sum: WatchSizeSumAggregateOutputType | null
    _min: WatchSizeMinAggregateOutputType | null
    _max: WatchSizeMaxAggregateOutputType | null
  }

  type GetWatchSizeGroupByPayload<T extends WatchSizeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WatchSizeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WatchSizeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WatchSizeGroupByOutputType[P]>
            : GetScalarType<T[P], WatchSizeGroupByOutputType[P]>
        }
      >
    >


  export type WatchSizeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    watch_size?: boolean
    watchModelId?: boolean
    watchModel?: boolean | WatchModelDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["watchSize"]>

  export type WatchSizeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    watch_size?: boolean
    watchModelId?: boolean
    watchModel?: boolean | WatchModelDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["watchSize"]>

  export type WatchSizeSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    watch_size?: boolean
    watchModelId?: boolean
    watchModel?: boolean | WatchModelDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["watchSize"]>

  export type WatchSizeSelectScalar = {
    id?: boolean
    watch_size?: boolean
    watchModelId?: boolean
  }

  export type WatchSizeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "watch_size" | "watchModelId", ExtArgs["result"]["watchSize"]>
  export type WatchSizeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    watchModel?: boolean | WatchModelDefaultArgs<ExtArgs>
  }
  export type WatchSizeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    watchModel?: boolean | WatchModelDefaultArgs<ExtArgs>
  }
  export type WatchSizeIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    watchModel?: boolean | WatchModelDefaultArgs<ExtArgs>
  }

  export type $WatchSizePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "WatchSize"
    objects: {
      watchModel: Prisma.$WatchModelPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      watch_size: string
      watchModelId: number
    }, ExtArgs["result"]["watchSize"]>
    composites: {}
  }

  type WatchSizeGetPayload<S extends boolean | null | undefined | WatchSizeDefaultArgs> = $Result.GetResult<Prisma.$WatchSizePayload, S>

  type WatchSizeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WatchSizeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: WatchSizeCountAggregateInputType | true
    }

  export interface WatchSizeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['WatchSize'], meta: { name: 'WatchSize' } }
    /**
     * Find zero or one WatchSize that matches the filter.
     * @param {WatchSizeFindUniqueArgs} args - Arguments to find a WatchSize
     * @example
     * // Get one WatchSize
     * const watchSize = await prisma.watchSize.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WatchSizeFindUniqueArgs>(args: SelectSubset<T, WatchSizeFindUniqueArgs<ExtArgs>>): Prisma__WatchSizeClient<$Result.GetResult<Prisma.$WatchSizePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one WatchSize that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WatchSizeFindUniqueOrThrowArgs} args - Arguments to find a WatchSize
     * @example
     * // Get one WatchSize
     * const watchSize = await prisma.watchSize.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WatchSizeFindUniqueOrThrowArgs>(args: SelectSubset<T, WatchSizeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WatchSizeClient<$Result.GetResult<Prisma.$WatchSizePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WatchSize that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WatchSizeFindFirstArgs} args - Arguments to find a WatchSize
     * @example
     * // Get one WatchSize
     * const watchSize = await prisma.watchSize.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WatchSizeFindFirstArgs>(args?: SelectSubset<T, WatchSizeFindFirstArgs<ExtArgs>>): Prisma__WatchSizeClient<$Result.GetResult<Prisma.$WatchSizePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WatchSize that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WatchSizeFindFirstOrThrowArgs} args - Arguments to find a WatchSize
     * @example
     * // Get one WatchSize
     * const watchSize = await prisma.watchSize.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WatchSizeFindFirstOrThrowArgs>(args?: SelectSubset<T, WatchSizeFindFirstOrThrowArgs<ExtArgs>>): Prisma__WatchSizeClient<$Result.GetResult<Prisma.$WatchSizePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more WatchSizes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WatchSizeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all WatchSizes
     * const watchSizes = await prisma.watchSize.findMany()
     * 
     * // Get first 10 WatchSizes
     * const watchSizes = await prisma.watchSize.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const watchSizeWithIdOnly = await prisma.watchSize.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WatchSizeFindManyArgs>(args?: SelectSubset<T, WatchSizeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WatchSizePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a WatchSize.
     * @param {WatchSizeCreateArgs} args - Arguments to create a WatchSize.
     * @example
     * // Create one WatchSize
     * const WatchSize = await prisma.watchSize.create({
     *   data: {
     *     // ... data to create a WatchSize
     *   }
     * })
     * 
     */
    create<T extends WatchSizeCreateArgs>(args: SelectSubset<T, WatchSizeCreateArgs<ExtArgs>>): Prisma__WatchSizeClient<$Result.GetResult<Prisma.$WatchSizePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many WatchSizes.
     * @param {WatchSizeCreateManyArgs} args - Arguments to create many WatchSizes.
     * @example
     * // Create many WatchSizes
     * const watchSize = await prisma.watchSize.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WatchSizeCreateManyArgs>(args?: SelectSubset<T, WatchSizeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many WatchSizes and returns the data saved in the database.
     * @param {WatchSizeCreateManyAndReturnArgs} args - Arguments to create many WatchSizes.
     * @example
     * // Create many WatchSizes
     * const watchSize = await prisma.watchSize.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many WatchSizes and only return the `id`
     * const watchSizeWithIdOnly = await prisma.watchSize.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WatchSizeCreateManyAndReturnArgs>(args?: SelectSubset<T, WatchSizeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WatchSizePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a WatchSize.
     * @param {WatchSizeDeleteArgs} args - Arguments to delete one WatchSize.
     * @example
     * // Delete one WatchSize
     * const WatchSize = await prisma.watchSize.delete({
     *   where: {
     *     // ... filter to delete one WatchSize
     *   }
     * })
     * 
     */
    delete<T extends WatchSizeDeleteArgs>(args: SelectSubset<T, WatchSizeDeleteArgs<ExtArgs>>): Prisma__WatchSizeClient<$Result.GetResult<Prisma.$WatchSizePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one WatchSize.
     * @param {WatchSizeUpdateArgs} args - Arguments to update one WatchSize.
     * @example
     * // Update one WatchSize
     * const watchSize = await prisma.watchSize.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WatchSizeUpdateArgs>(args: SelectSubset<T, WatchSizeUpdateArgs<ExtArgs>>): Prisma__WatchSizeClient<$Result.GetResult<Prisma.$WatchSizePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more WatchSizes.
     * @param {WatchSizeDeleteManyArgs} args - Arguments to filter WatchSizes to delete.
     * @example
     * // Delete a few WatchSizes
     * const { count } = await prisma.watchSize.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WatchSizeDeleteManyArgs>(args?: SelectSubset<T, WatchSizeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WatchSizes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WatchSizeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many WatchSizes
     * const watchSize = await prisma.watchSize.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WatchSizeUpdateManyArgs>(args: SelectSubset<T, WatchSizeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WatchSizes and returns the data updated in the database.
     * @param {WatchSizeUpdateManyAndReturnArgs} args - Arguments to update many WatchSizes.
     * @example
     * // Update many WatchSizes
     * const watchSize = await prisma.watchSize.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more WatchSizes and only return the `id`
     * const watchSizeWithIdOnly = await prisma.watchSize.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends WatchSizeUpdateManyAndReturnArgs>(args: SelectSubset<T, WatchSizeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WatchSizePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one WatchSize.
     * @param {WatchSizeUpsertArgs} args - Arguments to update or create a WatchSize.
     * @example
     * // Update or create a WatchSize
     * const watchSize = await prisma.watchSize.upsert({
     *   create: {
     *     // ... data to create a WatchSize
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the WatchSize we want to update
     *   }
     * })
     */
    upsert<T extends WatchSizeUpsertArgs>(args: SelectSubset<T, WatchSizeUpsertArgs<ExtArgs>>): Prisma__WatchSizeClient<$Result.GetResult<Prisma.$WatchSizePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of WatchSizes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WatchSizeCountArgs} args - Arguments to filter WatchSizes to count.
     * @example
     * // Count the number of WatchSizes
     * const count = await prisma.watchSize.count({
     *   where: {
     *     // ... the filter for the WatchSizes we want to count
     *   }
     * })
    **/
    count<T extends WatchSizeCountArgs>(
      args?: Subset<T, WatchSizeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WatchSizeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a WatchSize.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WatchSizeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WatchSizeAggregateArgs>(args: Subset<T, WatchSizeAggregateArgs>): Prisma.PrismaPromise<GetWatchSizeAggregateType<T>>

    /**
     * Group by WatchSize.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WatchSizeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WatchSizeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WatchSizeGroupByArgs['orderBy'] }
        : { orderBy?: WatchSizeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WatchSizeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWatchSizeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the WatchSize model
   */
  readonly fields: WatchSizeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for WatchSize.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WatchSizeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    watchModel<T extends WatchModelDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WatchModelDefaultArgs<ExtArgs>>): Prisma__WatchModelClient<$Result.GetResult<Prisma.$WatchModelPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the WatchSize model
   */
  interface WatchSizeFieldRefs {
    readonly id: FieldRef<"WatchSize", 'Int'>
    readonly watch_size: FieldRef<"WatchSize", 'String'>
    readonly watchModelId: FieldRef<"WatchSize", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * WatchSize findUnique
   */
  export type WatchSizeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WatchSize
     */
    select?: WatchSizeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WatchSize
     */
    omit?: WatchSizeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WatchSizeInclude<ExtArgs> | null
    /**
     * Filter, which WatchSize to fetch.
     */
    where: WatchSizeWhereUniqueInput
  }

  /**
   * WatchSize findUniqueOrThrow
   */
  export type WatchSizeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WatchSize
     */
    select?: WatchSizeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WatchSize
     */
    omit?: WatchSizeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WatchSizeInclude<ExtArgs> | null
    /**
     * Filter, which WatchSize to fetch.
     */
    where: WatchSizeWhereUniqueInput
  }

  /**
   * WatchSize findFirst
   */
  export type WatchSizeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WatchSize
     */
    select?: WatchSizeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WatchSize
     */
    omit?: WatchSizeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WatchSizeInclude<ExtArgs> | null
    /**
     * Filter, which WatchSize to fetch.
     */
    where?: WatchSizeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WatchSizes to fetch.
     */
    orderBy?: WatchSizeOrderByWithRelationInput | WatchSizeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WatchSizes.
     */
    cursor?: WatchSizeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WatchSizes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WatchSizes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WatchSizes.
     */
    distinct?: WatchSizeScalarFieldEnum | WatchSizeScalarFieldEnum[]
  }

  /**
   * WatchSize findFirstOrThrow
   */
  export type WatchSizeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WatchSize
     */
    select?: WatchSizeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WatchSize
     */
    omit?: WatchSizeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WatchSizeInclude<ExtArgs> | null
    /**
     * Filter, which WatchSize to fetch.
     */
    where?: WatchSizeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WatchSizes to fetch.
     */
    orderBy?: WatchSizeOrderByWithRelationInput | WatchSizeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WatchSizes.
     */
    cursor?: WatchSizeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WatchSizes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WatchSizes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WatchSizes.
     */
    distinct?: WatchSizeScalarFieldEnum | WatchSizeScalarFieldEnum[]
  }

  /**
   * WatchSize findMany
   */
  export type WatchSizeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WatchSize
     */
    select?: WatchSizeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WatchSize
     */
    omit?: WatchSizeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WatchSizeInclude<ExtArgs> | null
    /**
     * Filter, which WatchSizes to fetch.
     */
    where?: WatchSizeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WatchSizes to fetch.
     */
    orderBy?: WatchSizeOrderByWithRelationInput | WatchSizeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing WatchSizes.
     */
    cursor?: WatchSizeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WatchSizes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WatchSizes.
     */
    skip?: number
    distinct?: WatchSizeScalarFieldEnum | WatchSizeScalarFieldEnum[]
  }

  /**
   * WatchSize create
   */
  export type WatchSizeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WatchSize
     */
    select?: WatchSizeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WatchSize
     */
    omit?: WatchSizeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WatchSizeInclude<ExtArgs> | null
    /**
     * The data needed to create a WatchSize.
     */
    data: XOR<WatchSizeCreateInput, WatchSizeUncheckedCreateInput>
  }

  /**
   * WatchSize createMany
   */
  export type WatchSizeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many WatchSizes.
     */
    data: WatchSizeCreateManyInput | WatchSizeCreateManyInput[]
  }

  /**
   * WatchSize createManyAndReturn
   */
  export type WatchSizeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WatchSize
     */
    select?: WatchSizeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WatchSize
     */
    omit?: WatchSizeOmit<ExtArgs> | null
    /**
     * The data used to create many WatchSizes.
     */
    data: WatchSizeCreateManyInput | WatchSizeCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WatchSizeIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * WatchSize update
   */
  export type WatchSizeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WatchSize
     */
    select?: WatchSizeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WatchSize
     */
    omit?: WatchSizeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WatchSizeInclude<ExtArgs> | null
    /**
     * The data needed to update a WatchSize.
     */
    data: XOR<WatchSizeUpdateInput, WatchSizeUncheckedUpdateInput>
    /**
     * Choose, which WatchSize to update.
     */
    where: WatchSizeWhereUniqueInput
  }

  /**
   * WatchSize updateMany
   */
  export type WatchSizeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update WatchSizes.
     */
    data: XOR<WatchSizeUpdateManyMutationInput, WatchSizeUncheckedUpdateManyInput>
    /**
     * Filter which WatchSizes to update
     */
    where?: WatchSizeWhereInput
    /**
     * Limit how many WatchSizes to update.
     */
    limit?: number
  }

  /**
   * WatchSize updateManyAndReturn
   */
  export type WatchSizeUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WatchSize
     */
    select?: WatchSizeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WatchSize
     */
    omit?: WatchSizeOmit<ExtArgs> | null
    /**
     * The data used to update WatchSizes.
     */
    data: XOR<WatchSizeUpdateManyMutationInput, WatchSizeUncheckedUpdateManyInput>
    /**
     * Filter which WatchSizes to update
     */
    where?: WatchSizeWhereInput
    /**
     * Limit how many WatchSizes to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WatchSizeIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * WatchSize upsert
   */
  export type WatchSizeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WatchSize
     */
    select?: WatchSizeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WatchSize
     */
    omit?: WatchSizeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WatchSizeInclude<ExtArgs> | null
    /**
     * The filter to search for the WatchSize to update in case it exists.
     */
    where: WatchSizeWhereUniqueInput
    /**
     * In case the WatchSize found by the `where` argument doesn't exist, create a new WatchSize with this data.
     */
    create: XOR<WatchSizeCreateInput, WatchSizeUncheckedCreateInput>
    /**
     * In case the WatchSize was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WatchSizeUpdateInput, WatchSizeUncheckedUpdateInput>
  }

  /**
   * WatchSize delete
   */
  export type WatchSizeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WatchSize
     */
    select?: WatchSizeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WatchSize
     */
    omit?: WatchSizeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WatchSizeInclude<ExtArgs> | null
    /**
     * Filter which WatchSize to delete.
     */
    where: WatchSizeWhereUniqueInput
  }

  /**
   * WatchSize deleteMany
   */
  export type WatchSizeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WatchSizes to delete
     */
    where?: WatchSizeWhereInput
    /**
     * Limit how many WatchSizes to delete.
     */
    limit?: number
  }

  /**
   * WatchSize without action
   */
  export type WatchSizeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WatchSize
     */
    select?: WatchSizeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WatchSize
     */
    omit?: WatchSizeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WatchSizeInclude<ExtArgs> | null
  }


  /**
   * Model FrameColor
   */

  export type AggregateFrameColor = {
    _count: FrameColorCountAggregateOutputType | null
    _avg: FrameColorAvgAggregateOutputType | null
    _sum: FrameColorSumAggregateOutputType | null
    _min: FrameColorMinAggregateOutputType | null
    _max: FrameColorMaxAggregateOutputType | null
  }

  export type FrameColorAvgAggregateOutputType = {
    id: number | null
    watchModelId: number | null
  }

  export type FrameColorSumAggregateOutputType = {
    id: number | null
    watchModelId: number | null
  }

  export type FrameColorMinAggregateOutputType = {
    id: number | null
    color_name: string | null
    color_code: string | null
    watchModelId: number | null
  }

  export type FrameColorMaxAggregateOutputType = {
    id: number | null
    color_name: string | null
    color_code: string | null
    watchModelId: number | null
  }

  export type FrameColorCountAggregateOutputType = {
    id: number
    color_name: number
    color_code: number
    watchModelId: number
    _all: number
  }


  export type FrameColorAvgAggregateInputType = {
    id?: true
    watchModelId?: true
  }

  export type FrameColorSumAggregateInputType = {
    id?: true
    watchModelId?: true
  }

  export type FrameColorMinAggregateInputType = {
    id?: true
    color_name?: true
    color_code?: true
    watchModelId?: true
  }

  export type FrameColorMaxAggregateInputType = {
    id?: true
    color_name?: true
    color_code?: true
    watchModelId?: true
  }

  export type FrameColorCountAggregateInputType = {
    id?: true
    color_name?: true
    color_code?: true
    watchModelId?: true
    _all?: true
  }

  export type FrameColorAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FrameColor to aggregate.
     */
    where?: FrameColorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FrameColors to fetch.
     */
    orderBy?: FrameColorOrderByWithRelationInput | FrameColorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FrameColorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FrameColors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FrameColors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned FrameColors
    **/
    _count?: true | FrameColorCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FrameColorAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FrameColorSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FrameColorMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FrameColorMaxAggregateInputType
  }

  export type GetFrameColorAggregateType<T extends FrameColorAggregateArgs> = {
        [P in keyof T & keyof AggregateFrameColor]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFrameColor[P]>
      : GetScalarType<T[P], AggregateFrameColor[P]>
  }




  export type FrameColorGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FrameColorWhereInput
    orderBy?: FrameColorOrderByWithAggregationInput | FrameColorOrderByWithAggregationInput[]
    by: FrameColorScalarFieldEnum[] | FrameColorScalarFieldEnum
    having?: FrameColorScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FrameColorCountAggregateInputType | true
    _avg?: FrameColorAvgAggregateInputType
    _sum?: FrameColorSumAggregateInputType
    _min?: FrameColorMinAggregateInputType
    _max?: FrameColorMaxAggregateInputType
  }

  export type FrameColorGroupByOutputType = {
    id: number
    color_name: string
    color_code: string | null
    watchModelId: number
    _count: FrameColorCountAggregateOutputType | null
    _avg: FrameColorAvgAggregateOutputType | null
    _sum: FrameColorSumAggregateOutputType | null
    _min: FrameColorMinAggregateOutputType | null
    _max: FrameColorMaxAggregateOutputType | null
  }

  type GetFrameColorGroupByPayload<T extends FrameColorGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FrameColorGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FrameColorGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FrameColorGroupByOutputType[P]>
            : GetScalarType<T[P], FrameColorGroupByOutputType[P]>
        }
      >
    >


  export type FrameColorSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    color_name?: boolean
    color_code?: boolean
    watchModelId?: boolean
    watchModel?: boolean | WatchModelDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["frameColor"]>

  export type FrameColorSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    color_name?: boolean
    color_code?: boolean
    watchModelId?: boolean
    watchModel?: boolean | WatchModelDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["frameColor"]>

  export type FrameColorSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    color_name?: boolean
    color_code?: boolean
    watchModelId?: boolean
    watchModel?: boolean | WatchModelDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["frameColor"]>

  export type FrameColorSelectScalar = {
    id?: boolean
    color_name?: boolean
    color_code?: boolean
    watchModelId?: boolean
  }

  export type FrameColorOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "color_name" | "color_code" | "watchModelId", ExtArgs["result"]["frameColor"]>
  export type FrameColorInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    watchModel?: boolean | WatchModelDefaultArgs<ExtArgs>
  }
  export type FrameColorIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    watchModel?: boolean | WatchModelDefaultArgs<ExtArgs>
  }
  export type FrameColorIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    watchModel?: boolean | WatchModelDefaultArgs<ExtArgs>
  }

  export type $FrameColorPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "FrameColor"
    objects: {
      watchModel: Prisma.$WatchModelPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      color_name: string
      color_code: string | null
      watchModelId: number
    }, ExtArgs["result"]["frameColor"]>
    composites: {}
  }

  type FrameColorGetPayload<S extends boolean | null | undefined | FrameColorDefaultArgs> = $Result.GetResult<Prisma.$FrameColorPayload, S>

  type FrameColorCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FrameColorFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FrameColorCountAggregateInputType | true
    }

  export interface FrameColorDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['FrameColor'], meta: { name: 'FrameColor' } }
    /**
     * Find zero or one FrameColor that matches the filter.
     * @param {FrameColorFindUniqueArgs} args - Arguments to find a FrameColor
     * @example
     * // Get one FrameColor
     * const frameColor = await prisma.frameColor.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FrameColorFindUniqueArgs>(args: SelectSubset<T, FrameColorFindUniqueArgs<ExtArgs>>): Prisma__FrameColorClient<$Result.GetResult<Prisma.$FrameColorPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one FrameColor that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FrameColorFindUniqueOrThrowArgs} args - Arguments to find a FrameColor
     * @example
     * // Get one FrameColor
     * const frameColor = await prisma.frameColor.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FrameColorFindUniqueOrThrowArgs>(args: SelectSubset<T, FrameColorFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FrameColorClient<$Result.GetResult<Prisma.$FrameColorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FrameColor that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FrameColorFindFirstArgs} args - Arguments to find a FrameColor
     * @example
     * // Get one FrameColor
     * const frameColor = await prisma.frameColor.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FrameColorFindFirstArgs>(args?: SelectSubset<T, FrameColorFindFirstArgs<ExtArgs>>): Prisma__FrameColorClient<$Result.GetResult<Prisma.$FrameColorPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FrameColor that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FrameColorFindFirstOrThrowArgs} args - Arguments to find a FrameColor
     * @example
     * // Get one FrameColor
     * const frameColor = await prisma.frameColor.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FrameColorFindFirstOrThrowArgs>(args?: SelectSubset<T, FrameColorFindFirstOrThrowArgs<ExtArgs>>): Prisma__FrameColorClient<$Result.GetResult<Prisma.$FrameColorPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more FrameColors that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FrameColorFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FrameColors
     * const frameColors = await prisma.frameColor.findMany()
     * 
     * // Get first 10 FrameColors
     * const frameColors = await prisma.frameColor.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const frameColorWithIdOnly = await prisma.frameColor.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FrameColorFindManyArgs>(args?: SelectSubset<T, FrameColorFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FrameColorPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a FrameColor.
     * @param {FrameColorCreateArgs} args - Arguments to create a FrameColor.
     * @example
     * // Create one FrameColor
     * const FrameColor = await prisma.frameColor.create({
     *   data: {
     *     // ... data to create a FrameColor
     *   }
     * })
     * 
     */
    create<T extends FrameColorCreateArgs>(args: SelectSubset<T, FrameColorCreateArgs<ExtArgs>>): Prisma__FrameColorClient<$Result.GetResult<Prisma.$FrameColorPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many FrameColors.
     * @param {FrameColorCreateManyArgs} args - Arguments to create many FrameColors.
     * @example
     * // Create many FrameColors
     * const frameColor = await prisma.frameColor.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FrameColorCreateManyArgs>(args?: SelectSubset<T, FrameColorCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many FrameColors and returns the data saved in the database.
     * @param {FrameColorCreateManyAndReturnArgs} args - Arguments to create many FrameColors.
     * @example
     * // Create many FrameColors
     * const frameColor = await prisma.frameColor.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many FrameColors and only return the `id`
     * const frameColorWithIdOnly = await prisma.frameColor.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FrameColorCreateManyAndReturnArgs>(args?: SelectSubset<T, FrameColorCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FrameColorPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a FrameColor.
     * @param {FrameColorDeleteArgs} args - Arguments to delete one FrameColor.
     * @example
     * // Delete one FrameColor
     * const FrameColor = await prisma.frameColor.delete({
     *   where: {
     *     // ... filter to delete one FrameColor
     *   }
     * })
     * 
     */
    delete<T extends FrameColorDeleteArgs>(args: SelectSubset<T, FrameColorDeleteArgs<ExtArgs>>): Prisma__FrameColorClient<$Result.GetResult<Prisma.$FrameColorPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one FrameColor.
     * @param {FrameColorUpdateArgs} args - Arguments to update one FrameColor.
     * @example
     * // Update one FrameColor
     * const frameColor = await prisma.frameColor.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FrameColorUpdateArgs>(args: SelectSubset<T, FrameColorUpdateArgs<ExtArgs>>): Prisma__FrameColorClient<$Result.GetResult<Prisma.$FrameColorPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more FrameColors.
     * @param {FrameColorDeleteManyArgs} args - Arguments to filter FrameColors to delete.
     * @example
     * // Delete a few FrameColors
     * const { count } = await prisma.frameColor.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FrameColorDeleteManyArgs>(args?: SelectSubset<T, FrameColorDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FrameColors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FrameColorUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FrameColors
     * const frameColor = await prisma.frameColor.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FrameColorUpdateManyArgs>(args: SelectSubset<T, FrameColorUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FrameColors and returns the data updated in the database.
     * @param {FrameColorUpdateManyAndReturnArgs} args - Arguments to update many FrameColors.
     * @example
     * // Update many FrameColors
     * const frameColor = await prisma.frameColor.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more FrameColors and only return the `id`
     * const frameColorWithIdOnly = await prisma.frameColor.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends FrameColorUpdateManyAndReturnArgs>(args: SelectSubset<T, FrameColorUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FrameColorPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one FrameColor.
     * @param {FrameColorUpsertArgs} args - Arguments to update or create a FrameColor.
     * @example
     * // Update or create a FrameColor
     * const frameColor = await prisma.frameColor.upsert({
     *   create: {
     *     // ... data to create a FrameColor
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FrameColor we want to update
     *   }
     * })
     */
    upsert<T extends FrameColorUpsertArgs>(args: SelectSubset<T, FrameColorUpsertArgs<ExtArgs>>): Prisma__FrameColorClient<$Result.GetResult<Prisma.$FrameColorPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of FrameColors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FrameColorCountArgs} args - Arguments to filter FrameColors to count.
     * @example
     * // Count the number of FrameColors
     * const count = await prisma.frameColor.count({
     *   where: {
     *     // ... the filter for the FrameColors we want to count
     *   }
     * })
    **/
    count<T extends FrameColorCountArgs>(
      args?: Subset<T, FrameColorCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FrameColorCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a FrameColor.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FrameColorAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FrameColorAggregateArgs>(args: Subset<T, FrameColorAggregateArgs>): Prisma.PrismaPromise<GetFrameColorAggregateType<T>>

    /**
     * Group by FrameColor.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FrameColorGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FrameColorGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FrameColorGroupByArgs['orderBy'] }
        : { orderBy?: FrameColorGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FrameColorGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFrameColorGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the FrameColor model
   */
  readonly fields: FrameColorFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for FrameColor.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FrameColorClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    watchModel<T extends WatchModelDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WatchModelDefaultArgs<ExtArgs>>): Prisma__WatchModelClient<$Result.GetResult<Prisma.$WatchModelPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the FrameColor model
   */
  interface FrameColorFieldRefs {
    readonly id: FieldRef<"FrameColor", 'Int'>
    readonly color_name: FieldRef<"FrameColor", 'String'>
    readonly color_code: FieldRef<"FrameColor", 'String'>
    readonly watchModelId: FieldRef<"FrameColor", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * FrameColor findUnique
   */
  export type FrameColorFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FrameColor
     */
    select?: FrameColorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FrameColor
     */
    omit?: FrameColorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FrameColorInclude<ExtArgs> | null
    /**
     * Filter, which FrameColor to fetch.
     */
    where: FrameColorWhereUniqueInput
  }

  /**
   * FrameColor findUniqueOrThrow
   */
  export type FrameColorFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FrameColor
     */
    select?: FrameColorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FrameColor
     */
    omit?: FrameColorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FrameColorInclude<ExtArgs> | null
    /**
     * Filter, which FrameColor to fetch.
     */
    where: FrameColorWhereUniqueInput
  }

  /**
   * FrameColor findFirst
   */
  export type FrameColorFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FrameColor
     */
    select?: FrameColorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FrameColor
     */
    omit?: FrameColorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FrameColorInclude<ExtArgs> | null
    /**
     * Filter, which FrameColor to fetch.
     */
    where?: FrameColorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FrameColors to fetch.
     */
    orderBy?: FrameColorOrderByWithRelationInput | FrameColorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FrameColors.
     */
    cursor?: FrameColorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FrameColors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FrameColors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FrameColors.
     */
    distinct?: FrameColorScalarFieldEnum | FrameColorScalarFieldEnum[]
  }

  /**
   * FrameColor findFirstOrThrow
   */
  export type FrameColorFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FrameColor
     */
    select?: FrameColorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FrameColor
     */
    omit?: FrameColorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FrameColorInclude<ExtArgs> | null
    /**
     * Filter, which FrameColor to fetch.
     */
    where?: FrameColorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FrameColors to fetch.
     */
    orderBy?: FrameColorOrderByWithRelationInput | FrameColorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FrameColors.
     */
    cursor?: FrameColorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FrameColors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FrameColors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FrameColors.
     */
    distinct?: FrameColorScalarFieldEnum | FrameColorScalarFieldEnum[]
  }

  /**
   * FrameColor findMany
   */
  export type FrameColorFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FrameColor
     */
    select?: FrameColorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FrameColor
     */
    omit?: FrameColorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FrameColorInclude<ExtArgs> | null
    /**
     * Filter, which FrameColors to fetch.
     */
    where?: FrameColorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FrameColors to fetch.
     */
    orderBy?: FrameColorOrderByWithRelationInput | FrameColorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing FrameColors.
     */
    cursor?: FrameColorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FrameColors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FrameColors.
     */
    skip?: number
    distinct?: FrameColorScalarFieldEnum | FrameColorScalarFieldEnum[]
  }

  /**
   * FrameColor create
   */
  export type FrameColorCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FrameColor
     */
    select?: FrameColorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FrameColor
     */
    omit?: FrameColorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FrameColorInclude<ExtArgs> | null
    /**
     * The data needed to create a FrameColor.
     */
    data: XOR<FrameColorCreateInput, FrameColorUncheckedCreateInput>
  }

  /**
   * FrameColor createMany
   */
  export type FrameColorCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many FrameColors.
     */
    data: FrameColorCreateManyInput | FrameColorCreateManyInput[]
  }

  /**
   * FrameColor createManyAndReturn
   */
  export type FrameColorCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FrameColor
     */
    select?: FrameColorSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FrameColor
     */
    omit?: FrameColorOmit<ExtArgs> | null
    /**
     * The data used to create many FrameColors.
     */
    data: FrameColorCreateManyInput | FrameColorCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FrameColorIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * FrameColor update
   */
  export type FrameColorUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FrameColor
     */
    select?: FrameColorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FrameColor
     */
    omit?: FrameColorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FrameColorInclude<ExtArgs> | null
    /**
     * The data needed to update a FrameColor.
     */
    data: XOR<FrameColorUpdateInput, FrameColorUncheckedUpdateInput>
    /**
     * Choose, which FrameColor to update.
     */
    where: FrameColorWhereUniqueInput
  }

  /**
   * FrameColor updateMany
   */
  export type FrameColorUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update FrameColors.
     */
    data: XOR<FrameColorUpdateManyMutationInput, FrameColorUncheckedUpdateManyInput>
    /**
     * Filter which FrameColors to update
     */
    where?: FrameColorWhereInput
    /**
     * Limit how many FrameColors to update.
     */
    limit?: number
  }

  /**
   * FrameColor updateManyAndReturn
   */
  export type FrameColorUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FrameColor
     */
    select?: FrameColorSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FrameColor
     */
    omit?: FrameColorOmit<ExtArgs> | null
    /**
     * The data used to update FrameColors.
     */
    data: XOR<FrameColorUpdateManyMutationInput, FrameColorUncheckedUpdateManyInput>
    /**
     * Filter which FrameColors to update
     */
    where?: FrameColorWhereInput
    /**
     * Limit how many FrameColors to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FrameColorIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * FrameColor upsert
   */
  export type FrameColorUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FrameColor
     */
    select?: FrameColorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FrameColor
     */
    omit?: FrameColorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FrameColorInclude<ExtArgs> | null
    /**
     * The filter to search for the FrameColor to update in case it exists.
     */
    where: FrameColorWhereUniqueInput
    /**
     * In case the FrameColor found by the `where` argument doesn't exist, create a new FrameColor with this data.
     */
    create: XOR<FrameColorCreateInput, FrameColorUncheckedCreateInput>
    /**
     * In case the FrameColor was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FrameColorUpdateInput, FrameColorUncheckedUpdateInput>
  }

  /**
   * FrameColor delete
   */
  export type FrameColorDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FrameColor
     */
    select?: FrameColorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FrameColor
     */
    omit?: FrameColorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FrameColorInclude<ExtArgs> | null
    /**
     * Filter which FrameColor to delete.
     */
    where: FrameColorWhereUniqueInput
  }

  /**
   * FrameColor deleteMany
   */
  export type FrameColorDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FrameColors to delete
     */
    where?: FrameColorWhereInput
    /**
     * Limit how many FrameColors to delete.
     */
    limit?: number
  }

  /**
   * FrameColor without action
   */
  export type FrameColorDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FrameColor
     */
    select?: FrameColorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FrameColor
     */
    omit?: FrameColorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FrameColorInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const WatchModelScalarFieldEnum: {
    id: 'id',
    model_name: 'model_name',
    watch_model_name: 'watch_model_name',
    watch_model_manufacturer: 'watch_model_manufacturer',
    main_image: 'main_image',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type WatchModelScalarFieldEnum = (typeof WatchModelScalarFieldEnum)[keyof typeof WatchModelScalarFieldEnum]


  export const WatchSizeScalarFieldEnum: {
    id: 'id',
    watch_size: 'watch_size',
    watchModelId: 'watchModelId'
  };

  export type WatchSizeScalarFieldEnum = (typeof WatchSizeScalarFieldEnum)[keyof typeof WatchSizeScalarFieldEnum]


  export const FrameColorScalarFieldEnum: {
    id: 'id',
    color_name: 'color_name',
    color_code: 'color_code',
    watchModelId: 'watchModelId'
  };

  export type FrameColorScalarFieldEnum = (typeof FrameColorScalarFieldEnum)[keyof typeof FrameColorScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type WatchModelWhereInput = {
    AND?: WatchModelWhereInput | WatchModelWhereInput[]
    OR?: WatchModelWhereInput[]
    NOT?: WatchModelWhereInput | WatchModelWhereInput[]
    id?: IntFilter<"WatchModel"> | number
    model_name?: StringFilter<"WatchModel"> | string
    watch_model_name?: StringFilter<"WatchModel"> | string
    watch_model_manufacturer?: StringNullableFilter<"WatchModel"> | string | null
    main_image?: StringNullableFilter<"WatchModel"> | string | null
    createdAt?: DateTimeFilter<"WatchModel"> | Date | string
    updatedAt?: DateTimeFilter<"WatchModel"> | Date | string
    watch_sizes?: WatchSizeListRelationFilter
    frame_colors?: FrameColorListRelationFilter
  }

  export type WatchModelOrderByWithRelationInput = {
    id?: SortOrder
    model_name?: SortOrder
    watch_model_name?: SortOrder
    watch_model_manufacturer?: SortOrderInput | SortOrder
    main_image?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    watch_sizes?: WatchSizeOrderByRelationAggregateInput
    frame_colors?: FrameColorOrderByRelationAggregateInput
  }

  export type WatchModelWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    watch_model_name?: string
    AND?: WatchModelWhereInput | WatchModelWhereInput[]
    OR?: WatchModelWhereInput[]
    NOT?: WatchModelWhereInput | WatchModelWhereInput[]
    model_name?: StringFilter<"WatchModel"> | string
    watch_model_manufacturer?: StringNullableFilter<"WatchModel"> | string | null
    main_image?: StringNullableFilter<"WatchModel"> | string | null
    createdAt?: DateTimeFilter<"WatchModel"> | Date | string
    updatedAt?: DateTimeFilter<"WatchModel"> | Date | string
    watch_sizes?: WatchSizeListRelationFilter
    frame_colors?: FrameColorListRelationFilter
  }, "id" | "watch_model_name">

  export type WatchModelOrderByWithAggregationInput = {
    id?: SortOrder
    model_name?: SortOrder
    watch_model_name?: SortOrder
    watch_model_manufacturer?: SortOrderInput | SortOrder
    main_image?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: WatchModelCountOrderByAggregateInput
    _avg?: WatchModelAvgOrderByAggregateInput
    _max?: WatchModelMaxOrderByAggregateInput
    _min?: WatchModelMinOrderByAggregateInput
    _sum?: WatchModelSumOrderByAggregateInput
  }

  export type WatchModelScalarWhereWithAggregatesInput = {
    AND?: WatchModelScalarWhereWithAggregatesInput | WatchModelScalarWhereWithAggregatesInput[]
    OR?: WatchModelScalarWhereWithAggregatesInput[]
    NOT?: WatchModelScalarWhereWithAggregatesInput | WatchModelScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"WatchModel"> | number
    model_name?: StringWithAggregatesFilter<"WatchModel"> | string
    watch_model_name?: StringWithAggregatesFilter<"WatchModel"> | string
    watch_model_manufacturer?: StringNullableWithAggregatesFilter<"WatchModel"> | string | null
    main_image?: StringNullableWithAggregatesFilter<"WatchModel"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"WatchModel"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"WatchModel"> | Date | string
  }

  export type WatchSizeWhereInput = {
    AND?: WatchSizeWhereInput | WatchSizeWhereInput[]
    OR?: WatchSizeWhereInput[]
    NOT?: WatchSizeWhereInput | WatchSizeWhereInput[]
    id?: IntFilter<"WatchSize"> | number
    watch_size?: StringFilter<"WatchSize"> | string
    watchModelId?: IntFilter<"WatchSize"> | number
    watchModel?: XOR<WatchModelScalarRelationFilter, WatchModelWhereInput>
  }

  export type WatchSizeOrderByWithRelationInput = {
    id?: SortOrder
    watch_size?: SortOrder
    watchModelId?: SortOrder
    watchModel?: WatchModelOrderByWithRelationInput
  }

  export type WatchSizeWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: WatchSizeWhereInput | WatchSizeWhereInput[]
    OR?: WatchSizeWhereInput[]
    NOT?: WatchSizeWhereInput | WatchSizeWhereInput[]
    watch_size?: StringFilter<"WatchSize"> | string
    watchModelId?: IntFilter<"WatchSize"> | number
    watchModel?: XOR<WatchModelScalarRelationFilter, WatchModelWhereInput>
  }, "id">

  export type WatchSizeOrderByWithAggregationInput = {
    id?: SortOrder
    watch_size?: SortOrder
    watchModelId?: SortOrder
    _count?: WatchSizeCountOrderByAggregateInput
    _avg?: WatchSizeAvgOrderByAggregateInput
    _max?: WatchSizeMaxOrderByAggregateInput
    _min?: WatchSizeMinOrderByAggregateInput
    _sum?: WatchSizeSumOrderByAggregateInput
  }

  export type WatchSizeScalarWhereWithAggregatesInput = {
    AND?: WatchSizeScalarWhereWithAggregatesInput | WatchSizeScalarWhereWithAggregatesInput[]
    OR?: WatchSizeScalarWhereWithAggregatesInput[]
    NOT?: WatchSizeScalarWhereWithAggregatesInput | WatchSizeScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"WatchSize"> | number
    watch_size?: StringWithAggregatesFilter<"WatchSize"> | string
    watchModelId?: IntWithAggregatesFilter<"WatchSize"> | number
  }

  export type FrameColorWhereInput = {
    AND?: FrameColorWhereInput | FrameColorWhereInput[]
    OR?: FrameColorWhereInput[]
    NOT?: FrameColorWhereInput | FrameColorWhereInput[]
    id?: IntFilter<"FrameColor"> | number
    color_name?: StringFilter<"FrameColor"> | string
    color_code?: StringNullableFilter<"FrameColor"> | string | null
    watchModelId?: IntFilter<"FrameColor"> | number
    watchModel?: XOR<WatchModelScalarRelationFilter, WatchModelWhereInput>
  }

  export type FrameColorOrderByWithRelationInput = {
    id?: SortOrder
    color_name?: SortOrder
    color_code?: SortOrderInput | SortOrder
    watchModelId?: SortOrder
    watchModel?: WatchModelOrderByWithRelationInput
  }

  export type FrameColorWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: FrameColorWhereInput | FrameColorWhereInput[]
    OR?: FrameColorWhereInput[]
    NOT?: FrameColorWhereInput | FrameColorWhereInput[]
    color_name?: StringFilter<"FrameColor"> | string
    color_code?: StringNullableFilter<"FrameColor"> | string | null
    watchModelId?: IntFilter<"FrameColor"> | number
    watchModel?: XOR<WatchModelScalarRelationFilter, WatchModelWhereInput>
  }, "id">

  export type FrameColorOrderByWithAggregationInput = {
    id?: SortOrder
    color_name?: SortOrder
    color_code?: SortOrderInput | SortOrder
    watchModelId?: SortOrder
    _count?: FrameColorCountOrderByAggregateInput
    _avg?: FrameColorAvgOrderByAggregateInput
    _max?: FrameColorMaxOrderByAggregateInput
    _min?: FrameColorMinOrderByAggregateInput
    _sum?: FrameColorSumOrderByAggregateInput
  }

  export type FrameColorScalarWhereWithAggregatesInput = {
    AND?: FrameColorScalarWhereWithAggregatesInput | FrameColorScalarWhereWithAggregatesInput[]
    OR?: FrameColorScalarWhereWithAggregatesInput[]
    NOT?: FrameColorScalarWhereWithAggregatesInput | FrameColorScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"FrameColor"> | number
    color_name?: StringWithAggregatesFilter<"FrameColor"> | string
    color_code?: StringNullableWithAggregatesFilter<"FrameColor"> | string | null
    watchModelId?: IntWithAggregatesFilter<"FrameColor"> | number
  }

  export type WatchModelCreateInput = {
    model_name: string
    watch_model_name: string
    watch_model_manufacturer?: string | null
    main_image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    watch_sizes?: WatchSizeCreateNestedManyWithoutWatchModelInput
    frame_colors?: FrameColorCreateNestedManyWithoutWatchModelInput
  }

  export type WatchModelUncheckedCreateInput = {
    id?: number
    model_name: string
    watch_model_name: string
    watch_model_manufacturer?: string | null
    main_image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    watch_sizes?: WatchSizeUncheckedCreateNestedManyWithoutWatchModelInput
    frame_colors?: FrameColorUncheckedCreateNestedManyWithoutWatchModelInput
  }

  export type WatchModelUpdateInput = {
    model_name?: StringFieldUpdateOperationsInput | string
    watch_model_name?: StringFieldUpdateOperationsInput | string
    watch_model_manufacturer?: NullableStringFieldUpdateOperationsInput | string | null
    main_image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    watch_sizes?: WatchSizeUpdateManyWithoutWatchModelNestedInput
    frame_colors?: FrameColorUpdateManyWithoutWatchModelNestedInput
  }

  export type WatchModelUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    model_name?: StringFieldUpdateOperationsInput | string
    watch_model_name?: StringFieldUpdateOperationsInput | string
    watch_model_manufacturer?: NullableStringFieldUpdateOperationsInput | string | null
    main_image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    watch_sizes?: WatchSizeUncheckedUpdateManyWithoutWatchModelNestedInput
    frame_colors?: FrameColorUncheckedUpdateManyWithoutWatchModelNestedInput
  }

  export type WatchModelCreateManyInput = {
    id?: number
    model_name: string
    watch_model_name: string
    watch_model_manufacturer?: string | null
    main_image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WatchModelUpdateManyMutationInput = {
    model_name?: StringFieldUpdateOperationsInput | string
    watch_model_name?: StringFieldUpdateOperationsInput | string
    watch_model_manufacturer?: NullableStringFieldUpdateOperationsInput | string | null
    main_image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WatchModelUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    model_name?: StringFieldUpdateOperationsInput | string
    watch_model_name?: StringFieldUpdateOperationsInput | string
    watch_model_manufacturer?: NullableStringFieldUpdateOperationsInput | string | null
    main_image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WatchSizeCreateInput = {
    watch_size: string
    watchModel: WatchModelCreateNestedOneWithoutWatch_sizesInput
  }

  export type WatchSizeUncheckedCreateInput = {
    id?: number
    watch_size: string
    watchModelId: number
  }

  export type WatchSizeUpdateInput = {
    watch_size?: StringFieldUpdateOperationsInput | string
    watchModel?: WatchModelUpdateOneRequiredWithoutWatch_sizesNestedInput
  }

  export type WatchSizeUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    watch_size?: StringFieldUpdateOperationsInput | string
    watchModelId?: IntFieldUpdateOperationsInput | number
  }

  export type WatchSizeCreateManyInput = {
    id?: number
    watch_size: string
    watchModelId: number
  }

  export type WatchSizeUpdateManyMutationInput = {
    watch_size?: StringFieldUpdateOperationsInput | string
  }

  export type WatchSizeUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    watch_size?: StringFieldUpdateOperationsInput | string
    watchModelId?: IntFieldUpdateOperationsInput | number
  }

  export type FrameColorCreateInput = {
    color_name: string
    color_code?: string | null
    watchModel: WatchModelCreateNestedOneWithoutFrame_colorsInput
  }

  export type FrameColorUncheckedCreateInput = {
    id?: number
    color_name: string
    color_code?: string | null
    watchModelId: number
  }

  export type FrameColorUpdateInput = {
    color_name?: StringFieldUpdateOperationsInput | string
    color_code?: NullableStringFieldUpdateOperationsInput | string | null
    watchModel?: WatchModelUpdateOneRequiredWithoutFrame_colorsNestedInput
  }

  export type FrameColorUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    color_name?: StringFieldUpdateOperationsInput | string
    color_code?: NullableStringFieldUpdateOperationsInput | string | null
    watchModelId?: IntFieldUpdateOperationsInput | number
  }

  export type FrameColorCreateManyInput = {
    id?: number
    color_name: string
    color_code?: string | null
    watchModelId: number
  }

  export type FrameColorUpdateManyMutationInput = {
    color_name?: StringFieldUpdateOperationsInput | string
    color_code?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type FrameColorUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    color_name?: StringFieldUpdateOperationsInput | string
    color_code?: NullableStringFieldUpdateOperationsInput | string | null
    watchModelId?: IntFieldUpdateOperationsInput | number
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type WatchSizeListRelationFilter = {
    every?: WatchSizeWhereInput
    some?: WatchSizeWhereInput
    none?: WatchSizeWhereInput
  }

  export type FrameColorListRelationFilter = {
    every?: FrameColorWhereInput
    some?: FrameColorWhereInput
    none?: FrameColorWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type WatchSizeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type FrameColorOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type WatchModelCountOrderByAggregateInput = {
    id?: SortOrder
    model_name?: SortOrder
    watch_model_name?: SortOrder
    watch_model_manufacturer?: SortOrder
    main_image?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WatchModelAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type WatchModelMaxOrderByAggregateInput = {
    id?: SortOrder
    model_name?: SortOrder
    watch_model_name?: SortOrder
    watch_model_manufacturer?: SortOrder
    main_image?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WatchModelMinOrderByAggregateInput = {
    id?: SortOrder
    model_name?: SortOrder
    watch_model_name?: SortOrder
    watch_model_manufacturer?: SortOrder
    main_image?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WatchModelSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type WatchModelScalarRelationFilter = {
    is?: WatchModelWhereInput
    isNot?: WatchModelWhereInput
  }

  export type WatchSizeCountOrderByAggregateInput = {
    id?: SortOrder
    watch_size?: SortOrder
    watchModelId?: SortOrder
  }

  export type WatchSizeAvgOrderByAggregateInput = {
    id?: SortOrder
    watchModelId?: SortOrder
  }

  export type WatchSizeMaxOrderByAggregateInput = {
    id?: SortOrder
    watch_size?: SortOrder
    watchModelId?: SortOrder
  }

  export type WatchSizeMinOrderByAggregateInput = {
    id?: SortOrder
    watch_size?: SortOrder
    watchModelId?: SortOrder
  }

  export type WatchSizeSumOrderByAggregateInput = {
    id?: SortOrder
    watchModelId?: SortOrder
  }

  export type FrameColorCountOrderByAggregateInput = {
    id?: SortOrder
    color_name?: SortOrder
    color_code?: SortOrder
    watchModelId?: SortOrder
  }

  export type FrameColorAvgOrderByAggregateInput = {
    id?: SortOrder
    watchModelId?: SortOrder
  }

  export type FrameColorMaxOrderByAggregateInput = {
    id?: SortOrder
    color_name?: SortOrder
    color_code?: SortOrder
    watchModelId?: SortOrder
  }

  export type FrameColorMinOrderByAggregateInput = {
    id?: SortOrder
    color_name?: SortOrder
    color_code?: SortOrder
    watchModelId?: SortOrder
  }

  export type FrameColorSumOrderByAggregateInput = {
    id?: SortOrder
    watchModelId?: SortOrder
  }

  export type WatchSizeCreateNestedManyWithoutWatchModelInput = {
    create?: XOR<WatchSizeCreateWithoutWatchModelInput, WatchSizeUncheckedCreateWithoutWatchModelInput> | WatchSizeCreateWithoutWatchModelInput[] | WatchSizeUncheckedCreateWithoutWatchModelInput[]
    connectOrCreate?: WatchSizeCreateOrConnectWithoutWatchModelInput | WatchSizeCreateOrConnectWithoutWatchModelInput[]
    createMany?: WatchSizeCreateManyWatchModelInputEnvelope
    connect?: WatchSizeWhereUniqueInput | WatchSizeWhereUniqueInput[]
  }

  export type FrameColorCreateNestedManyWithoutWatchModelInput = {
    create?: XOR<FrameColorCreateWithoutWatchModelInput, FrameColorUncheckedCreateWithoutWatchModelInput> | FrameColorCreateWithoutWatchModelInput[] | FrameColorUncheckedCreateWithoutWatchModelInput[]
    connectOrCreate?: FrameColorCreateOrConnectWithoutWatchModelInput | FrameColorCreateOrConnectWithoutWatchModelInput[]
    createMany?: FrameColorCreateManyWatchModelInputEnvelope
    connect?: FrameColorWhereUniqueInput | FrameColorWhereUniqueInput[]
  }

  export type WatchSizeUncheckedCreateNestedManyWithoutWatchModelInput = {
    create?: XOR<WatchSizeCreateWithoutWatchModelInput, WatchSizeUncheckedCreateWithoutWatchModelInput> | WatchSizeCreateWithoutWatchModelInput[] | WatchSizeUncheckedCreateWithoutWatchModelInput[]
    connectOrCreate?: WatchSizeCreateOrConnectWithoutWatchModelInput | WatchSizeCreateOrConnectWithoutWatchModelInput[]
    createMany?: WatchSizeCreateManyWatchModelInputEnvelope
    connect?: WatchSizeWhereUniqueInput | WatchSizeWhereUniqueInput[]
  }

  export type FrameColorUncheckedCreateNestedManyWithoutWatchModelInput = {
    create?: XOR<FrameColorCreateWithoutWatchModelInput, FrameColorUncheckedCreateWithoutWatchModelInput> | FrameColorCreateWithoutWatchModelInput[] | FrameColorUncheckedCreateWithoutWatchModelInput[]
    connectOrCreate?: FrameColorCreateOrConnectWithoutWatchModelInput | FrameColorCreateOrConnectWithoutWatchModelInput[]
    createMany?: FrameColorCreateManyWatchModelInputEnvelope
    connect?: FrameColorWhereUniqueInput | FrameColorWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type WatchSizeUpdateManyWithoutWatchModelNestedInput = {
    create?: XOR<WatchSizeCreateWithoutWatchModelInput, WatchSizeUncheckedCreateWithoutWatchModelInput> | WatchSizeCreateWithoutWatchModelInput[] | WatchSizeUncheckedCreateWithoutWatchModelInput[]
    connectOrCreate?: WatchSizeCreateOrConnectWithoutWatchModelInput | WatchSizeCreateOrConnectWithoutWatchModelInput[]
    upsert?: WatchSizeUpsertWithWhereUniqueWithoutWatchModelInput | WatchSizeUpsertWithWhereUniqueWithoutWatchModelInput[]
    createMany?: WatchSizeCreateManyWatchModelInputEnvelope
    set?: WatchSizeWhereUniqueInput | WatchSizeWhereUniqueInput[]
    disconnect?: WatchSizeWhereUniqueInput | WatchSizeWhereUniqueInput[]
    delete?: WatchSizeWhereUniqueInput | WatchSizeWhereUniqueInput[]
    connect?: WatchSizeWhereUniqueInput | WatchSizeWhereUniqueInput[]
    update?: WatchSizeUpdateWithWhereUniqueWithoutWatchModelInput | WatchSizeUpdateWithWhereUniqueWithoutWatchModelInput[]
    updateMany?: WatchSizeUpdateManyWithWhereWithoutWatchModelInput | WatchSizeUpdateManyWithWhereWithoutWatchModelInput[]
    deleteMany?: WatchSizeScalarWhereInput | WatchSizeScalarWhereInput[]
  }

  export type FrameColorUpdateManyWithoutWatchModelNestedInput = {
    create?: XOR<FrameColorCreateWithoutWatchModelInput, FrameColorUncheckedCreateWithoutWatchModelInput> | FrameColorCreateWithoutWatchModelInput[] | FrameColorUncheckedCreateWithoutWatchModelInput[]
    connectOrCreate?: FrameColorCreateOrConnectWithoutWatchModelInput | FrameColorCreateOrConnectWithoutWatchModelInput[]
    upsert?: FrameColorUpsertWithWhereUniqueWithoutWatchModelInput | FrameColorUpsertWithWhereUniqueWithoutWatchModelInput[]
    createMany?: FrameColorCreateManyWatchModelInputEnvelope
    set?: FrameColorWhereUniqueInput | FrameColorWhereUniqueInput[]
    disconnect?: FrameColorWhereUniqueInput | FrameColorWhereUniqueInput[]
    delete?: FrameColorWhereUniqueInput | FrameColorWhereUniqueInput[]
    connect?: FrameColorWhereUniqueInput | FrameColorWhereUniqueInput[]
    update?: FrameColorUpdateWithWhereUniqueWithoutWatchModelInput | FrameColorUpdateWithWhereUniqueWithoutWatchModelInput[]
    updateMany?: FrameColorUpdateManyWithWhereWithoutWatchModelInput | FrameColorUpdateManyWithWhereWithoutWatchModelInput[]
    deleteMany?: FrameColorScalarWhereInput | FrameColorScalarWhereInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type WatchSizeUncheckedUpdateManyWithoutWatchModelNestedInput = {
    create?: XOR<WatchSizeCreateWithoutWatchModelInput, WatchSizeUncheckedCreateWithoutWatchModelInput> | WatchSizeCreateWithoutWatchModelInput[] | WatchSizeUncheckedCreateWithoutWatchModelInput[]
    connectOrCreate?: WatchSizeCreateOrConnectWithoutWatchModelInput | WatchSizeCreateOrConnectWithoutWatchModelInput[]
    upsert?: WatchSizeUpsertWithWhereUniqueWithoutWatchModelInput | WatchSizeUpsertWithWhereUniqueWithoutWatchModelInput[]
    createMany?: WatchSizeCreateManyWatchModelInputEnvelope
    set?: WatchSizeWhereUniqueInput | WatchSizeWhereUniqueInput[]
    disconnect?: WatchSizeWhereUniqueInput | WatchSizeWhereUniqueInput[]
    delete?: WatchSizeWhereUniqueInput | WatchSizeWhereUniqueInput[]
    connect?: WatchSizeWhereUniqueInput | WatchSizeWhereUniqueInput[]
    update?: WatchSizeUpdateWithWhereUniqueWithoutWatchModelInput | WatchSizeUpdateWithWhereUniqueWithoutWatchModelInput[]
    updateMany?: WatchSizeUpdateManyWithWhereWithoutWatchModelInput | WatchSizeUpdateManyWithWhereWithoutWatchModelInput[]
    deleteMany?: WatchSizeScalarWhereInput | WatchSizeScalarWhereInput[]
  }

  export type FrameColorUncheckedUpdateManyWithoutWatchModelNestedInput = {
    create?: XOR<FrameColorCreateWithoutWatchModelInput, FrameColorUncheckedCreateWithoutWatchModelInput> | FrameColorCreateWithoutWatchModelInput[] | FrameColorUncheckedCreateWithoutWatchModelInput[]
    connectOrCreate?: FrameColorCreateOrConnectWithoutWatchModelInput | FrameColorCreateOrConnectWithoutWatchModelInput[]
    upsert?: FrameColorUpsertWithWhereUniqueWithoutWatchModelInput | FrameColorUpsertWithWhereUniqueWithoutWatchModelInput[]
    createMany?: FrameColorCreateManyWatchModelInputEnvelope
    set?: FrameColorWhereUniqueInput | FrameColorWhereUniqueInput[]
    disconnect?: FrameColorWhereUniqueInput | FrameColorWhereUniqueInput[]
    delete?: FrameColorWhereUniqueInput | FrameColorWhereUniqueInput[]
    connect?: FrameColorWhereUniqueInput | FrameColorWhereUniqueInput[]
    update?: FrameColorUpdateWithWhereUniqueWithoutWatchModelInput | FrameColorUpdateWithWhereUniqueWithoutWatchModelInput[]
    updateMany?: FrameColorUpdateManyWithWhereWithoutWatchModelInput | FrameColorUpdateManyWithWhereWithoutWatchModelInput[]
    deleteMany?: FrameColorScalarWhereInput | FrameColorScalarWhereInput[]
  }

  export type WatchModelCreateNestedOneWithoutWatch_sizesInput = {
    create?: XOR<WatchModelCreateWithoutWatch_sizesInput, WatchModelUncheckedCreateWithoutWatch_sizesInput>
    connectOrCreate?: WatchModelCreateOrConnectWithoutWatch_sizesInput
    connect?: WatchModelWhereUniqueInput
  }

  export type WatchModelUpdateOneRequiredWithoutWatch_sizesNestedInput = {
    create?: XOR<WatchModelCreateWithoutWatch_sizesInput, WatchModelUncheckedCreateWithoutWatch_sizesInput>
    connectOrCreate?: WatchModelCreateOrConnectWithoutWatch_sizesInput
    upsert?: WatchModelUpsertWithoutWatch_sizesInput
    connect?: WatchModelWhereUniqueInput
    update?: XOR<XOR<WatchModelUpdateToOneWithWhereWithoutWatch_sizesInput, WatchModelUpdateWithoutWatch_sizesInput>, WatchModelUncheckedUpdateWithoutWatch_sizesInput>
  }

  export type WatchModelCreateNestedOneWithoutFrame_colorsInput = {
    create?: XOR<WatchModelCreateWithoutFrame_colorsInput, WatchModelUncheckedCreateWithoutFrame_colorsInput>
    connectOrCreate?: WatchModelCreateOrConnectWithoutFrame_colorsInput
    connect?: WatchModelWhereUniqueInput
  }

  export type WatchModelUpdateOneRequiredWithoutFrame_colorsNestedInput = {
    create?: XOR<WatchModelCreateWithoutFrame_colorsInput, WatchModelUncheckedCreateWithoutFrame_colorsInput>
    connectOrCreate?: WatchModelCreateOrConnectWithoutFrame_colorsInput
    upsert?: WatchModelUpsertWithoutFrame_colorsInput
    connect?: WatchModelWhereUniqueInput
    update?: XOR<XOR<WatchModelUpdateToOneWithWhereWithoutFrame_colorsInput, WatchModelUpdateWithoutFrame_colorsInput>, WatchModelUncheckedUpdateWithoutFrame_colorsInput>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type WatchSizeCreateWithoutWatchModelInput = {
    watch_size: string
  }

  export type WatchSizeUncheckedCreateWithoutWatchModelInput = {
    id?: number
    watch_size: string
  }

  export type WatchSizeCreateOrConnectWithoutWatchModelInput = {
    where: WatchSizeWhereUniqueInput
    create: XOR<WatchSizeCreateWithoutWatchModelInput, WatchSizeUncheckedCreateWithoutWatchModelInput>
  }

  export type WatchSizeCreateManyWatchModelInputEnvelope = {
    data: WatchSizeCreateManyWatchModelInput | WatchSizeCreateManyWatchModelInput[]
  }

  export type FrameColorCreateWithoutWatchModelInput = {
    color_name: string
    color_code?: string | null
  }

  export type FrameColorUncheckedCreateWithoutWatchModelInput = {
    id?: number
    color_name: string
    color_code?: string | null
  }

  export type FrameColorCreateOrConnectWithoutWatchModelInput = {
    where: FrameColorWhereUniqueInput
    create: XOR<FrameColorCreateWithoutWatchModelInput, FrameColorUncheckedCreateWithoutWatchModelInput>
  }

  export type FrameColorCreateManyWatchModelInputEnvelope = {
    data: FrameColorCreateManyWatchModelInput | FrameColorCreateManyWatchModelInput[]
  }

  export type WatchSizeUpsertWithWhereUniqueWithoutWatchModelInput = {
    where: WatchSizeWhereUniqueInput
    update: XOR<WatchSizeUpdateWithoutWatchModelInput, WatchSizeUncheckedUpdateWithoutWatchModelInput>
    create: XOR<WatchSizeCreateWithoutWatchModelInput, WatchSizeUncheckedCreateWithoutWatchModelInput>
  }

  export type WatchSizeUpdateWithWhereUniqueWithoutWatchModelInput = {
    where: WatchSizeWhereUniqueInput
    data: XOR<WatchSizeUpdateWithoutWatchModelInput, WatchSizeUncheckedUpdateWithoutWatchModelInput>
  }

  export type WatchSizeUpdateManyWithWhereWithoutWatchModelInput = {
    where: WatchSizeScalarWhereInput
    data: XOR<WatchSizeUpdateManyMutationInput, WatchSizeUncheckedUpdateManyWithoutWatchModelInput>
  }

  export type WatchSizeScalarWhereInput = {
    AND?: WatchSizeScalarWhereInput | WatchSizeScalarWhereInput[]
    OR?: WatchSizeScalarWhereInput[]
    NOT?: WatchSizeScalarWhereInput | WatchSizeScalarWhereInput[]
    id?: IntFilter<"WatchSize"> | number
    watch_size?: StringFilter<"WatchSize"> | string
    watchModelId?: IntFilter<"WatchSize"> | number
  }

  export type FrameColorUpsertWithWhereUniqueWithoutWatchModelInput = {
    where: FrameColorWhereUniqueInput
    update: XOR<FrameColorUpdateWithoutWatchModelInput, FrameColorUncheckedUpdateWithoutWatchModelInput>
    create: XOR<FrameColorCreateWithoutWatchModelInput, FrameColorUncheckedCreateWithoutWatchModelInput>
  }

  export type FrameColorUpdateWithWhereUniqueWithoutWatchModelInput = {
    where: FrameColorWhereUniqueInput
    data: XOR<FrameColorUpdateWithoutWatchModelInput, FrameColorUncheckedUpdateWithoutWatchModelInput>
  }

  export type FrameColorUpdateManyWithWhereWithoutWatchModelInput = {
    where: FrameColorScalarWhereInput
    data: XOR<FrameColorUpdateManyMutationInput, FrameColorUncheckedUpdateManyWithoutWatchModelInput>
  }

  export type FrameColorScalarWhereInput = {
    AND?: FrameColorScalarWhereInput | FrameColorScalarWhereInput[]
    OR?: FrameColorScalarWhereInput[]
    NOT?: FrameColorScalarWhereInput | FrameColorScalarWhereInput[]
    id?: IntFilter<"FrameColor"> | number
    color_name?: StringFilter<"FrameColor"> | string
    color_code?: StringNullableFilter<"FrameColor"> | string | null
    watchModelId?: IntFilter<"FrameColor"> | number
  }

  export type WatchModelCreateWithoutWatch_sizesInput = {
    model_name: string
    watch_model_name: string
    watch_model_manufacturer?: string | null
    main_image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    frame_colors?: FrameColorCreateNestedManyWithoutWatchModelInput
  }

  export type WatchModelUncheckedCreateWithoutWatch_sizesInput = {
    id?: number
    model_name: string
    watch_model_name: string
    watch_model_manufacturer?: string | null
    main_image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    frame_colors?: FrameColorUncheckedCreateNestedManyWithoutWatchModelInput
  }

  export type WatchModelCreateOrConnectWithoutWatch_sizesInput = {
    where: WatchModelWhereUniqueInput
    create: XOR<WatchModelCreateWithoutWatch_sizesInput, WatchModelUncheckedCreateWithoutWatch_sizesInput>
  }

  export type WatchModelUpsertWithoutWatch_sizesInput = {
    update: XOR<WatchModelUpdateWithoutWatch_sizesInput, WatchModelUncheckedUpdateWithoutWatch_sizesInput>
    create: XOR<WatchModelCreateWithoutWatch_sizesInput, WatchModelUncheckedCreateWithoutWatch_sizesInput>
    where?: WatchModelWhereInput
  }

  export type WatchModelUpdateToOneWithWhereWithoutWatch_sizesInput = {
    where?: WatchModelWhereInput
    data: XOR<WatchModelUpdateWithoutWatch_sizesInput, WatchModelUncheckedUpdateWithoutWatch_sizesInput>
  }

  export type WatchModelUpdateWithoutWatch_sizesInput = {
    model_name?: StringFieldUpdateOperationsInput | string
    watch_model_name?: StringFieldUpdateOperationsInput | string
    watch_model_manufacturer?: NullableStringFieldUpdateOperationsInput | string | null
    main_image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    frame_colors?: FrameColorUpdateManyWithoutWatchModelNestedInput
  }

  export type WatchModelUncheckedUpdateWithoutWatch_sizesInput = {
    id?: IntFieldUpdateOperationsInput | number
    model_name?: StringFieldUpdateOperationsInput | string
    watch_model_name?: StringFieldUpdateOperationsInput | string
    watch_model_manufacturer?: NullableStringFieldUpdateOperationsInput | string | null
    main_image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    frame_colors?: FrameColorUncheckedUpdateManyWithoutWatchModelNestedInput
  }

  export type WatchModelCreateWithoutFrame_colorsInput = {
    model_name: string
    watch_model_name: string
    watch_model_manufacturer?: string | null
    main_image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    watch_sizes?: WatchSizeCreateNestedManyWithoutWatchModelInput
  }

  export type WatchModelUncheckedCreateWithoutFrame_colorsInput = {
    id?: number
    model_name: string
    watch_model_name: string
    watch_model_manufacturer?: string | null
    main_image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    watch_sizes?: WatchSizeUncheckedCreateNestedManyWithoutWatchModelInput
  }

  export type WatchModelCreateOrConnectWithoutFrame_colorsInput = {
    where: WatchModelWhereUniqueInput
    create: XOR<WatchModelCreateWithoutFrame_colorsInput, WatchModelUncheckedCreateWithoutFrame_colorsInput>
  }

  export type WatchModelUpsertWithoutFrame_colorsInput = {
    update: XOR<WatchModelUpdateWithoutFrame_colorsInput, WatchModelUncheckedUpdateWithoutFrame_colorsInput>
    create: XOR<WatchModelCreateWithoutFrame_colorsInput, WatchModelUncheckedCreateWithoutFrame_colorsInput>
    where?: WatchModelWhereInput
  }

  export type WatchModelUpdateToOneWithWhereWithoutFrame_colorsInput = {
    where?: WatchModelWhereInput
    data: XOR<WatchModelUpdateWithoutFrame_colorsInput, WatchModelUncheckedUpdateWithoutFrame_colorsInput>
  }

  export type WatchModelUpdateWithoutFrame_colorsInput = {
    model_name?: StringFieldUpdateOperationsInput | string
    watch_model_name?: StringFieldUpdateOperationsInput | string
    watch_model_manufacturer?: NullableStringFieldUpdateOperationsInput | string | null
    main_image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    watch_sizes?: WatchSizeUpdateManyWithoutWatchModelNestedInput
  }

  export type WatchModelUncheckedUpdateWithoutFrame_colorsInput = {
    id?: IntFieldUpdateOperationsInput | number
    model_name?: StringFieldUpdateOperationsInput | string
    watch_model_name?: StringFieldUpdateOperationsInput | string
    watch_model_manufacturer?: NullableStringFieldUpdateOperationsInput | string | null
    main_image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    watch_sizes?: WatchSizeUncheckedUpdateManyWithoutWatchModelNestedInput
  }

  export type WatchSizeCreateManyWatchModelInput = {
    id?: number
    watch_size: string
  }

  export type FrameColorCreateManyWatchModelInput = {
    id?: number
    color_name: string
    color_code?: string | null
  }

  export type WatchSizeUpdateWithoutWatchModelInput = {
    watch_size?: StringFieldUpdateOperationsInput | string
  }

  export type WatchSizeUncheckedUpdateWithoutWatchModelInput = {
    id?: IntFieldUpdateOperationsInput | number
    watch_size?: StringFieldUpdateOperationsInput | string
  }

  export type WatchSizeUncheckedUpdateManyWithoutWatchModelInput = {
    id?: IntFieldUpdateOperationsInput | number
    watch_size?: StringFieldUpdateOperationsInput | string
  }

  export type FrameColorUpdateWithoutWatchModelInput = {
    color_name?: StringFieldUpdateOperationsInput | string
    color_code?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type FrameColorUncheckedUpdateWithoutWatchModelInput = {
    id?: IntFieldUpdateOperationsInput | number
    color_name?: StringFieldUpdateOperationsInput | string
    color_code?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type FrameColorUncheckedUpdateManyWithoutWatchModelInput = {
    id?: IntFieldUpdateOperationsInput | number
    color_name?: StringFieldUpdateOperationsInput | string
    color_code?: NullableStringFieldUpdateOperationsInput | string | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}