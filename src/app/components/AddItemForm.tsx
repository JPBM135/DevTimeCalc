import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

type AddItemFormProps = Readonly<{
  onAdd(text: string, description?: string): void;
}>;

export function AddItemForm({ onAdd }: AddItemFormProps) {
  const [text, setText] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (text.trim()) {
      onAdd(text.trim(), description.trim() || undefined);
      setText('');
      setDescription('');
    }
  };

  return (
    <form className="mt-2 flex w-full flex-col gap-2" onSubmit={handleSubmit}>
      <div className="flex gap-2">
        <Input
          className=""
          onChange={(elm) => setText(elm.target.value)}
          placeholder="Title"
          type="text"
          value={text}
        />
        <Button disabled={!text.trim()} type="submit">
          Add
        </Button>
      </div>
      <Textarea
        className="h-20 max-h-40"
        onChange={(elm) => setDescription(elm.target.value)}
        placeholder="Description"
        value={description}
      />
    </form>
  );
}
