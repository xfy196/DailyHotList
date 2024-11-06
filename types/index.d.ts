export interface IRoute {
  name: string;
  path: string;
  title?: string;
  show?: boolean;
}
export interface IHotInfo {
  author: string;
  cover: string;
  hot: number;
  id: number;
  mobileUrl: string;
  timestamp: number;
  title: string;
  url: string;
}
export interface ICardInfo {
  code?: number;
  data: Array<IHotInfo>;
  total: number;
  updateTime: string;
  type: string;
  name: string;
  params?: object;
  fromCache: boolean;
  title: string;
  link: string;
}
