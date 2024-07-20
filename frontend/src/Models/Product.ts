export interface Product {
  id: number;
  name: string;
  pictureUrl?: string;
  categoryId: number;
  locationId: number;
  parentProductId: number;
  parentProduct?: string;
}
