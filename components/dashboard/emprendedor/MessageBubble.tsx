"use client";

import * as React from "react";
import { formatTime } from "@/types/message";

export default function MessageBubble({
  text,
  createdAt,
  mine,
}: {
  text: string;
  createdAt: string;
  mine?: boolean;
}) {
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={[
          "max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-sm",
          mine
            ? "bg-primary text-primary-foreground rounded-br-sm"
            : "bg-muted rounded-bl-sm",
        ].join(" ")}
      >
        <div className="whitespace-pre-wrap">{text}</div>
        <div
          className={[
            "mt-1 text-[10px]",
            mine ? "text-primary-foreground/80" : "text-muted-foreground",
          ].join(" ")}
        >
          {formatTime(createdAt)}
        </div>
      </div>
    </div>
  );
}
