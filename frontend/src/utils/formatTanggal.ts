export const formatTanggal = (dateStr: string) => {
  if (!dateStr) return "-";

  const date = new Date(dateStr);

  const tanggal = date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const jam = date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return `${tanggal}, ${jam}`;
};

export const formatTanggalRange = (startStr: string, endStr: string) => {
  if (!startStr) return "-";

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (!endStr) return formatDate(startStr);

  return `${formatDate(startStr)} - ${formatDate(endStr)}`;
};
