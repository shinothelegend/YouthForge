import { NextRequest } from "next/server";
import { RunStore } from "@/lib/store/runs";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const run = RunStore.getRun(id);

  if (!run) {
    return new Response("Run not found", { status: 404 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let sentCount = 0;

      // Stream existing recorded events first (supports instant replay / resume)
      const existingEvents = run.events;
      for (const event of existingEvents) {
        const payload = `id: ${event.id}\ndata: ${JSON.stringify(event)}\n\n`;
        controller.enqueue(encoder.encode(payload));
        sentCount++;
      }

      // If run is already completed or failed, close the stream cleanly
      if (run.status === "completed" || run.status === "failed") {
        controller.close();
        return;
      }

      // Otherwise, poll for new events up to 45 seconds with 400ms intervals
      const maxChecks = 110;
      let check = 0;

      const interval = setInterval(() => {
        check++;
        const currentEvents = run.events;

        while (sentCount < currentEvents.length) {
          const newEvent = currentEvents[sentCount];
          const payload = `id: ${newEvent.id}\ndata: ${JSON.stringify(newEvent)}\n\n`;
          controller.enqueue(encoder.encode(payload));
          sentCount++;
        }

        if (run.status === "completed" || run.status === "failed" || check >= maxChecks) {
          clearInterval(interval);
          controller.close();
        }
      }, 400);

      req.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
