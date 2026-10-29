"use client";

export function DeleteLeadButton() {
  return (
    <button
      type="submit"
      onClick={(event) => {
        if (!window.confirm("Encerrar e remover este pedido da lista?")) {
          event.preventDefault();
        }
      }}
      className="btn btn-ghost w-full py-1.5 text-[0.74rem] text-red-700 hover:bg-red-50"
    >
      Encerrar pedido
    </button>
  );
}