export const paginate = <T>(
  data: T[],
  currentPage: number,
  itemsPerPage: number,
) => {
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

  return {
    totalItems,
    totalPages,
    startIndex,
    paginatedData,
  };
};
