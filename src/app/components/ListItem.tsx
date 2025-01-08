import { Minus, Plus, StackPlus, Trash, X } from '@phosphor-icons/react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import type { TodoItem } from '../page';
import { AddItemForm } from './AddItemForm';

type ListItemProps = Readonly<{
  addItem(text: string, description: string | null, parentId: string | null): void;
  item: TodoItem;
  removeItem(id: string): void;
  updateItem(id: string, updates: Partial<TodoItem>): void;
}>;

export function ListItem({ item, updateItem, addItem, removeItem }: ListItemProps) {
  const [showAddForm, setShowAddForm] = useState(false);

  const handleCheckboxChange = (checked: boolean) => {
    updateItem(item.id, { checked });
  };

  const handleHoursChange = (hours: string) => {
    updateItem(item.id, { hours: Number.parseFloat(hours) || 0 });
  };

  const calculateSubtotalHours = (item: TodoItem): number => {
    const childrenHours = item.children.reduce((total, child) => total + calculateSubtotalHours(child), 0);
    return item.hours + childrenHours;
  };

  return (
    <>
      <div className="flex items-start space-x-2">
        <Checkbox checked={item.checked} className="mt-1" onCheckedChange={handleCheckboxChange} />
        <div className="flex w-full flex-col gap-0.5">
          <div className="flex w-full items-center">
            <span className={item.checked ? 'line-through' : ''}>{item.text}</span>
            <span className="ml-2 text-gray-500">{item.description}</span>
          </div>
          {item.children.length > 0 && (
            <div className="w-full text-sm text-gray-500">Subtotal: {calculateSubtotalHours(item)} hours</div>
          )}
        </div>

        <div className="flex w-full items-end justify-end gap-3">
          {!showAddForm && (
            <div className="ml-2 flex items-center gap-1.5">
              <Button
                className="h-8"
                disabled={item.hours <= 0}
                onClick={() => updateItem(item.id, { hours: item.hours - 0.5 })}
                size="icon"
                variant="outline"
              >
                <Minus />
              </Button>

              <Input
                className="h-8 w-16"
                onChange={(elm) => handleHoursChange(elm.target.value)}
                placeholder="Hours"
                type="number"
                value={item.hours.toString()}
              />

              <Button
                className="h-8"
                onClick={() => updateItem(item.id, { hours: item.hours + 0.5 })}
                size="icon"
                variant="outline"
              >
                <Plus />
              </Button>
            </div>
          )}
          <Button className="h-8" onClick={() => setShowAddForm(!showAddForm)} size="icon" variant="outline">
            {showAddForm ? <X /> : <StackPlus />}
          </Button>
          <Button className="h-8" onClick={() => removeItem(item.id)} size="icon" variant="destructive">
            <Trash />
          </Button>
        </div>
      </div>
      {showAddForm && (
        <AddItemForm
          onAdd={(text, description) => {
            addItem(text, description ?? null, item.id);
            setShowAddForm(false);
          }}
        />
      )}
      <div className="ml-4 flex flex-col gap-2">
        {item.children.map((child) => (
          <ListItem
            addItem={addItem}
            item={child}
            key={child.id}
            removeItem={removeItem}
            updateItem={updateItem}
          />
        ))}
      </div>
    </>
  );
}
