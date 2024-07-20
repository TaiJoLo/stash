export interface Product {
  id: number;
  name: string;
  categoryId: number;
  defaultLocation: string;
  parentProductId: number | null;
  parentProduct?: string;
}
