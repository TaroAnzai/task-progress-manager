// components/DraggableTable.tsx

import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { closestCenter, DndContext, type DragEndEvent } from '@dnd-kit/core';
import { restrictToFirstScrollableAncestor, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// -------------------- Context --------------------

/** Contextで共有するテーブル情報（型ジェネリック） */
type DraggableTableContextType<T> = {
  items: T[];
  getId: (item: T) => string | number;
  onReorder: (items: T[]) => void;
  useGrabHandle?: boolean;
};

// unknownベースでcreateContext（anyは使わない）
const DraggableTableContext = createContext<unknown>(null);

// 型安全にcontextを取得するフック
const useDraggableTableContext = <T,>(): DraggableTableContextType<T> => {
  const ctx = useContext(DraggableTableContext);
  if (!ctx) throw new Error('DraggableTableは親で定義してください');
  return ctx as DraggableTableContextType<T>;
};

// -------------------- DraggableTable --------------------

type DraggableTableProps<T> = {
  items: T[];
  getId: (item: T) => string | number;
  onReorder: (items: T[]) => void;
  children: ReactNode;
  useGrabHandle?: boolean;
  className?: string;
};

export const DraggableTable = <T,>({
  items,
  getId,
  onReorder,
  children,
  useGrabHandle = false,
  className,
}: DraggableTableProps<T>) => {
  const ids = useMemo(() => items.map(getId), [items, getId]);
  const [localItems, setLocalItems] = useState(items);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  useEffect(() => {
    const root = document.documentElement;
    if (dragging) root.classList.add('during-drag');
    else root.classList.remove('during-drag');
    return () => root.classList.remove('during-drag');
  }, [dragging]);
  const handleDragEnd = (event: DragEndEvent) => {
    setDragging(false);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = ids.indexOf(active.id);
    const newIndex = ids.indexOf(over.id);
    const newItems = arrayMove(items, oldIndex, newIndex);
    setLocalItems(newItems);
    onReorder(newItems);
  };
  // TableRowにドラッグハンドルを追加するヘルパー関数
  const addDragHandleToTableRow = (row: ReactNode) => {
    const tableRow = row as React.ReactElement<{ children: ReactNode }>;
    // TableRowコンポーネントでない場合はそのまま返す
    if (!isValidElement(tableRow) || tableRow.type !== TableRow) {
      return row;
    }

    // TableRowの先頭にドラッグハンドル用のTableHeadを追加
    const dragHandle = <TableHead key="drag-header" className="w-6 px-1 py-1"></TableHead>;

    return cloneElement(tableRow, {
      children: [dragHandle, ...Children.toArray(tableRow.props.children)],
    });
  };
  return (
    <DraggableTableContext.Provider
      value={
        {
          items: localItems,
          getId,
          onReorder,
          useGrabHandle,
        } satisfies DraggableTableContextType<T>
      }
    >
      <DndContext
        collisionDetection={closestCenter}
        onDragStart={() => setDragging(true)}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setDragging(false)}
        modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]}
      >
        <Table className={className}>
          {Children.map(children, (child) => {
            if (!useGrabHandle) {
              return child; // ドラッグハンドルが不要な場合は何も変更しない
            }
            if (isValidElement(child) && child.type === TableHeader) {
              // TableHeaderコンポーネントかどうかをチェック
              const header = child as React.ReactElement<{ children: ReactNode }>;
              return cloneElement(header, {
                children: Children.map(header.props.children, (row) =>
                  addDragHandleToTableRow(row)
                ),
              });
            } else {
              return child;
            }
          })}
        </Table>
      </DndContext>
    </DraggableTableContext.Provider>
  );
};

// -------------------- DraggableTableBody --------------------

type DraggableTableBodyProps = {
  children: ReactNode;
  className?: string;
};

export const DraggableTableBody = ({ children, className }: DraggableTableBodyProps) => {
  const ids = Children.toArray(children)
    .filter(isValidElement)
    .map((child) => {
      const el = child as React.ReactElement<{ id: string | number }>;
      return el.props.id;
    });

  return (
    <SortableContext items={ids} strategy={verticalListSortingStrategy}>
      <TableBody className={className}>{children}</TableBody>
    </SortableContext>
  );
};

// -------------------- DraggableRow --------------------

type DraggableRowProps = {
  id: string | number;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
};

export const DraggableRow = ({ id, children, className, disabled = false }: DraggableRowProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });
  const { useGrabHandle } = useDraggableTableContext();

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={`${
        useGrabHandle ? 'cursor-default group' : 'cursor-move' //useGrabHandle=trueの場合はホバー用にグループ化する
      } ${className ?? ''}`}
      {...(!useGrabHandle ? { ...attributes, ...listeners } : {})} // ← 行全体で使う時のみ渡す
    >
      {useGrabHandle && (
        <TableCell className="w-6 px-1 py-1">
          {disabled ? (
            <div></div>
          ) : (
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab text-gray-500 hover:text-black hidden group-hover:block"
              title="ドラッグして並び替え"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
        </TableCell>
      )}
      {children}
    </TableRow>
  );
};
