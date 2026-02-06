"use client";

import { useState } from "react";

import { Edit, Eye, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function DataTableActions({
  onView,
  onEdit,
  onDelete,
  showDelete = true,
}: {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showDelete?: boolean;
}) {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  return (
    <div className="flex gap-2">
      {onView && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onView}
          title="View details"
        >
          <Eye className="h-4 w-4" />
        </Button>
      )}
      {onEdit && (
        <Button variant="ghost" size="icon" onClick={onEdit} title="Edit">
          <Edit className="h-4 w-4" />
        </Button>
      )}
      {onDelete && showDelete && (
        <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              title="Delete"
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this record? This action cannot
                be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setDeleteConfirmOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  onDelete();
                  setDeleteConfirmOpen(false);
                }}
              >
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export function AddButton({
  label = "Add",
  onClick,
}: {
  label?: string;
  onClick: () => void;
}) {
  return (
    <Button onClick={onClick} className="w-full gap-2 sm:w-auto">
      <Plus className="h-4 w-4" />
      {label}
    </Button>
  );
}
