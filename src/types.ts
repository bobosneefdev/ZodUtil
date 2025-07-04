import { z } from "zod"

export type ZodFirstPartyTypeMap = {
    [z.ZodFirstPartyTypeKind.ZodAny]: z.ZodAny,
    [z.ZodFirstPartyTypeKind.ZodArray]: z.ZodArray<any>,
    [z.ZodFirstPartyTypeKind.ZodBigInt]: z.ZodBigInt,
    [z.ZodFirstPartyTypeKind.ZodBoolean]: z.ZodBoolean,
    [z.ZodFirstPartyTypeKind.ZodBranded]: z.ZodBranded<any, any>,
    [z.ZodFirstPartyTypeKind.ZodCatch]: z.ZodCatch<any>,
    [z.ZodFirstPartyTypeKind.ZodDate]: z.ZodDate,
    [z.ZodFirstPartyTypeKind.ZodDefault]: z.ZodDefault<any>,
    [z.ZodFirstPartyTypeKind.ZodDiscriminatedUnion]: z.ZodDiscriminatedUnion<any, any>,
    [z.ZodFirstPartyTypeKind.ZodEffects]: z.ZodEffects<any>,
    [z.ZodFirstPartyTypeKind.ZodEnum]: z.ZodEnum<any>,
    [z.ZodFirstPartyTypeKind.ZodFunction]: z.ZodFunction<any, any>,
    [z.ZodFirstPartyTypeKind.ZodIntersection]: z.ZodIntersection<any, any>,
    [z.ZodFirstPartyTypeKind.ZodLazy]: z.ZodLazy<any>,
    [z.ZodFirstPartyTypeKind.ZodLiteral]: z.ZodLiteral<any>,
    [z.ZodFirstPartyTypeKind.ZodMap]: z.ZodMap<any, any>,
    [z.ZodFirstPartyTypeKind.ZodNaN]: z.ZodNaN,
    [z.ZodFirstPartyTypeKind.ZodNativeEnum]: z.ZodNativeEnum<any>,
    [z.ZodFirstPartyTypeKind.ZodNever]: z.ZodNever,
    [z.ZodFirstPartyTypeKind.ZodNull]: z.ZodNull,
    [z.ZodFirstPartyTypeKind.ZodNullable]: z.ZodNullable<any>,
    [z.ZodFirstPartyTypeKind.ZodNumber]: z.ZodNumber,
    [z.ZodFirstPartyTypeKind.ZodObject]: z.ZodObject<any>,
    [z.ZodFirstPartyTypeKind.ZodOptional]: z.ZodOptional<any>,
    [z.ZodFirstPartyTypeKind.ZodPipeline]: z.ZodPipeline<any, any>,
    [z.ZodFirstPartyTypeKind.ZodPromise]: z.ZodPromise<any>,
    [z.ZodFirstPartyTypeKind.ZodReadonly]: z.ZodReadonly<any>,
    [z.ZodFirstPartyTypeKind.ZodRecord]: z.ZodRecord<any, any>,
    [z.ZodFirstPartyTypeKind.ZodSet]: z.ZodSet<any>,
    [z.ZodFirstPartyTypeKind.ZodString]: z.ZodString,
    [z.ZodFirstPartyTypeKind.ZodSymbol]: z.ZodSymbol,
    [z.ZodFirstPartyTypeKind.ZodTuple]: z.ZodTuple<any, any>,
    [z.ZodFirstPartyTypeKind.ZodUndefined]: z.ZodUndefined,
    [z.ZodFirstPartyTypeKind.ZodUnion]: z.ZodUnion<any>,
    [z.ZodFirstPartyTypeKind.ZodUnknown]: z.ZodUnknown,
    [z.ZodFirstPartyTypeKind.ZodVoid]: z.ZodVoid,
}

export type ZodTypePossiblyWrappedInEffects<T extends z.ZodTypeAny> = T | z.ZodEffects<ZodTypePossiblyWrappedInEffects<T>, any, any>;