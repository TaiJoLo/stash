export interface Product {
  id: number;
  name: string;
  pictureUrl?: string;
  categoryId: number;
  parentProductId: number;
  parentProduct?: string;
}
