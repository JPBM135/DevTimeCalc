'use client';

import Head from 'next/head';
import { useEffect, useState } from 'react';
import { AddItemForm } from './components/AddItemForm';
import { Banner } from './components/Banner';
import { ExportMarkdown } from './components/ExportMarkdown';
import { Footer } from './components/Footer';
import { ListItem } from './components/ListItem';

export type TodoItem = {
  checked: boolean;
  children: { [key: string]: TodoItem };
  description?: string;
  hours: number;
  id: string;
  text: string;
};

export default function TodoList() {
  const [items, setItems] = useState<{ [key: string]: TodoItem }>({});

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
      children: {}
    };

    if (parentId === null) {
      setItems({ ...items, [newItem.id]: newItem });
    } else {
      const updateItems = (items: { [key: string]: TodoItem }): { [key: string]: TodoItem } =>
        Object.fromEntries(
          Object.entries(items).map(([key, item]) => {
            if (item.id === parentId) {
              return [key, { ...item, children: { ...item.children, [newItem.id]: newItem } }];
            } else if (Object.keys(item.children).length > 0) {
              return [key, { ...item, children: updateItems(item.children) }];
            }

            return [key, item];
          })
        );
      setItems(updateItems(items));
    }
  };

  const updateItem = (id: string, updates: Partial<TodoItem>) => {
    const updateItems = (items: { [key: string]: TodoItem }): { [key: string]: TodoItem } =>
      Object.fromEntries(
        Object.entries(items).map(([key, item]) => {
          if (item.id === id) {
            return [key, { ...item, ...updates }];
          } else if (Object.keys(item.children).length > 0) {
            return [key, { ...item, children: updateItems(item.children) }];
          }

          return [key, item];
        })
      );
    setItems(updateItems(items));
  };

  const removeItem = (id: string) => {
    // eslint-disable-next-line no-alert
    const confirmDelete = window.confirm('Are you sure you want to delete this item and all its children?');
    if (!confirmDelete) {
      return;
    }

    const removeItems = (items: { [key: string]: TodoItem }): { [key: string]: TodoItem } =>
      Object.fromEntries(
        Object.entries(items).reduce<[string, TodoItem][]>((acc, [key, item]) => {
          if (item.id === id) {
            return acc;
          } else if (Object.keys(item.children).length > 0) {
            return [...acc, [key, { ...item, children: removeItems(item.children) }]];
          }

          return [...acc, [key, item]];
        }, [])
      );
    setItems(removeItems(items));
  };

  const calculateTotalHours = (items: { [key: string]: TodoItem }): number =>
    Object.values(items).reduce((total, item) => {
      const childrenHours = calculateTotalHours(item.children);
      return total + item.hours + childrenHours;
    }, 0);

  return (
    <>
      <Head>
        <title>Freelance Hour Calculator</title>
        <meta content="Calculate your dev hours for freelance projects." name="description" />
        <meta content="Freelance Hour Calculator" property="og:title" />
        <meta content="Calculate your dev hours for freelance projects." property="og:description" />
        <meta content="https://dev-hours.jpbm.dev" property="og:url" />
        <meta content="website" property="og:type" />
        <meta content="summary_large_image" name="twitter:card" />
        <meta content="@borges135_" name="twitter:site" />
        <meta content="Freelance Hour Calculator" name="twitter:title" />
        <meta content="Calculate your dev hours for freelance projects." name="twitter:description" />
      </Head>
      <div className="container mx-auto flex flex-col gap-4 p-4">
        <h1 className="mb-4 text-2xl font-bold">Freelance Hour Calculator</h1>
        <Banner description="Add items and adjust the hours to calculate your total freelance cost!" />
        <AddItemForm onAdd={(text: string, description: string) => addItem(text, description)} />
        {Object.values(items).map((item) => (
          <ListItem
            addItem={addItem}
            item={item}
            key={item.id}
            removeItem={removeItem}
            updateItem={updateItem}
          />
        ))}
        <div className="flex flex-col gap-2">
          {!Object.keys(items).length && (
            <div className="mt-4 text-center text-gray-500">No items added yet.</div>
          )}
        </div>
        <Footer totalHours={calculateTotalHours(items)} />
        <ExportMarkdown items={items} />
      </div>
    </>
  );
}
