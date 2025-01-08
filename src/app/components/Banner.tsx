import { Info } from '@phosphor-icons/react';

type BannerProps = Readonly<{
  description: string;
}>;

export function Banner({ description }: BannerProps) {
  return (
    <div className="flex items-center justify-start rounded-md bg-gray-900 p-4 dark:bg-gray-800">
      <Info className="mr-2 h-6 w-6" />
      <p className="text-sm">{description}</p>
    </div>
  );
}
