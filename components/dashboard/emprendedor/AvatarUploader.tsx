"use client";

import * as React from "react";
import { UploadCloud } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function AvatarUploader({
  name,
  avatarUrl,
  onUpload,
}: {
  name: string;
  avatarUrl?: string | null;
  onUpload: (file: File) => Promise<void> | void;
}) {
  const [file, setFile] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string>(avatarUrl || "");
  const [loading, setLoading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    setPreview(avatarUrl || "");
  }, [avatarUrl]);

  React.useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const pick = () => inputRef.current?.click();
  const change = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setLoading(true);
    try { await onUpload(f); } finally { setLoading(false); }
  };

  const initials = React.useMemo(() => {
    const [a = "", b = ""] = name.trim().split(/\s+/);
    return (a[0] || "").concat(b[0] || "").toUpperCase();
  }, [name]);

  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-20 w-20">
        <AvatarImage src={preview || ""} alt={name} />
        <AvatarFallback className="text-lg font-semibold">{initials}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-2">
        <Button onClick={pick} disabled={loading} className="gap-2">
          <UploadCloud className="h-4 w-4" />
          {loading ? "Subiendo..." : "Cambiar foto"}
        </Button>
        <input ref={inputRef} type="file" className="hidden" accept="image/*" onChange={change} />
        <p className="text-xs text-muted-foreground">JPG o PNG. Máx 2 MB.</p>
      </div>
    </div>
  );
}
