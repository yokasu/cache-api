export type TFilter = (...args: any) => Exclude<any, void>;
export interface IConfiguration {
  freeze?: Boolean;
  filters?: TFilter[];
}
