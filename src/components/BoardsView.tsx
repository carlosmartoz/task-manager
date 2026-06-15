import { useState } from "react";
import { Plus, LayoutGrid } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useConfirm } from "../context/ConfirmProvider";
import type { Board, BoardColor } from "../types";
import BoardCard from "./BoardCard";
import BoardForm from "./BoardForm";
import BoardDetail from "./BoardDetail";

export default function BoardsView() {
  const { boards, addBoard, updateBoard, deleteBoard } = useApp();
  const confirm = useConfirm();
  const [openId, setOpenId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Board | null>(null);

  const active = boards.find((b) => b.id === openId) ?? null;

  if (active) {
    return <BoardDetail board={active} onBack={() => setOpenId(null)} />;
  }

  const handleSubmit = (title: string, color: BoardColor) => {
    if (editing) updateBoard(editing.id, title, color);
    else addBoard(title, color);
    setEditing(null);
  };

  const askDelete = async (board: Board) => {
    const ok = await confirm({
      title: "Delete board?",
      message: `"${board.title}" and all of its tasks will be permanently removed.`,
      confirmLabel: "Delete",
      danger: true,
    });
    if (ok) deleteBoard(board.id);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">My boards</h1>
          <p className="text-sm text-slate-300">Organize your tasks by topic</p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
          className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500 active:scale-95"
        >
          <Plus size={18} /> New board
        </button>
      </div>

      {boards.length === 0 ? (
        <div className="animate-fade-in-up rounded-2xl border border-dashed border-slate-800 py-20 text-center">
          <LayoutGrid className="mx-auto mb-3 text-slate-600" size={40} />
          <p className="font-medium text-slate-200">You don't have any boards yet</p>
          <p className="mb-4 text-sm text-slate-400">
            Create your first board to start organizing tasks.
          </p>
          <button
            onClick={() => setFormOpen(true)}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 active:scale-95"
          >
            Create board
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {boards.map((board, i) => (
            <div
              key={board.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <BoardCard
                board={board}
                onOpen={() => setOpenId(board.id)}
                onEdit={() => {
                  setEditing(board);
                  setFormOpen(true);
                }}
                onDelete={() => askDelete(board)}
              />
            </div>
          ))}
        </div>
      )}

      <BoardForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
        board={editing ?? undefined}
      />
    </div>
  );
}
