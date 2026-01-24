import { useCallback, useState } from 'react';
import useCollectionItemStore from '@/store/collection-item-store';
import useConnectionStore from '@/store/connection-store';
import useEnvironmentStore from '@/store/environment-store';
import useInterceptionScriptStore from '@/store/interception-script-store';
import { hasChildren } from '@/utils/collection-util';
import { FileJson, Loader2, Upload, X } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

import { BASE_MODEL_TYPE, type BaseItem } from '@/types/base';
import { COLLECTION_TYPE, type CollectionItem, type ExportableCollectionItem } from '@/types/collection';
import type { Connection } from '@/types/connection';
import type { Environment } from '@/types/environment';
import type { InterceptionScript } from '@/types/interception-script';
import { cn, formatBytes } from '@/lib/utils';
import { useActiveItem } from '@/hooks/app/use-active-item';
import { Button } from '@/components/common/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/common/dialog';
import { CollectionTreeSelector } from '@/components/app/selector/collection-tree-selector';

interface ImportItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const IMPORT_STAGE = {
  FILE_SELECTION: 'file-selection',
  PARENT_SELECTION: 'parent-selection',
} as const;

type ImportStage = (typeof IMPORT_STAGE)[keyof typeof IMPORT_STAGE];

export function ImportItemDialog({ open, onOpenChange }: ImportItemDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [importStage, setImportStage] = useState<ImportStage>(IMPORT_STAGE.FILE_SELECTION);
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
  const [itemToImport, setItemToImport] = useState<BaseItem | null>(null);

  const { saveCollectionItem } = useCollectionItemStore();
  const { saveEnvironment } = useEnvironmentStore();
  const { saveConnection } = useConnectionStore();
  const { saveInterceptionScript } = useInterceptionScriptStore();

  // Reset state when dialog closes
  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);
    if (!isOpen) {
      // Small timeout to allow transition to finish
      setTimeout(() => {
        setFile(null);
        setImportStage(IMPORT_STAGE.FILE_SELECTION);
        setSelectedParentId(null);
        setItemToImport(null);
        setIsLoading(false);
      }, 300);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    open: openFileSelector,
  } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json'],
    },
    maxFiles: 1,
    noClick: true,
  });

  const { activeWorkspace } = useActiveItem();

  const handleNextStepOrImport = async () => {
    if (!file) return;

    if (itemToImport && importStage === IMPORT_STAGE.PARENT_SELECTION) {
      // Proceed to final import with parent ID
      if (!selectedParentId) {
        toast.error('Please select a parent collection or folder');
        return;
      }
      await finalizeImport(itemToImport, selectedParentId);
      return;
    }

    setIsLoading(true);

    try {
      const text = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(reader.error);
        reader.readAsText(file);
      });

      const data = JSON.parse(text);

      if (!isValidBaseItem(data)) {
        throw new Error('Invalid file format. File must be a valid Chrollo export.');
      }

      // Check for Folder/Request types that need parent selection
      if (
        data.modelType === BASE_MODEL_TYPE.COLLECTION &&
        'collectionItemType' in data &&
        ((data as CollectionItem).collectionItemType === COLLECTION_TYPE.FOLDER ||
          (data as CollectionItem).collectionItemType === COLLECTION_TYPE.REQUEST)
      ) {
        setItemToImport(data);
        setImportStage(IMPORT_STAGE.PARENT_SELECTION);
        setIsLoading(false);
        return;
      }

      await importItem(data);
      toast.success('Item imported successfully');
      handleOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to import item');
      setIsLoading(false);
    }
  };

  const isValidBaseItem = (data: unknown): data is BaseItem => {
    return (
      typeof data === 'object' &&
      data !== null &&
      'modelType' in data &&
      typeof (data as BaseItem).modelType === 'string' &&
      Object.keys(BASE_MODEL_TYPE).includes((data as BaseItem).modelType)
    );
  };

  const sanitizeItem = <T extends BaseItem>(item: T, workspaceId: string): T => {
    const { id, createdBy, createdDate, updatedBy, updatedDate, ...rest } = item;
    void id;
    void createdBy;
    void createdDate;
    void updatedBy;
    void updatedDate;

    const hasChildrenProp = 'children' in item;
    const children = hasChildrenProp ? (item as Record<string, unknown>).children : undefined;

    return {
      ...rest,
      id: nanoid(),
      workspaceId,
      ...(children ? { children } : {}),
    } as unknown as T;
  };

  const finalizeImport = async (data: BaseItem, parentId?: string) => {
    setIsLoading(true);
    try {
      await importItem(data, parentId);
      toast.success('Item imported successfully');
      handleOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to import item');
    } finally {
      setIsLoading(false);
    }
  };

  const importItem = async (data: BaseItem, parentId?: string) => {
    if (!activeWorkspace?.id) {
      toast.error('No active workspace selected');
      return;
    }

    switch (data.modelType) {
      case BASE_MODEL_TYPE.COLLECTION:
        await saveCollectionItemRecursive(data as ExportableCollectionItem, activeWorkspace.id, parentId);
        break;
      case BASE_MODEL_TYPE.ENVIRONMENT: {
        const sanitized = sanitizeItem(data as Environment, activeWorkspace.id);
        await saveEnvironment(sanitized);
        break;
      }
      case BASE_MODEL_TYPE.CONNECTION: {
        const sanitized = sanitizeItem(data as Connection, activeWorkspace.id);
        await saveConnection(sanitized);
        break;
      }
      case BASE_MODEL_TYPE.INTERCEPTION_SCRIPT: {
        const sanitized = sanitizeItem(data as InterceptionScript, activeWorkspace.id);
        await saveInterceptionScript(sanitized);
        break;
      }
      default:
        toast.error(`Unsupported model type: ${(data as BaseItem).modelType}`);
        break;
    }
  };

  const saveCollectionItemRecursive = async (
    item: ExportableCollectionItem,
    workspaceId: string,
    parentId?: string
  ): Promise<string> => {
    const { children, ...restOfItem } = item;

    const itemToSave = {
      ...restOfItem,
      id: nanoid(),
      workspaceId,
      children: [] as string[],
    } as CollectionItem;

    if (parentId && 'parentId' in itemToSave) {
      (itemToSave as CollectionItem & { parentId: string }).parentId = parentId;
    }

    await saveCollectionItem(itemToSave);

    // If we have a parent, we need to update the parent's children list
    // Note: The store usually handles adding to parent if `parentId` is present in `itemToSave`
    // but explicit update might be safe. `saveCollectionItem` typically handles `parentId` logic
    // by fetching parent and updating it.

    const newChildrenIds: string[] = [];
    if (children && children.length > 0) {
      for (const child of children) {
        const childId = await saveCollectionItemRecursive(child, workspaceId, itemToSave.id);
        newChildrenIds.push(childId);
      }
    }

    if (newChildrenIds.length > 0 && hasChildren(itemToSave)) {
      const updatedItem = { ...itemToSave, children: newChildrenIds };
      await saveCollectionItem(updatedItem);
    }

    return itemToSave.id;
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md" onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>
            {importStage === IMPORT_STAGE.FILE_SELECTION ? (
              'Import'
            ) : (
              <span>
                Save To <span className="text-sm text-muted-foreground">Select a collection/folder</span>
              </span>
            )}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {importStage === IMPORT_STAGE.FILE_SELECTION
              ? 'Import a collection, environment, connection or script.'
              : 'Select a parent folder or collection for the imported item.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-2">
          {importStage === IMPORT_STAGE.FILE_SELECTION ? (
            !file ? (
              <div
                {...getRootProps()}
                className={cn(
                  'relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg transition-colors',
                  isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:bg-muted/50'
                )}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-2 text-center p-4">
                  <div className="p-3 rounded-full bg-secondary/50 mb-2">
                    <Upload className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p>Drag & drop files here</p>
                    <p className="text-sm text-muted-foreground">Or click to browse (max 1 file)</p>
                  </div>
                  <Button variant="secondary" size="sm" className="mt-2" onClick={openFileSelector}>
                    Browse files
                  </Button>
                </div>
              </div>
            ) : (
              <div className="relative overflow-hidden rounded-lg border bg-card p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <FileJson className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate pr-4">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
                  </div>
                  {isLoading ? (
                    <div className="flex h-8 w-8 items-center justify-center">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => {
                        setFile(null);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            )
          ) : (
            <div className="border rounded-md">
              <CollectionTreeSelector selectedId={selectedParentId} onSelect={setSelectedParentId} height={250} />
            </div>
          )}
        </div>

        <DialogFooter>
          {importStage === IMPORT_STAGE.PARENT_SELECTION && (
            <Button
              variant="ghost"
              onClick={() => {
                setImportStage(IMPORT_STAGE.FILE_SELECTION);
                setSelectedParentId(null);
              }}
              disabled={isLoading}
            >
              Back
            </Button>
          )}
          {importStage === IMPORT_STAGE.FILE_SELECTION && (
            <Button variant="ghost" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
          )}
          <Button onClick={handleNextStepOrImport} disabled={!file || isLoading}>
            {isLoading ? 'Importing...' : importStage === IMPORT_STAGE.FILE_SELECTION ? 'Import' : 'Confirm Import'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
