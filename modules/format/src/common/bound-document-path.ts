import { createDocumentPath, getNestedValueWithoutType } from "./document-path";

export type BoundDocumentPathOfDepth1<
  T extends Object,
  K1 extends keyof T
> = string & {
  keys: [K1];
  object: T;
};

export type BoundDocumentPathOfDepth2<
  T extends Object,
  K1 extends keyof T,
  K2 extends keyof T[K1]
> = string & {
  keys: [K1, K2];
  object: T;
};

export type BoundDocumentPathOfDepth3<
  T extends Object,
  K1 extends keyof T,
  K2 extends keyof T[K1],
  K3 extends keyof T[K1][K2]
> = string & {
  keys: [K1, K2, K3];
  object: T;
};

export type BoundDocumentPathOfDepth4<
  T extends Object,
  K1 extends keyof T,
  K2 extends keyof T[K1],
  K3 extends keyof T[K1][K2],
  K4 extends keyof T[K1][K2][K3]
> = string & {
  keys: [K1, K2, K3, K4];
  object: T;
};

export type BoundDocumentPathOfDepth5<
  T extends Object,
  K1 extends keyof T,
  K2 extends keyof T[K1],
  K3 extends keyof T[K1][K2],
  K4 extends keyof T[K1][K2][K3],
  K5 extends keyof T[K1][K2][K3][K4]
> = string & {
  keys: [K1, K2, K3, K4, K5];
  object: T;
};

export type BoundDocumentPathOfDepth6<
  T extends Object,
  K1 extends keyof T,
  K2 extends keyof T[K1],
  K3 extends keyof T[K1][K2],
  K4 extends keyof T[K1][K2][K3],
  K5 extends keyof T[K1][K2][K3][K4],
  K6 extends keyof T[K1][K2][K3][K4][K5]
> = string & {
  keys: [K1, K2, K3, K4, K5, K6];
  object: T;
};

export type BoundDocumentPathOfDepth7<
  T extends Object,
  K1 extends keyof T,
  K2 extends keyof T[K1],
  K3 extends keyof T[K1][K2],
  K4 extends keyof T[K1][K2][K3],
  K5 extends keyof T[K1][K2][K3][K4],
  K6 extends keyof T[K1][K2][K3][K4][K5],
  K7 extends keyof T[K1][K2][K3][K4][K5][K6]
> = string & {
  keys: [K1, K2, K3, K4, K5, K6, K7];
  object: T;
};

export type BoundDocumentPathOfDepth8<
  T extends Object,
  K1 extends keyof T,
  K2 extends keyof T[K1],
  K3 extends keyof T[K1][K2],
  K4 extends keyof T[K1][K2][K3],
  K5 extends keyof T[K1][K2][K3][K4],
  K6 extends keyof T[K1][K2][K3][K4][K5],
  K7 extends keyof T[K1][K2][K3][K4][K5][K6],
  K8 extends keyof T[K1][K2][K3][K4][K5][K6][K7]
> = string & {
  keys: [K1, K2, K3, K4, K5, K6, K7, K8];
  object: T;
};

export type BoundDocumentPathOfDepth9<
  T extends Object,
  K1 extends keyof T,
  K2 extends keyof T[K1],
  K3 extends keyof T[K1][K2],
  K4 extends keyof T[K1][K2][K3],
  K5 extends keyof T[K1][K2][K3][K4],
  K6 extends keyof T[K1][K2][K3][K4][K5],
  K7 extends keyof T[K1][K2][K3][K4][K5][K6],
  K8 extends keyof T[K1][K2][K3][K4][K5][K6][K7],
  K9 extends keyof T[K1][K2][K3][K4][K5][K6][K7][K8]
> = string & {
  keys: [K1, K2, K3, K4, K5, K6, K7, K8, K9];
  object: T;
};

export type BoundDocumentPathOfDepth10<
  T extends Object,
  K1 extends keyof T,
  K2 extends keyof T[K1],
  K3 extends keyof T[K1][K2],
  K4 extends keyof T[K1][K2][K3],
  K5 extends keyof T[K1][K2][K3][K4],
  K6 extends keyof T[K1][K2][K3][K4][K5],
  K7 extends keyof T[K1][K2][K3][K4][K5][K6],
  K8 extends keyof T[K1][K2][K3][K4][K5][K6][K7],
  K9 extends keyof T[K1][K2][K3][K4][K5][K6][K7][K8],
  K10 extends keyof T[K1][K2][K3][K4][K5][K6][K7][K8][K9]
> = string & {
  keys: [K1, K2, K3, K4, K5, K6, K7, K8, K9, K10];
  object: T;
};

export type BoundDocumentPath<
  T,
  K1,
  K2,
  K3,
  K4,
  K5,
  K6,
  K7,
  K8,
  K9,
  K10
> = K1 extends keyof T
  ? K2 extends keyof T[K1]
    ? K3 extends keyof T[K1][K2]
      ? K4 extends keyof T[K1][K2][K3]
        ? K5 extends keyof T[K1][K2][K3][K4]
          ? K6 extends keyof T[K1][K2][K3][K4][K5]
            ? K7 extends keyof T[K1][K2][K3][K4][K5][K6]
              ? K8 extends keyof T[K1][K2][K3][K4][K5][K6][K7]
                ? K9 extends keyof T[K1][K2][K3][K4][K5][K6][K7][K8]
                  ? K10 extends keyof T[K1][K2][K3][K4][K5][K6][K7][K8][K9]
                    ? BoundDocumentPathOfDepth10<
                        T,
                        K1,
                        K2,
                        K3,
                        K4,
                        K5,
                        K6,
                        K7,
                        K8,
                        K9,
                        K10
                      >
                    : BoundDocumentPathOfDepth9<
                        T,
                        K1,
                        K2,
                        K3,
                        K4,
                        K5,
                        K6,
                        K7,
                        K8,
                        K9
                      >
                  : BoundDocumentPathOfDepth8<T, K1, K2, K3, K4, K5, K6, K7, K8>
                : BoundDocumentPathOfDepth7<T, K1, K2, K3, K4, K5, K6, K7>
              : BoundDocumentPathOfDepth6<T, K1, K2, K3, K4, K5, K6>
            : BoundDocumentPathOfDepth5<T, K1, K2, K3, K4, K5>
          : BoundDocumentPathOfDepth4<T, K1, K2, K3, K4>
        : BoundDocumentPathOfDepth3<T, K1, K2, K3>
      : BoundDocumentPathOfDepth2<T, K1, K2>
    : BoundDocumentPathOfDepth1<T, K1>
  : string;

export interface BoundDocumentPathCreator<T> {
  <K1 extends keyof T>(k1: K1): BoundDocumentPathOfDepth1<T, K1>;
  <K1 extends keyof T, K2 extends keyof T[K1]>(
    k1: K1,
    k2: K2
  ): BoundDocumentPathOfDepth2<T, K1, K2>;
  <K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2]>(
    k1: K1,
    k2: K2,
    k3: K3
  ): BoundDocumentPathOfDepth3<T, K1, K2, K3>;
  <
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3]
  >(
    k1: K1,
    k2: K2,
    k3: K3,
    k4: K4
  ): BoundDocumentPathOfDepth4<T, K1, K2, K3, K4>;
  <
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4]
  >(
    k1: K1,
    k2: K2,
    k3: K3,
    k4: K4,
    k5: K5
  ): BoundDocumentPathOfDepth5<T, K1, K2, K3, K4, K5>;
  <
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4],
    K6 extends keyof T[K1][K2][K3][K4][K5]
  >(
    k1: K1,
    k2: K2,
    k3: K3,
    k4: K4,
    k5: K5,
    k6: K6
  ): BoundDocumentPathOfDepth6<T, K1, K2, K3, K4, K5, K6>;
  <
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4],
    K6 extends keyof T[K1][K2][K3][K4][K5],
    K7 extends keyof T[K1][K2][K3][K4][K5][K6]
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
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4],
    K6 extends keyof T[K1][K2][K3][K4][K5],
    K7 extends keyof T[K1][K2][K3][K4][K5][K6],
    K8 extends keyof T[K1][K2][K3][K4][K5][K6][K7]
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
  <
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4],
    K6 extends keyof T[K1][K2][K3][K4][K5],
    K7 extends keyof T[K1][K2][K3][K4][K5][K6],
    K8 extends keyof T[K1][K2][K3][K4][K5][K6][K7],
    K9 extends keyof T[K1][K2][K3][K4][K5][K6][K7][K8]
  >(
    k1: K1,
    k2: K2,
    k3: K3,
    k4: K4,
    k5: K5,
    k6: K6,
    k7: K7,
    k8: K8,
    k9: K9
  ): BoundDocumentPathOfDepth9<T, K1, K2, K3, K4, K5, K6, K7, K8, K9>;
  <
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4],
    K6 extends keyof T[K1][K2][K3][K4][K5],
    K7 extends keyof T[K1][K2][K3][K4][K5][K6],
    K8 extends keyof T[K1][K2][K3][K4][K5][K6][K7],
    K9 extends keyof T[K1][K2][K3][K4][K5][K6][K7][K8],
    K10 extends keyof T[K1][K2][K3][K4][K5][K6][K7][K8][K9]
  >(
    k1: K1,
    k2: K2,
    k3: K3,
    k4: K4,
    k5: K5,
    k6: K6,
    k7: K7,
    k8: K8,
    k9: K9,
    k10: K10
  ): BoundDocumentPathOfDepth10<T, K1, K2, K3, K4, K5, K6, K7, K8, K9, K10>;
}

export function $path<T>(): BoundDocumentPathCreator<T> {
  // @ts-ignore surpress for typing.
  return createDocumentPath;
}

export type NestedValue<
  T,
  K1,
  K2,
  K3,
  K4,
  K5,
  K6,
  K7,
  K8,
  K9,
  K10
> = K1 extends keyof T
  ? K2 extends keyof T[K1]
    ? K3 extends keyof T[K1][K2]
      ? K4 extends keyof T[K1][K2][K3]
        ? K5 extends keyof T[K1][K2][K3][K4]
          ? K6 extends keyof T[K1][K2][K3][K4][K5]
            ? K7 extends keyof T[K1][K2][K3][K4][K5][K6]
              ? K8 extends keyof T[K1][K2][K3][K4][K5][K6][K7]
                ? K9 extends keyof T[K1][K2][K3][K4][K5][K6][K7][K8]
                  ? K10 extends keyof T[K1][K2][K3][K4][K5][K6][K7][K8][K9]
                    ? T[K1][K2][K3][K4][K5][K6][K7][K8][K9][K10]
                    : T[K1][K2][K3][K4][K5][K6][K7][K8][K9]
                  : T[K1][K2][K3][K4][K5][K6][K7][K8]
                : T[K1][K2][K3][K4][K5][K6][K7]
              : T[K1][K2][K3][K4][K5][K6]
            : T[K1][K2][K3][K4][K5]
          : T[K1][K2][K3][K4]
        : T[K1][K2][K3]
      : T[K1][K2]
    : T[K1]
  : any;

type NullableByBoolean<T, B extends boolean> = B extends true
  ? T
  : T | null | undefined;

interface NestedValueGetter {
  <
    T extends Object,
    B extends boolean,
    K1,
    K2,
    K3,
    K4,
    K5,
    K6,
    K7,
    K8,
    K9,
    K10
  >(
    obj: T,
    path: BoundDocumentPath<T, K1, K2, K3, K4, K5, K6, K7, K8, K9, K10>,
    noNullAccess?: B
  ): NullableByBoolean<
    NestedValue<T, K1, K2, K3, K4, K5, K6, K7, K8, K9, K10>,
    B
  >;
  (obj: Object, path: string, noNullAccess?: boolean): any;
}

export const getNestedValue: NestedValueGetter = getNestedValueWithoutType;
