import Image from 'next/image';
import { User } from 'lucide-react';
import type { ContentAuthor } from '@/lib/content/types';

interface AuthorCardProps {
  author: ContentAuthor;
}

export function AuthorCard({ author }: AuthorCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-lg border bg-muted/20 p-4">
      {author.avatarUrl ? (
        <Image
          src={author.avatarUrl}
          alt={author.name}
          width={48}
          height={48}
          className="rounded-full object-cover"
        />
      ) : (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <User className="h-6 w-6 text-muted-foreground" aria-hidden />
        </div>
      )}
      <div>
        <p className="font-medium">{author.name}</p>
        {author.role && <p className="text-sm text-muted-foreground">{author.role}</p>}
      </div>
    </div>
  );
}
