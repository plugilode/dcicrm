declare module 'uuid' {
  export function v1(options?: any): string;
  export function v4(options?: any): string;
  export const NIL: string;
  export function parse(uuid: string): Buffer;
  export function stringify(buffer: Buffer): string;
  export function validate(uuid: string): boolean;
  export function version(uuid: string): number;
}
