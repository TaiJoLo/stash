import React, { useState, useEffect } from "react";
import { getItems, createItem } from "../Services/ItemService";
import { Items } from "../Models/Items";

const SimpleTestComponent: React.FC = () => {
  const [items, setItems] = useState<Items[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newItemName, setNewItemName] = useState<string>("");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const items = await getItems();
        setItems(items);
      } catch (error) {
        console.error("Failed to fetch items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleAddItem = async () => {
    if (!newItemName) {
      alert("Please enter an item name");
      return;
    }

    const newItem: Omit<Items, "id"> = {
      name: newItemName,
      categoryId: 1, // Example category ID, adjust as necessary
      pictureUrl: "http://example.com/image.jpg", // Example picture URL
    };

    try {
      const createdItem = await createItem(newItem);
      setItems([...items, createdItem]);
      setNewItemName("");
    } catch (error) {
      console.error("Failed to create item:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Item List</h1>
      <ul>
        {items.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
      <input
        type="text"
        value={newItemName}
        onChange={(e) => setNewItemName(e.target.value)}
        placeholder="New item name"
      />
      <button onClick={handleAddItem}>Add Item</button>
    </div>
  );
};

export default SimpleTestComponent;
