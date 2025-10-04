export default function NotFound() {
  return (
    <div className="grid place-items-center rounded-2xl border bg-card p-10 text-center">
      <div>
        <p className="font-medium">Conversación no encontrada</p>
        <p className="text-sm text-muted-foreground">Verifica el enlace o vuelve a Mensajes.</p>
      </div>
    </div>
  );
}
