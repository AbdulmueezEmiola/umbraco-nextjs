export interface BaseModel<T> {
  contentType: string;
  createDate: string;
  updateDate: string;
  id: string;
  name: string;
  properties: T;
}
