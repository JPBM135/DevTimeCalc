'use client';

import { useEffect, useState } from 'react';
import { AddItemForm } from './components/AddItemForm';
import { Footer } from './components/Footer';
import { ListItem } from './components/ListItem';

export type TodoItem = {
  checked: boolean;
  children: TodoItem[];
  description?: string;
  hours: number;
  id: string;
  text: string;
};

export default function TodoList() {
  const [items, setItems] = useState<TodoItem[]>([]);

  useEffect(() => {
    const storedItems = localStorage.getItem('devHoursCalc.items');
    if (storedItems) {
      setItems(JSON.parse(storedItems));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('devHoursCalc.items', JSON.stringify(items));
  }, [items]);

  const addItem = (text: string, description: string | null, parentId: string | null = null) => {
    console.log('Adding item', text, description, parentId);
    const newItem: TodoItem = {
      id: Math.random().toString(36).slice(2, 11),
      text,
      description: description ?? undefined,
      checked: false,
      hours: 0,
      children: []
    };

    if (parentId === null) {
      setItems([...items, newItem]);
    } else {
      const updateItems = (items: TodoItem[]): TodoItem[] =>
        items.map((item) => {
          if (item.id === parentId) {
            return { ...item, children: [...item.children, newItem] };
          } else if (item.children.length > 0) {
            return { ...item, children: updateItems(item.children) };
          }

          return item;
        });
      setItems(updateItems(items));
    }
  };

  const updateItem = (id: string, updates: Partial<TodoItem>) => {
    const updateItems = (items: TodoItem[]): TodoItem[] =>
      items.map((item) => {
        if (item.id === id) {
          return { ...item, ...updates };
        } else if (item.children.length > 0) {
          return { ...item, children: updateItems(item.children) };
        }

        return item;
      });
    setItems(updateItems(items));
  };

  const removeItem = (id: string) => {
    const removeItems = (items: TodoItem[]): TodoItem[] =>
      items.reduce<TodoItem[]>((acc, item) => {
        if (item.id === id) {
          return acc;
        } else if (item.children.length > 0) {
          return [...acc, { ...item, children: removeItems(item.children) }];
        }

        return [...acc, item];
      }, []);

    setItems(removeItems(items));
  };

  const calculateTotalHours = (items: TodoItem[]): number =>
    items.reduce((total, item) => {
      const childrenHours = calculateTotalHours(item.children);
      return total + item.hours + childrenHours;
    }, 0);

  return (
    <div className="container mx-auto flex flex-col gap-4 p-4">
      <h1 className="mb-4 text-2xl font-bold">Dev Hour Calculator</h1>
      <AddItemForm onAdd={(text: string, description: string) => addItem(text, description)} />
      {items.map((item) => (
        <ListItem
          addItem={addItem}
          item={item}
          key={item.id}
          removeItem={removeItem}
          updateItem={updateItem}
        />
      ))}
      <div className="flex flex-col gap-2">
        {!items.length && <div className="mt-4 text-center text-gray-500">No items added yet.</div>}
      </div>
      <Footer totalHours={calculateTotalHours(items)} />
    </div>
  );
}
