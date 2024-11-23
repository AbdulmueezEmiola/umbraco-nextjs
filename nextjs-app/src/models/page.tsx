import { BaseModel } from "./base";
import { ListModel } from "./listModel";

export type PageModel = BaseModel<{
  name: string;
  description: string;
  title: string;
}>;

export type PageList = ListModel<PageModel>;
