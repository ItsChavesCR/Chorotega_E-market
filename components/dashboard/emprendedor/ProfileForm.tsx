"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { UpdateUserPayload, User } from "@/types/user";

const LANGS = [
  { value: "es", label: "Español" },
  { value: "en", label: "English" },
] as const;

export default function ProfileForm({
  me,
  onSave,
  saving,
}: {
  me: User;
  onSave: (payload: UpdateUserPayload) => Promise<void> | void;
  saving?: boolean;
}) {
  const [form, setForm] = React.useState<UpdateUserPayload>({
    name: me.name ?? "",
    phone: me.phone ?? "",
    address: me.address ?? "",
    bio: me.bio ?? "",
    language: (me.language as "es" | "en") ?? "es",
    timezone: me.timezone ?? "America/Costa_Rica",
  });

  React.useEffect(() => {
    setForm({
      name: me.name ?? "",
      phone: me.phone ?? "",
      address: me.address ?? "",
      bio: me.bio ?? "",
      language: (me.language as "es" | "en") ?? "es",
      timezone: me.timezone ?? "America/Costa_Rica",
    });
  }, [me]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Información del perfil</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label>Nombre</Label>
            <Input
              value={form.name ?? ""}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Correo</Label>
            <Input value={me.email} disabled />
          </div>

          <div className="space-y-2">
            <Label>Teléfono</Label>
            <Input
              value={form.phone ?? ""}
              onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label>Dirección</Label>
            <Input
              value={form.address ?? ""}
              onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label>Sobre ti</Label>
            <Textarea
              rows={4}
              value={form.bio ?? ""}
              onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
              placeholder="Breve descripción…"
            />
          </div>

          <div className="space-y-2">
            <Label>Idioma</Label>
            <Select
              value={form.language ?? "es"}
              onValueChange={(v) => setForm((p) => ({ ...p, language: v as "es" | "en" }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGS.map((l) => (
                  <SelectItem key={l.value} value={l.value}>
                    {l.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Zona horaria</Label>
            <Input
              value={form.timezone ?? ""}
              onChange={(e) => setForm((p) => ({ ...p, timezone: e.target.value }))}
              placeholder="America/Costa_Rica"
            />
          </div>

          <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
            <Button type="submit" disabled={saving}>
              {saving ? "Guardando…" : "Guardar cambios"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
