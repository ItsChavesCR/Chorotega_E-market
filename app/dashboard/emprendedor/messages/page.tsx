// src/app/dashboard/emprendedor/messages/page.tsx
"use client";

import * as React from "react";
import { MessageSquare } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import NewMessageForm from "@/components/messages/NewMessageForm";
import type { ConversationFilter } from "@/types/message";
import { supabase } from "@/lib/supabase/client";
import { useConversations } from "@/hooks/messages/useConversations";
import ConversationList from "@/components/dashboard/emprendedor/ConversationList";

export default function MessagesPage() {
  const [filter, setFilter] = React.useState<ConversationFilter>("all");
  const [userId, setUserId] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data?.user?.id));
  }, []);

  const { conversations, loading, error } = useConversations(userId);

  const items = React.useMemo(() => {
    if (filter === "all") return conversations;
    // filtro por rol del peer (cliente / repartidor)
    return conversations.filter((c) => c.otherUser.role === filter);
  }, [filter, conversations]);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          <h2 className="text-xl font-semibold tracking-tight">Mensajes</h2>
        </div>
        <NewMessageForm />
      </div>

      <p className="text-sm text-muted-foreground">
        Conversaciones con clientes y repartidores.
      </p>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as ConversationFilter)}>
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="client">Clientes</TabsTrigger>
          <TabsTrigger value="repartidor">Repartidores</TabsTrigger>
        </TabsList>
      </Tabs>

      <ConversationList items={items} loading={loading} error={error ?? false} />
    </section>
  );
}
