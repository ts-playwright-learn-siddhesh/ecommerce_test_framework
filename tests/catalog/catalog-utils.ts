import { expectedProducts } from './catalog.data.ts';

type ExpectedProduct = (typeof expectedProducts)[number];
type ExpectedProductName = ExpectedProduct['name'];

export function getExpectedProduct(productName: ExpectedProductName): ExpectedProduct {
  const expectedProduct = expectedProducts.find((p) => p.name === productName);

  if (!expectedProduct) {
    throw new Error(`Missing expected product data for "${productName}"`);
  }

  return expectedProduct;
}
