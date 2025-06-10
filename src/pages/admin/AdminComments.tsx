import React from 'react';
import { Icon } from '@iconify/react';

export const AdminComments: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[rgb(var(--color-foreground))]">
            Comments
          </h1>
          <p className="text-[rgb(var(--color-muted-foreground))] mt-1">
            Moderate and manage blog post comments
          </p>
        </div>
        <button className="flex items-center px-4 py-2 border border-[rgb(var(--color-border))] text-[rgb(var(--color-foreground))] rounded-md hover:bg-[rgb(var(--color-muted))] transition-colors">
          <Icon icon="lucide:filter" width={16} height={16} className="mr-2" />
          Filter Comments
        </button>
      </div>

      <div className="bg-[rgb(var(--color-card))] p-12 rounded-lg border border-[rgb(var(--color-border))] text-center">
        <Icon icon="lucide:message-square" width={48} height={48} className="mx-auto text-[rgb(var(--color-muted-foreground))] mb-4" />
        <h3 className="text-lg font-medium text-[rgb(var(--color-foreground))] mb-2">
          Comments Management Coming Soon
        </h3>
        <p className="text-[rgb(var(--color-muted-foreground))]">
          Full comment moderation functionality will be implemented here.
        </p>
      </div>
    </div>
  );
}; 