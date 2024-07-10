import { Items } from "../Models/Items";
import config from "../Config";

const { apiUrl } = config;

export const getItems = async (): Promise<Items[]> => {
  const response = await fetch(`${apiUrl}/api/items`);
  if (!response.ok) {
    throw new Error("Failed to fetch items");
  }
  const data = await response.json();
  return data;
};

export const createItem = async (item: Omit<Items, "id">): Promise<Items> => {
  const response = await fetch(`${apiUrl}/api/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });
  if (!response.ok) {
    throw new Error("Failed to create item");
  }
  const data = await response.json();
  return data;
};

export const updateItem = async (id: number, item: Items): Promise<void> => {
  const response = await fetch(`${apiUrl}/api/items/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });
  if (!response.ok) {
    throw new Error("Failed to update item");
  }
};

export const deleteItem = async (id: number): Promise<void> => {
  const response = await fetch(`${apiUrl}/api/items/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete item");
  }
};
