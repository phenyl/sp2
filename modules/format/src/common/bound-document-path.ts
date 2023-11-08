import { createDocumentPath, getNestedValueWithoutType } from "./document-path";
import { DefaultDocumentType } from "./default-document-type";

type Attribute = string | number;
type DocumentPathSegment<K extends Attribute> = K extends string
  ? `.${K}`
  : `[${K}]`;

export type BoundDocumentPathOfDepth1<
  T extends Object,
  K1 extends Extract<keyof T, Attribute>
> = `${K1}`;

export type BoundDocumentPathOfDepth2<
  T extends Object,
  K1 extends Extract<keyof T, Attribute>,
  K2 extends Extract<keyof Required<T>[K1], Attribute>
> = `${K1}${DocumentPathSegment<K2>}`;

export type BoundDocumentPathOfDepth3<
  T extends Object,
  K1 extends Extract<keyof T, Attribute>,
  K2 extends Extract<keyof Required<T>[K1], Attribute>,
  K3 extends Extract<keyof Required<Required<T>[K1]>[K2], Attribute>
> = `${K1}${DocumentPathSegment<K2>}${DocumentPathSegment<K3>}`;

export type BoundDocumentPathOfDepth4<
  T extends Object,
  K1 extends Extract<keyof T, Attribute>,
  K2 extends Extract<keyof Required<T>[K1], Attribute>,
  K3 extends Extract<keyof Required<Required<T>[K1]>[K2], Attribute>,
  K4 extends Extract<
    keyof Required<Required<Required<T>[K1]>[K2]>[K3],
    Attribute
  >
> = `${K1}${DocumentPathSegment<K2>}${DocumentPathSegment<K3>}${DocumentPathSegment<K4>}`;

export type BoundDocumentPathOfDepth5<
  T extends Object,
  K1 extends Extract<keyof T, Attribute>,
  K2 extends Extract<keyof Required<T>[K1], Attribute>,
  K3 extends Extract<keyof Required<Required<T>[K1]>[K2], Attribute>,
  K4 extends Extract<
    keyof Required<Required<Required<T>[K1]>[K2]>[K3],
    Attribute
  >,
  K5 extends Extract<
    keyof Required<Required<Required<Required<T>[K1]>[K2]>[K3]>[K4],
    Attribute
  >
> = `${K1}${DocumentPathSegment<K2>}${DocumentPathSegment<K3>}${DocumentPathSegment<K4>}${DocumentPathSegment<K5>}`;

export type BoundDocumentPathOfDepth6<
  T extends Object,
  K1 extends Extract<keyof T, Attribute>,
  K2 extends Extract<keyof Required<T>[K1], Attribute>,
  K3 extends Extract<keyof Required<Required<T>[K1]>[K2], Attribute>,
  K4 extends Extract<
    keyof Required<Required<Required<T>[K1]>[K2]>[K3],
    Attribute
  >,
  K5 extends Extract<
    keyof Required<Required<Required<Required<T>[K1]>[K2]>[K3]>[K4],
    Attribute
  >,
  K6 extends Extract<
    keyof Required<
      Required<Required<Required<Required<T>[K1]>[K2]>[K3]>[K4]
    >[K5],
    Attribute
  >
> = `${K1}${DocumentPathSegment<K2>}${DocumentPathSegment<K3>}${DocumentPathSegment<K4>}${DocumentPathSegment<K5>}${DocumentPathSegment<K6>}`;

export type BoundDocumentPathOfDepth7<
  T extends Object,
  K1 extends Extract<keyof T, Attribute>,
  K2 extends Extract<keyof Required<T>[K1], Attribute>,
  K3 extends Extract<keyof Required<Required<T>[K1]>[K2], Attribute>,
  K4 extends Extract<
    keyof Required<Required<Required<T>[K1]>[K2]>[K3],
    Attribute
  >,
  K5 extends Extract<
    keyof Required<Required<Required<Required<T>[K1]>[K2]>[K3]>[K4],
    Attribute
  >,
  K6 extends Extract<
    keyof Required<
      Required<Required<Required<Required<T>[K1]>[K2]>[K3]>[K4]
    >[K5],
    Attribute
  >,
  K7 extends Extract<
    keyof Required<
      Required<Required<Required<Required<Required<T>[K1]>[K2]>[K3]>[K4]>[K5]
    >[K6],
    Attribute
  >
> = `${K1}${DocumentPathSegment<K2>}${DocumentPathSegment<K3>}${DocumentPathSegment<K4>}${DocumentPathSegment<K5>}${DocumentPathSegment<K6>}${DocumentPathSegment<K7>}`;

export type BoundDocumentPathOfDepth8<
  T extends Object,
  K1 extends Extract<keyof T, Attribute>,
  K2 extends Extract<keyof Required<T>[K1], Attribute>,
  K3 extends Extract<keyof Required<Required<T>[K1]>[K2], Attribute>,
  K4 extends Extract<
    keyof Required<Required<Required<T>[K1]>[K2]>[K3],
    Attribute
  >,
  K5 extends Extract<
    keyof Required<Required<Required<Required<T>[K1]>[K2]>[K3]>[K4],
    Attribute
  >,
  K6 extends Extract<
    keyof Required<
      Required<Required<Required<Required<T>[K1]>[K2]>[K3]>[K4]
    >[K5],
    Attribute
  >,
  K7 extends Extract<
    keyof Required<
      Required<Required<Required<Required<Required<T>[K1]>[K2]>[K3]>[K4]>[K5]
    >[K6],
    Attribute
  >,
  K8 extends Extract<
    keyof Required<
      Required<
        Required<Required<Required<Required<Required<T>[K1]>[K2]>[K3]>[K4]>[K5]
      >[K6]
    >[K7],
    Attribute
  >
> = `${K1}${DocumentPathSegment<K2>}${DocumentPathSegment<K3>}${DocumentPathSegment<K4>}${DocumentPathSegment<K5>}${DocumentPathSegment<K6>}${DocumentPathSegment<K7>}${DocumentPathSegment<K8>}`;

export type BoundDocumentPath<
  T,
  K1,
  K2,
  K3,
  K4,
  K5,
  K6,
  K7,
  K8
> = K1 extends Extract<keyof T, Attribute>
  ? K2 extends Extract<keyof T[K1], Attribute>
    ? K3 extends Extract<keyof T[K1][K2], Attribute>
      ? K4 extends Extract<keyof T[K1][K2][K3], Attribute>
        ? K5 extends Extract<keyof T[K1][K2][K3][K4], Attribute>
          ? K6 extends Extract<keyof T[K1][K2][K3][K4][K5], Attribute>
            ? K7 extends Extract<keyof T[K1][K2][K3][K4][K5][K6], Attribute>
              ? K8 extends Extract<
                  keyof T[K1][K2][K3][K4][K5][K6][K7],
                  Attribute
                >
                ? BoundDocumentPathOfDepth8<T, K1, K2, K3, K4, K5, K6, K7, K8>
                : BoundDocumentPathOfDepth7<T, K1, K2, K3, K4, K5, K6, K7>
              : BoundDocumentPathOfDepth6<T, K1, K2, K3, K4, K5, K6>
            : BoundDocumentPathOfDepth5<T, K1, K2, K3, K4, K5>
          : BoundDocumentPathOfDepth4<T, K1, K2, K3, K4>
        : BoundDocumentPathOfDepth3<T, K1, K2, K3>
      : BoundDocumentPathOfDepth2<T, K1, K2>
    : BoundDocumentPathOfDepth1<T, K1>
  : string;

export interface BoundDocumentPathCreator<T = DefaultDocumentType> {
  <K1 extends Extract<keyof T, Attribute>>(k1: K1): BoundDocumentPathOfDepth1<
    T,
    K1
  >;
  <
    K1 extends Extract<keyof T, Attribute>,
    K2 extends Extract<keyof Required<T>[K1], Attribute>
  >(
    k1: K1,
    k2: K2
  ): BoundDocumentPathOfDepth2<T, K1, K2>;
  <
    K1 extends Extract<keyof T, Attribute>,
    K2 extends Extract<keyof Required<T>[K1], Attribute>,
    K3 extends Extract<keyof Required<Required<T>[K1]>[K2], Attribute>
  >(
    k1: K1,
    k2: K2,
    k3: K3
  ): BoundDocumentPathOfDepth3<T, K1, K2, K3>;
  <
    K1 extends Extract<keyof T, Attribute>,
    K2 extends Extract<keyof Required<T>[K1], Attribute>,
    K3 extends Extract<keyof Required<Required<T>[K1]>[K2], Attribute>,
    K4 extends Extract<
      keyof Required<Required<Required<T>[K1]>[K2]>[K3],
      Attribute
    >
  >(
    k1: K1,
    k2: K2,
    k3: K3,
    k4: K4
  ): BoundDocumentPathOfDepth4<T, K1, K2, K3, K4>;
  <
    K1 extends Extract<keyof T, Attribute>,
    K2 extends Extract<keyof Required<T>[K1], Attribute>,
    K3 extends Extract<keyof Required<Required<T>[K1]>[K2], Attribute>,
    K4 extends Extract<
      keyof Required<Required<Required<T>[K1]>[K2]>[K3],
      Attribute
    >,
    K5 extends Extract<
      keyof Required<Required<Required<Required<T>[K1]>[K2]>[K3]>[K4],
      Attribute
    >
  >(
    k1: K1,
    k2: K2,
    k3: K3,
    k4: K4,
    k5: K5
  ): BoundDocumentPathOfDepth5<T, K1, K2, K3, K4, K5>;
  <
    K1 extends Extract<keyof T, Attribute>,
    K2 extends Extract<keyof Required<T>[K1], Attribute>,
    K3 extends Extract<keyof Required<Required<T>[K1]>[K2], Attribute>,
    K4 extends Extract<
      keyof Required<Required<Required<T>[K1]>[K2]>[K3],
      Attribute
    >,
    K5 extends Extract<
      keyof Required<Required<Required<Required<T>[K1]>[K2]>[K3]>[K4],
      Attribute
    >,
    K6 extends Extract<
      keyof Required<
        Required<Required<Required<Required<T>[K1]>[K2]>[K3]>[K4]
      >[K5],
      Attribute
    >
  >(
    k1: K1,
    k2: K2,
    k3: K3,
    k4: K4,
    k5: K5,
    k6: K6
  ): BoundDocumentPathOfDepth6<T, K1, K2, K3, K4, K5, K6>;
  <
    K1 extends Extract<keyof T, Attribute>,
    K2 extends Extract<keyof Required<T>[K1], Attribute>,
    K3 extends Extract<keyof Required<Required<T>[K1]>[K2], Attribute>,
    K4 extends Extract<
      keyof Required<Required<Required<T>[K1]>[K2]>[K3],
      Attribute
    >,
    K5 extends Extract<
      keyof Required<Required<Required<Required<T>[K1]>[K2]>[K3]>[K4],
      Attribute
    >,
    K6 extends Extract<
      keyof Required<
        Required<Required<Required<Required<T>[K1]>[K2]>[K3]>[K4]
      >[K5],
      Attribute
    >,
    K7 extends Extract<
      keyof Required<
        Required<Required<Required<Required<Required<T>[K1]>[K2]>[K3]>[K4]>[K5]
      >[K6],
      Attribute
    >
  >(
    k1: K1,
    k2: K2,
    k3: K3,
    k4: K4,
    k5: K5,
    k6: K6,
    k7: K7
  ): BoundDocumentPathOfDepth7<T, K1, K2, K3, K4, K5, K6, K7>;
  <
    K1 extends Extract<keyof T, Attribute>,
    K2 extends Extract<keyof Required<T>[K1], Attribute>,
    K3 extends Extract<keyof Required<Required<T>[K1]>[K2], Attribute>,
    K4 extends Extract<
      keyof Required<Required<Required<T>[K1]>[K2]>[K3],
      Attribute
    >,
    K5 extends Extract<
      keyof Required<Required<Required<Required<T>[K1]>[K2]>[K3]>[K4],
      Attribute
    >,
    K6 extends Extract<
      keyof Required<
        Required<Required<Required<Required<T>[K1]>[K2]>[K3]>[K4]
      >[K5],
      Attribute
    >,
    K7 extends Extract<
      keyof Required<
        Required<Required<Required<Required<Required<T>[K1]>[K2]>[K3]>[K4]>[K5]
      >[K6],
      Attribute
    >,
    K8 extends Extract<
      keyof Required<
        Required<
          Required<
            Required<Required<Required<Required<T>[K1]>[K2]>[K3]>[K4]
          >[K5]
        >[K6]
      >[K7],
      Attribute
    >
  >(
    k1: K1,
    k2: K2,
    k3: K3,
    k4: K4,
    k5: K5,
    k6: K6,
    k7: K7,
    k8: K8
  ): BoundDocumentPathOfDepth8<T, K1, K2, K3, K4, K5, K6, K7, K8>;
}

export function $path<T>(): BoundDocumentPathCreator<T> {
  // @ts-ignore surpress for typing.
  return createDocumentPath;
}

// prettier-ignore
export type NestedValue<
  T,
  K1,
  K2,
  K3,
  K4,
  K5,
  K6,
  K7,
  K8
> = K1 extends Extract<keyof T, Attribute>
  ? K2 extends Extract<keyof Required<T>[K1], Attribute>
    ? K3 extends Extract<keyof Required<Required<T>[K1]>[K2], Attribute>
      ? K4 extends Extract<keyof Required<Required<Required<T>[K1]>[K2]>[K3], Attribute>
        ? K5 extends Extract<keyof Required<Required<Required<Required<T>[K1]>[K2]>[K3]>[K4], Attribute>
          ? K6 extends Extract<keyof Required<Required<Required<Required<Required<T>[K1]>[K2]>[K3]>[K4]>[K5], Attribute>
            ? K7 extends Extract<keyof Required<Required<Required<Required<Required<Required<T>[K1]>[K2]>[K3]>[K4]>[K5]>[K6], Attribute>
              ? K8 extends Extract<keyof Required<Required<Required<Required<Required<Required<Required<T>[K1]>[K2]>[K3]>[K4]>[K5]>[K6]>[K7], Attribute>
                ? Required<Required<Required<Required<Required<Required<Required<Required<T>[K1]>[K2]>[K3]>[K4]>[K5]>[K6]>[K7]>[K8]
                : Required<Required<Required<Required<Required<Required<Required<T>[K1]>[K2]>[K3]>[K4]>[K5]>[K6]>[K7]
              : Required<Required<Required<Required<Required<Required<T>[K1]>[K2]>[K3]>[K4]>[K5]>[K6]
            : Required<Required<Required<Required<Required<T>[K1]>[K2]>[K3]>[K4]>[K5]
          : Required<Required<Required<Required<T>[K1]>[K2]>[K3]>[K4]
        : Required<Required<Required<T>[K1]>[K2]>[K3]
      : Required<Required<T>[K1]>[K2]
    : Required<T>[K1]
  : any;

type NullableByBoolean<T, B extends boolean> = B extends true
  ? T
  : T | null | undefined;

interface NestedValueGetter {
  <T extends Object, B extends boolean, K1, K2, K3, K4, K5, K6, K7, K8>(
    obj: T,
    path: BoundDocumentPath<T, K1, K2, K3, K4, K5, K6, K7, K8>,
    noNullAccess?: B
  ): NullableByBoolean<NestedValue<T, K1, K2, K3, K4, K5, K6, K7, K8>, B>;
  (obj: Object, path: string, noNullAccess?: boolean): any;
}

export const getNestedValue: NestedValueGetter = getNestedValueWithoutType;
