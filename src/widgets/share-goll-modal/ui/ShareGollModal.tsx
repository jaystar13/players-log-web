import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { toast } from 'sonner'; // Assuming sonner is available for toasts

interface ShareGollModalProps {
  isOpen: boolean;
  onClose: () => void;
  shortUrl: string;
}

export const ShareGollModal: React.FC<ShareGollModalProps> = ({ isOpen, onClose, shortUrl }) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      toast.success('URL copied to clipboard!');
      onClose(); // Close modal after copying
    } catch (err) {
      console.error('Failed to copy URL:', err);
      toast.error('Failed to copy URL.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share Log</DialogTitle>
          <DialogDescription>
            Copy the shortened URL below to share your log.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center space-x-2">
            <Input id="short-url" value={shortUrl} readOnly className="flex-1" />
            <Button onClick={handleCopy} className="whitespace-nowrap">
              Copy URL
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
