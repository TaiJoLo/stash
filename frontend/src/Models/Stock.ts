export interface Stock {
  id: number;
  productId: number;
  locationId: number;
  amount: number;
  purchaseDate: string | null;
  dueDate: string | null;
}
