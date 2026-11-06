import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { Trash2, X } from "lucide-react";
import { clearHistory, loadHistory, type HistoryEntry } from "@/lib/history";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function HistoryDialog({ open, onOpenChange }: Props) {
  const [items, setItems] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    if (open) setItems(loadHistory());
  }, [open]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="modal-back" />
        <Dialog.Content className="modal">
          <div className="modal-head">
            <Dialog.Title>Önceki testler</Dialog.Title>
            <Dialog.Close className="icon-x" aria-label="Kapat">
              <X />
            </Dialog.Close>
          </div>
          <Dialog.Description className="muted">
            Son 20 sonuç bu cihazda saklanır. Hesabın yoktur, başka telefona geçmez.
          </Dialog.Description>
          <div className="hist-list">
            {items.length === 0 ? (
              <p className="muted">Henüz kayıtlı test yok.</p>
            ) : (
              items.map((item) => (
                <div className="hist-item" key={item.t}>
                  <span>
                    {new Date(item.t).toLocaleString("tr-TR")}
                    {item.demo ? " · demo" : ""}
                  </span>
                  <span>
                    ↓ <b>{item.d.toFixed(1)}</b> ↑ <b>{item.u.toFixed(1)}</b> Mbps · {item.p.toFixed(0)} ms
                  </span>
                </div>
              ))
            )}
          </div>
          <div className="modal-foot">
            <button
              type="button"
              className="btn"
              onClick={() => {
                clearHistory();
                setItems([]);
              }}
            >
              <Trash2 />
              Geçmişi temizle
            </button>
            <Dialog.Close className="btn primary">Tamam</Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
