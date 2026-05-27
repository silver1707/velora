import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;
const LEFT = 42;
const RIGHT = PAGE_WIDTH - 42;

type EntryRow = {
  amount: number;
  payment_method: string | null;
  received_at: string;
  notes: string | null;
  clients?: { name: string | null } | null;
  service_records?: { service_type: string | null } | null;
};

function cleanText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7E]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function pdfString(value: string) {
  return `(${cleanText(value).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)")})`;
}

function money(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value ?? 0));
}

function dateLabel(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

function drawText(text: string, x: number, y: number, size = 10) {
  return `BT /F1 ${size} Tf ${x} ${y} Td ${pdfString(text)} Tj ET\n`;
}

function fillRect(x: number, y: number, width: number, height: number, color: string) {
  return `${color} rg ${x} ${y} ${width} ${height} re f\n`;
}

function line(x1: number, y1: number, x2: number, y2: number, color = "0.82 0.78 0.88") {
  return `${color} RG 0.6 w ${x1} ${y1} m ${x2} ${y2} l S\n`;
}

function truncate(value: string, max: number) {
  const text = cleanText(value);
  return text.length > max ? `${text.slice(0, max - 3)}...` : text;
}

function buildPdf(entries: EntryRow[], fields: string[], fromLabel: string, toLabel: string) {
  const total = entries.reduce((sum, entry) => sum + Number(entry.amount ?? 0), 0);
  const columns = [
    { key: "date", label: "Data", width: 62, get: (entry: EntryRow) => dateLabel(entry.received_at), max: 10 },
    { key: "client", label: "Cliente", width: 116, get: (entry: EntryRow) => entry.clients?.name ?? "Avulso", max: 22 },
    { key: "service", label: "Servico", width: 116, get: (entry: EntryRow) => entry.service_records?.service_type ?? "Avulso", max: 22 },
    { key: "payment", label: "Pagamento", width: 88, get: (entry: EntryRow) => entry.payment_method ?? "Nao informado", max: 17 },
    { key: "notes", label: "Obs.", width: 86, get: (entry: EntryRow) => entry.notes ?? "", max: 18 },
    { key: "amount", label: "Valor", width: 82, get: (entry: EntryRow) => money(entry.amount), max: 15 },
  ].filter((column) => column.key === "date" || column.key === "amount" || fields.includes(column.key));

  const rowsPerPage = 24;
  const chunks: EntryRow[][] = [];
  for (let index = 0; index < entries.length || index === 0; index += rowsPerPage) {
    chunks.push(entries.slice(index, index + rowsPerPage));
  }

  const objects: Record<number, string> = {
    1: "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    3: "<< /Type /Catalog /Pages 2 0 R >>",
  };
  const pages: number[] = [];
  let nextObj = 4;

  chunks.forEach((chunk, pageIndex) => {
    let stream = "";
    stream += fillRect(0, PAGE_HEIGHT - 96, PAGE_WIDTH, 96, "0.32 0.24 0.54");
    stream += fillRect(LEFT, PAGE_HEIGHT - 152, 166, 42, "0.93 0.90 0.98");
    stream += fillRect(LEFT + 178, PAGE_HEIGHT - 152, 166, 42, "0.91 0.98 0.95");
    stream += fillRect(LEFT + 356, PAGE_HEIGHT - 152, 154, 42, "0.98 0.94 0.84");
    stream += "1 1 1 rg\n";
    stream += drawText("Velora", LEFT, PAGE_HEIGHT - 45, 22);
    stream += drawText("Relatorio financeiro", LEFT, PAGE_HEIGHT - 67, 15);
    stream += drawText(`${fromLabel} ate ${toLabel}`, LEFT, PAGE_HEIGHT - 84, 10);
    stream += "0.14 0.12 0.18 rg\n";
    stream += drawText("Receita total", LEFT + 12, PAGE_HEIGHT - 128, 9);
    stream += drawText(money(total), LEFT + 12, PAGE_HEIGHT - 146, 14);
    stream += drawText("Lancamentos", LEFT + 190, PAGE_HEIGHT - 128, 9);
    stream += drawText(String(entries.length), LEFT + 190, PAGE_HEIGHT - 146, 14);
    stream += drawText("Gerado em", LEFT + 368, PAGE_HEIGHT - 128, 9);
    stream += drawText(dateLabel(new Date().toISOString()), LEFT + 368, PAGE_HEIGHT - 146, 14);

    let y = PAGE_HEIGHT - 190;
    stream += fillRect(LEFT, y - 7, RIGHT - LEFT, 24, "0.96 0.94 0.99");
    let x = LEFT + 8;
    columns.forEach((column) => {
      stream += "0.32 0.24 0.54 rg\n";
      stream += drawText(column.label, x, y, 9);
      x += column.width;
    });
    y -= 24;
    stream += line(LEFT, y + 8, RIGHT, y + 8);

    if (!chunk.length) {
      stream += "0.38 0.35 0.44 rg\n";
      stream += drawText("Nenhum recebimento encontrado para o periodo.", LEFT + 8, y - 16, 11);
    }

    chunk.forEach((entry, rowIndex) => {
      if (rowIndex % 2 === 0) {
        stream += fillRect(LEFT, y - 7, RIGHT - LEFT, 22, "0.985 0.98 0.995");
      }
      x = LEFT + 8;
      columns.forEach((column) => {
        stream += "0.18 0.16 0.22 rg\n";
        stream += drawText(truncate(column.get(entry), column.max), x, y, 8);
        x += column.width;
      });
      y -= 22;
    });

    stream += "0.45 0.42 0.52 rg\n";
    stream += drawText(`Pagina ${pageIndex + 1} de ${chunks.length}`, RIGHT - 88, 32, 8);

    const contentObj = nextObj++;
    const pageObj = nextObj++;
    objects[contentObj] = `<< /Length ${Buffer.byteLength(stream, "latin1")} >>\nstream\n${stream}endstream`;
    objects[pageObj] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 1 0 R >> >> /Contents ${contentObj} 0 R >>`;
    pages.push(pageObj);
  });

  objects[2] = `<< /Type /Pages /Kids [${pages.map((page) => `${page} 0 R`).join(" ")}] /Count ${pages.length} >>`;

  const maxObj = nextObj - 1;
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  for (let objectNumber = 1; objectNumber <= maxObj; objectNumber += 1) {
    offsets[objectNumber] = Buffer.byteLength(pdf, "latin1");
    pdf += `${objectNumber} 0 obj\n${objects[objectNumber]}\nendobj\n`;
  }
  const xrefOffset = Buffer.byteLength(pdf, "latin1");
  pdf += `xref\n0 ${maxObj + 1}\n0000000000 65535 f \n`;
  for (let objectNumber = 1; objectNumber <= maxObj; objectNumber += 1) {
    pdf += `${String(offsets[objectNumber]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${maxObj + 1} /Root 3 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return Buffer.from(pdf, "latin1");
}

export async function GET(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const params = request.nextUrl.searchParams;
  const now = new Date();
  const defaultFrom = new Date(now.getFullYear(), now.getMonth(), 1);
  const defaultTo = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const fromParam = params.get("from") || defaultFrom.toISOString().slice(0, 10);
  const toParam = params.get("to") || defaultTo.toISOString().slice(0, 10);
  const from = new Date(`${fromParam}T00:00:00`);
  const to = new Date(`${toParam}T23:59:59`);
  const fields = params.getAll("fields").length
    ? params.getAll("fields")
    : ["client", "service", "payment"];

  const { data, error } = await supabase
    .from("financial_entries")
    .select("amount, payment_method, received_at, notes, clients(name), service_records(service_type)")
    .eq("user_id", user.id)
    .gte("received_at", from.toISOString())
    .lte("received_at", to.toISOString())
    .order("received_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = (data ?? []).map((entry) => {
    const clients = Array.isArray(entry.clients) ? entry.clients[0] : entry.clients;
    const serviceRecords = Array.isArray(entry.service_records)
      ? entry.service_records[0]
      : entry.service_records;

    return {
      amount: Number(entry.amount ?? 0),
      payment_method: entry.payment_method,
      received_at: entry.received_at,
      notes: entry.notes,
      clients: clients ? { name: clients.name ?? null } : null,
      service_records: serviceRecords
        ? { service_type: serviceRecords.service_type ?? null }
        : null,
    };
  });

  const pdf = buildPdf(
    rows,
    fields,
    dateLabel(from.toISOString()),
    dateLabel(to.toISOString()),
  );
  const fileName = `velora-financeiro-${fromParam}-a-${toParam}.pdf`;

  return new NextResponse(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "no-store",
    },
  });
}
