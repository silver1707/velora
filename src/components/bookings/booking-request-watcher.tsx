"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type BookingSummary = {
  pendingCount: number;
  latestRequestId: string | null;
  latestServiceId: string | null;
  latestServiceUpdatedAt: string | null;
};

export function BookingRequestWatcher({
  initialPendingCount,
  initialLatestRequestId,
}: {
  initialPendingCount: number;
  initialLatestRequestId?: string | null;
}) {
  const router = useRouter();
  const previousCountRef = useRef(initialPendingCount);
  const latestRequestRef = useRef(initialLatestRequestId ?? null);
  const latestServiceRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function syncPendingRequests({ announce }: { announce: boolean }) {
      try {
        const response = await fetch("/api/booking-requests/summary", {
          cache: "no-store",
        });

        if (!response.ok) {
          return;
        }

        const summary = (await response.json()) as BookingSummary;
        const hasNewRequest =
          summary.latestRequestId &&
          summary.latestRequestId !== latestRequestRef.current &&
          summary.pendingCount > previousCountRef.current;
        const countChanged = summary.pendingCount !== previousCountRef.current;
        const serviceChanged =
          latestServiceRef.current !== null &&
          `${summary.latestServiceId ?? ""}:${summary.latestServiceUpdatedAt ?? ""}` !==
            latestServiceRef.current;
        const serviceSnapshot = `${summary.latestServiceId ?? ""}:${summary.latestServiceUpdatedAt ?? ""}`;

        if (cancelled) {
          return;
        }

        if (hasNewRequest && announce) {
          toast("Novo pedido online", {
            description: "Ele ja apareceu em Pedidos para aceitar ou recusar.",
            action: {
              label: "Abrir",
              onClick: () => router.push("/pedidos"),
            },
          });
        }

        if (countChanged || serviceChanged) {
          router.refresh();
        }

        previousCountRef.current = summary.pendingCount;
        latestRequestRef.current = summary.latestRequestId;
        latestServiceRef.current = serviceSnapshot;
      } catch {
        // A proxima tentativa cobre falhas momentaneas de rede ou sessao.
      }
    }

    syncPendingRequests({ announce: false });
    const interval = window.setInterval(
      () => syncPendingRequests({ announce: true }),
      20_000,
    );

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [router]);

  return null;
}
