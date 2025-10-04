"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function PasswordForm({
  onChangePassword,
  saving,
}: {
  onChangePassword: (current: string, next: string) => Promise<void> | void;
  saving?: boolean;
}) {
  const [current, setCurrent] = React.useState("");
  const [next, setNext] = React.useState("");
  const [confirm, setConfirm] = React.useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (next !== confirm) return alert("Las contraseñas no coinciden");
    onChangePassword(current, next);
    setCurrent(""); setNext(""); setConfirm("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Cambiar contraseña</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label>Contraseña actual</Label>
            <Input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Nueva contraseña</Label>
            <Input type="password" value={next} onChange={(e) => setNext(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Confirmar nueva</Label>
            <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
          </div>

          <div className="sm:col-span-2 flex justify-end">
            <Button type="submit" disabled={saving}>{saving ? "Guardando…" : "Actualizar contraseña"}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
