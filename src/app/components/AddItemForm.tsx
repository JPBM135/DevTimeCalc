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
    <form className="mt-2 flex w-full items-center space-x-2" onSubmit={handleSubmit}>
      <div className="flex flex-grow flex-col gap-3">
        <Input
          className="flex-grow"
          onChange={(elm) => setText(elm.target.value)}
          placeholder="Title"
          type="text"
          value={text}
        />
        <Textarea
          className="h-20 max-h-40 flex-grow"
          onChange={(elm) => setDescription(elm.target.value)}
          placeholder="Description"
          value={description}
        />
      </div>
      <Button disabled={!text.trim()} type="submit">
        Add
      </Button>
    </form>
  );
}
