export const formatRupiah = (value: number | string): string => {
  if (value === "" || value === null || value === undefined) return "";

  const number = Number(value);

  if (isNaN(number) || number <= 0) return "";

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
};

// 🔥 khusus untuk ambil angka mentah dari input
export const parseRupiah = (value: string): string => {
  return value.replace(/[^0-9]/g, "");
};
