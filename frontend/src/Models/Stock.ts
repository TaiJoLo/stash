export interface Stock {
  id: number;
  productId: number;
  locationId: number;
  amount: number;
  unitPrice: number;
  purchaseDate: string | null;
  dueDate: string | null;
}
