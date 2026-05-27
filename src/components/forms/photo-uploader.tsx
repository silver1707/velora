"use client";

import { ImagePlus, Loader2, X } from "lucide-react";
import Image from "next/image";
import { useId, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { env, hasSupabaseConfig } from "@/lib/env";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const maxFileSize = 5 * 1024 * 1024;

export function PhotoUploader({
  name,
  label,
  initialValue,
}: {
  name: string;
  label: string;
  initialValue?: string | null;
}) {
  const id = useId();
  const [value, setValue] = useState(initialValue ?? "");
  const [loading, setLoading] = useState(false);

  async function uploadPhoto(file?: File) {
    if (!file) return;

    if (!hasSupabaseConfig) {
      toast.error("Configure o Supabase antes de enviar fotos.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Escolha uma imagem em JPG, PNG ou WebP.");
      return;
    }

    if (file.size > maxFileSize) {
      toast.error("A imagem precisa ter até 5 MB.");
      return;
    }

    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      toast.error("Entre novamente para enviar fotos.");
      setLoading(false);
      return;
    }

    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${user.id}/${crypto.randomUUID()}.${extension}`;
    const { error } = await supabase.storage
      .from(env.storageBucket)
      .upload(path, file, {
        cacheControl: "3600",
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(env.storageBucket).getPublicUrl(path);

    setValue(publicUrl);
    toast.success("Foto enviada.");
    setLoading(false);
  }

  return (
    <div className="grid gap-2">
      <input type="hidden" name={name} value={value} />
      <span className="text-sm font-medium text-foreground">{label}</span>
      <div
        className={cn(
          "overflow-hidden rounded-lg border border-border/75 bg-background/45",
          value ? "p-2" : "p-4",
        )}
      >
        {value ? (
          <div className="relative">
            <Image
              src={value}
              alt={label}
              width={720}
              height={540}
              className="aspect-[4/3] w-full rounded-lg object-cover"
              unoptimized
            />
            <Button
              type="button"
              size="icon"
              variant="danger"
              aria-label="Remover foto"
              className="absolute right-2 top-2"
              onClick={() => setValue("")}
            >
              <X size={16} />
            </Button>
          </div>
        ) : (
          <div className="flex min-h-36 flex-col items-center justify-center text-center">
            <ImagePlus size={28} className="text-lilac" />
            <p className="mt-3 text-sm text-foreground">Nenhuma foto enviada</p>
            <p className="mt-1 text-xs leading-5 text-muted">
              JPG, PNG ou WebP até 5 MB.
            </p>
          </div>
        )}
      </div>
      <input
        id={id}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="sr-only"
        onChange={(event) => uploadPhoto(event.currentTarget.files?.[0])}
      />
      <label
        htmlFor={id}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border/80 bg-surface-raised/80 px-3 text-sm font-medium text-foreground transition hover:border-lilac/35 hover:bg-surface-glow"
      >
        {loading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <ImagePlus size={16} />
        )}
        {loading ? "Enviando..." : value ? "Trocar foto" : "Enviar foto"}
      </label>
    </div>
  );
}
