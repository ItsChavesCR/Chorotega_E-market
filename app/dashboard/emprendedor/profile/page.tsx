"use client";

import * as React from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import AvatarUploader from "@/components/dashboard/emprendedor/AvatarUploader";
import ProfileForm from "@/components/dashboard/emprendedor/ProfileForm";
import PasswordDialog from "@/components/dashboard/emprendedor/PasswordDialog";
import type { User, UpdateUserPayload } from "@/types/user";

/** DEMO: datos locales */
const DEMO_ME: User = {
  id: "me",
  name: "Kris Emprendedora",
  email: "kris@chorotega.market",
  phone: "8888-9999",
  address: "Nicoya, Guanacaste",
  bio: "Productora local y amante del café.",
  avatarUrl: "",
  role: "emprendedor",
  language: "es",
  timezone: "America/Costa_Rica",
};

export default function ProfilePage() {
  const [me, setMe] = React.useState<User>(DEMO_ME);
  const [savingProfile, setSavingProfile] = React.useState(false);
  const [savingPassword, setSavingPassword] = React.useState(false);

  const handleSaveProfile = async (payload: UpdateUserPayload) => {
    setSavingProfile(true);
    setMe((prev) => ({ ...prev, ...payload }));
    toast.success("Perfil actualizado (demo)");
    setSavingProfile(false);
  };

  const handleUploadAvatar = async (file: File) => {
    const objectUrl = URL.createObjectURL(file);
    setMe((prev) => ({ ...prev, avatarUrl: objectUrl }));
    toast.success("Foto actualizada (demo)");
  };

  const handleChangePassword = async (_current: string, _next: string) => {
    setSavingPassword(true);
    toast.success("Contraseña actualizada (demo)");
    setSavingPassword(false);
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Perfil</h2>
          <p className="text-sm text-muted-foreground">Administra tu información personal.</p>
        </div>

        {/* Botón que abre el modal */}
        <PasswordDialog
          onChangePassword={handleChangePassword}
          saving={savingPassword}
        />
      </div>

      {/* Cabecera con avatar */}
      <Card className="p-4">
        <div className="flex items-center justify-between gap-4">
          <AvatarUploader
            name={me.name}
            avatarUrl={me.avatarUrl}
            onUpload={handleUploadAvatar}
          />
        </div>
      </Card>

      {/* Form de datos básicos */}
      <ProfileForm me={me} onSave={handleSaveProfile} saving={savingProfile} />
    </section>
  );
}
