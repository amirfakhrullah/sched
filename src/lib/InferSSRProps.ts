/* eslint-disable @typescript-eslint/no-explicit-any */
import { Redirect } from "next";

type GetSSRResult<TProps> =
  | { props: TProps | Promise<TProps> }
  | { redirect: Redirect }
  | { notFound: boolean };

type GetSSRFn<TProps> = (...args: any[]) => Promise<GetSSRResult<TProps>>;

export type InferSSRProps<TFn extends GetSSRFn<any>> = TFn extends GetSSRFn<
  infer TProps
>
  ? NonNullable<TProps>
  : never;
