export interface Product {
  id: number;
  name: string;
  pictureUrl?: string;
  categoryId: number;
  defaultLocation: string;
  parentProductId: number;
  parentProduct?: string;
}
