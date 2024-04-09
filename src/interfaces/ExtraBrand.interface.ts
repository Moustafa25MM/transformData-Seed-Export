import { IBrand } from "./Brand.interface";

export interface IBrandExtraFields extends IBrand {
    yearCreated?: number | string;
    hqAddress?: string;
    brand?: {
      name?: string;
    } | string;
    yearsFounded?: number;
  }