import { AxiosStatic, AxiosInstance, AxiosRequestConfig } from 'axios'

interface IRequestOptions extends AxiosRequestConfig {
  /**
   * 是否使用 requestCache方法请求，默认`false`
   */
  useCache?: boolean;
  /**
   * 是否请求接口重新缓存数据，默认`false`。`useCache`为`true`时才生效
   */
  recache?: boolean;
}

type Res = { code: number; data: any; success: boolean; msg: string }

interface fn {
  (options: IRequestOptions): Promise<Res>
}

interface Request extends AxiosInstance {
__PREFIX__
}

export default <Request>{}

export const axios: AxiosStatic

interface IHeaders {
  Authorization: string;
  [key: string]: any;
}
export function getAuthHeader(isToken = true): IHeaders;

export interface IResData<T = any> {
  code: 401 | 500 | 200 | number;
  success: boolean;
  msg: string;
  data: T;
}
interface IRequestCacheOptions extends AxiosRequestConfig {
  /**
   * 是否请求接口重新缓存数据，默认`false`
   */
  recache: boolean;
}
/**
 * 根据请求的 url、method、params、data 数据生成唯一key
 *
 * 请求返回的数据缓存到本地，下次请求时直接读取缓存
 */
export function requestCache(options: IRequestCacheOptions): Promise<IResData>

/**
 * 删除的key，key为空时则清空所有
 */
type TKey = string;

/**
 * 清空通过 requestCache 方法请求产生的缓存数据
 */
export function clearRequestCache(key?: TKey): void;
