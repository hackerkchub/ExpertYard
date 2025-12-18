export const getCategoryNameById = (id, categories) =>
  categories.find(c => c.id === id)?.name || "";

export const getSubCategoryNameById = (id, subCategories) =>
  subCategories.find(sc => sc.id === id)?.name || "";
