"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type FaqItem = {
  question: string;
  answer: string;
};

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="grid gap-3">
      {items.map((item, index) => {
        const open = openIndex === index;

        return (
          <article
            key={item.question}
            className="surface-row overflow-hidden rounded-lg transition duration-300 hover:bg-surface-glow/35"
          >
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left text-sm font-semibold text-foreground sm:px-5"
              aria-expanded={open}
              onClick={() => setOpenIndex(open ? null : index)}
            >
              <span>{item.question}</span>
              <ChevronDown
                size={18}
                className={cn(
                  "shrink-0 text-lilac transition-transform duration-300",
                  open && "rotate-180",
                )}
              />
            </button>
            <div
              className={cn(
                "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
                open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <p className="px-4 pb-4 text-sm leading-6 text-muted sm:px-5">
                  {item.answer}
                </p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
