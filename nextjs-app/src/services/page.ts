import { PageList, PageModel } from "@/models/page";
import {
  GetAllContentPagedAsync,
  GetPageAsync,
} from "./service.umbraco.content";

export const getAllPages = async () => {
  const data = await GetAllContentPagedAsync();
  return data as PageList;
};

export const getPage = async (id: string) => {
  const data = await GetPageAsync(`/${id}`);
  return data as PageModel;
};
