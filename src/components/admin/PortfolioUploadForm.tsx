"use client";

import { useRef, useState } from "react";
import { Icon } from "@/components/site/brand";
import { addPortfolioItem } from "@/app/admin/actions";

type Props = { categories: string[]; };

export function PortfolioUploadForm({ categories }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  async function compressImage(source: File): Promise<File> {
    const objectUrl = URL.createObjectURL(source);
    const image = new Image();
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("Falha ao carregar imagem."));
      image.src = objectUrl;
    });
    const maxDimension = 1600;
    let width = image.width;
    let height = image.height;
    if (width > maxDimension || height > maxDimension) {
      const scale = maxDimension / Math.max(width, height);
      width = Math.round(width * scale);
      height = Math.round(height * scale);
    }
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas indisponivel.");
    context.drawImage(image, 0, 0, width, height);
    URL.revokeObjectURL(objectUrl);
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) => (result ? resolve(result) : reject(new Error("Falha ao comprimir imagem."))),
        "image/jpeg",
        0.82,
      );
    });
    const baseName = source.name.replace(/\\.[^.]+$/, "") || "foto";
    return new File([blob], `${baseName}.jpg`, { type: "image/jpeg" });
  }

  async function handleSelectedFile(selected: File | null) {
    if (!selected || !selected.type.startsWith("image/")) return;
    try {
      const compressed = await compressImage(selected);
      setFile(compressed);
      setPreview(URL.createObjectURL(compressed));
    } catch {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  }

  function clearFile() {
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    const formData = new FormData(event.currentTarget);
    if (file) {
      formData.set("imageFile", file);
      formData.delete("imageUrl");
    }
    try {
      await addPortfolioItem(formData);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="mt-3 space-y-3">
      <div>
        <label htmlFor="title" className="field-label">Titulo *</label>
        <input id="title" name="title" required className="field" placeholder="Portao automatico preto" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="category" className="field-label">Categoria</label>
          <select id="category" name="category" className="field">
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="location" className="field-label">Local</label>
          <input id="location" name="location" className="field" placeholder="Junqueiropolis - SP" />
        </div>
      </div>
      <div>
        <label className="field-label">Imagem *</label>
        <div
          onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            void handleSelectedFile(event.dataTransfer.files?.[0] ?? null);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-[5px] border-2 border-dashed px-4 py-6 text-center transition ${dragging ? "border-brand bg-brand/5" : "border-line bg-paper"}`}
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Pre-visualizacao" className="max-h-40 rounded-[3px] object-contain" />
          ) : (
            <>
              <Icon name="plus" className="mb-2 h-6 w-6 text-muted" />
              <p className="text-[0.82rem] font-medium">Arraste a imagem ou toque para escolher</p>
              <p className="mt-1 text-[0.72rem] text-muted">Funciona com arquivos do PC e galeria do celular.</p>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => void handleSelectedFile(event.target.files?.[0] ?? null)}
          />
        </div>
        {file && (
          <div className="flex items-center justify-between rounded-[3px] border border-line bg-paper px-3 py-2 text-[0.76rem]">
            <span className="truncate">{file.name}</span>
            <button type="button" onClick={clearFile} className="font-semibold text-red-600">Remover</button>
          </div>
        )}
      </div>

      <div>
        <label htmlFor="imageUrl" className="field-label">Ou cole um link de imagem</label>
        <input id="imageUrl" name="imageUrl" className="field" placeholder="https://... ou /images/arquivo.jpg" disabled={Boolean(file)} />
      </div>

      <div>
        <label htmlFor="description" className="field-label">Descricao</label>
        <textarea id="description" name="description" rows={2} className="field resize-none" placeholder="Material, acabamento e detalhe do servico." />
      </div>

      <label className="flex items-center gap-2 text-[0.8rem]">
        <input type="checkbox" name="featured" className="h-4 w-4 accent-[#c8862c]" />
        Destacar na pagina inicial
      </label>

      <button type="submit" disabled={submitting} className="btn btn-dark w-full">
        <Icon name="plus" className="h-4 w-4" />
        {submitting ? "Enviando..." : "Adicionar ao portfolio"}
      </button>
    </form>
  );
}
