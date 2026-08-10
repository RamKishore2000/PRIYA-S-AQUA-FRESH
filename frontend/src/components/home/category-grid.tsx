import { TopCategoriesSection } from "@/components/home/top-categories-section";
import { getCategories } from "@/services/catalog-service";

export async function CategoryGrid() {
  const categories = await getCategories();

  return <TopCategoriesSection categories={categories} />;
}
