import { Button } from '@/components/ui/button';
import type { TodoItem } from '../page';

type ExportMarkdownProps = Readonly<{
  items: { [key: string]: TodoItem };
}>;

const generateMarkdown = (items: { [key: string]: TodoItem }, level = 0): string =>
  Object.values(items)
    .map((item) => {
      const indent = '  '.repeat(level);
      const childrenMarkdown = generateMarkdown(item.children, level + 1);
      return `${indent}- [${item.checked ? 'x' : ' '}] ${item.text} (${item.hours}h)\n${item.description ? `${indent}  - ${item.description}\n` : ''}${childrenMarkdown}`;
    })
    .join('');

export function ExportMarkdown({ items }: ExportMarkdownProps) {
  const copyToClipboard = async () => {
    const markdown = generateMarkdown(items);

    await navigator.clipboard.writeText(markdown);

    // eslint-disable-next-line no-alert
    alert('Markdown copied to clipboard!');
  };

  return (
    <Button onClick={copyToClipboard} variant="outline">
      Copy Markdown
    </Button>
  );
}
