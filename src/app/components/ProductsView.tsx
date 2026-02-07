import { useState, useEffect } from 'react';
import { ProductCard } from '@/app/components/ProductCard';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Checkbox } from '@/app/components/ui/checkbox';
import { Search, Filter, Grid3x3, LayoutGrid, X, Loader2 } from 'lucide-react';

import { Product, ProductPayload } from '../../types/product';

import { api } from '../../services/api';
import { toast } from 'sonner';

export function ProductsView() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    userid: import.meta.env.VITE_DEFAULT_USER_ID,
    name: '',
    tag: 'fruit',
    packaging: '',
    priceVariations: [
      { quantity: '', unit: 'unit', priceAmount: '' }
    ],
    description: '',
    features: [''] as string[],
    is_active: true,
  });

  const resetForm = () => {
    setFormData({
      userid: import.meta.env.VITE_DEFAULT_USER_ID,
      name: '',
      tag: 'fruit',
      packaging: '',
      priceVariations: [
        { quantity: '', unit: 'unit', priceAmount: '' }
      ],
      description: '',
      features: [''],
      is_active: true,
    });
    setEditingProduct(null);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);

    const priceVariations = Object.entries(product.price).map(([key, value]) => {
      let quantity = '';
      let unit = 'unit';
      let packagingStr = '';

      const packagingMatch = key.match(/^(.*) \((.*) (.*)\)$/);
      if (packagingMatch) {
        packagingStr = packagingMatch[1];
        quantity = packagingMatch[2];
        unit = packagingMatch[3];
      } else {
        const simpleMatch = key.match(/^(.*) (.*)$/);
        if (simpleMatch) {
          quantity = simpleMatch[1];
          unit = simpleMatch[2];
        }
      }
      return { quantity, unit, priceAmount: value.toString() };
    });

    // Use the first packaging found if any
    const packaging = Object.keys(product.price)[0].match(/^(.*) \(.*\)$/)?.[1] || '';

    setFormData({
      userid: product.userid,
      name: product.name,
      tag: product.tag,
      packaging: packaging,
      priceVariations: priceVariations,
      description: product.description.Description,
      features: Object.values(product.description.Features),
      is_active: product.is_active,
    });
    setIsModalOpen(true);
  };

  const handleAddVariation = () => {
    setFormData({
      ...formData,
      priceVariations: [{ quantity: '', unit: 'unit', priceAmount: '' }, ...formData.priceVariations]
    });
  };

  const handleRemoveVariation = (index: number) => {
    if (formData.priceVariations.length <= 1) return;
    const newVariations = formData.priceVariations.filter((_, i) => i !== index);
    setFormData({ ...formData, priceVariations: newVariations });
  };

  const handleVariationChange = (index: number, field: string, value: string) => {
    const newVariations = [...formData.priceVariations];
    newVariations[index] = { ...newVariations[index], [field]: value };
    setFormData({ ...formData, priceVariations: newVariations });
  };

  const handleAddFeature = () => {
    setFormData({
      ...formData,
      features: ['', ...formData.features]
    });
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const handleRemoveFeature = (index: number) => {
    if (formData.features.length <= 1) return;
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  const categories = ['All Products', 'Milk Products', 'Vegetables', 'fruit'];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await api.products.getAll();
      setProducts(data);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const isPriceValid = formData.priceVariations.every(v => {
      const price = parseFloat(v.priceAmount);
      return !isNaN(price) && v.quantity.trim() !== '';
    });

    if (!isPriceValid) {
      toast.error('Validation Error', {
        description: 'Please enter valid quantity and price for all variations'
      });
      return;
    }

    setIsSubmitting(true);

    const featuresObj: { [key: string]: string } = {};
    formData.features.forEach((feature, index) => {
      if (feature.trim()) {
        featuresObj[`key${index + 1}`] = feature;
      }
    });

    const priceObj: { [key: string]: number } = {};
    formData.priceVariations.forEach(v => {
      const key = formData.packaging
        ? `${formData.packaging} (${v.quantity} ${v.unit})`
        : `${v.quantity} ${v.unit}`;
      priceObj[key] = parseFloat(v.priceAmount);
    });

    // Construct Payload
    const payload: ProductPayload = {
      userid: formData.userid,
      name: formData.name,
      description: {
        Features: featuresObj,
        Description: formData.description
      },
      price: priceObj,
      tag: formData.tag,
      is_active: formData.is_active
    };

    try {
      if (editingProduct) {
        console.log('Sending update payload:', payload);
        await api.products.update(editingProduct.product_id, payload);
        toast.success('Product Updated', {
          description: `${payload.name} has been updated successfully.`
        });
      } else {
        console.log('Sending payload:', payload);
        await api.products.add(payload);
        toast.success('Product Added', {
          description: `${payload.name} has been added to your inventory.`
        });
      }

      await fetchProducts(); // Refresh list
      setIsModalOpen(false);
      resetForm();
    } catch (err: any) {
      console.error('Error saving product:', err);
      // Construct a better error message if possible
      const msg = err.message || 'Failed to save product';
      toast.error('Error Saving Product', {
        description: msg
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = (productId: string) => {
    toast('Delete Product?', {
      description: 'Are you sure you want to delete this product?',
      action: {
        label: 'Delete',
        onClick: async () => {
          try {
            await api.products.delete(productId, import.meta.env.VITE_DEFAULT_USER_ID);
            toast.success('Product Deleted', {
              description: 'The product has been removed successfully.'
            });
            await fetchProducts(); // Refresh list
          } catch (err: any) {
            console.error('Error deleting product:', err);
            toast.error('Delete Failed', {
              description: err.message || 'Failed to delete product'
            });
          }
        }
      },
    });
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All Products' || product.tag === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Products</h2>
          <p className="text-muted-foreground">Browse our fresh products collection</p>
        </div>
        <Button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          + Add New Product
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card"
          />
        </div>

        {/* Category Filter */}
        <div className="w-[180px]">
          <Select
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === 'fruit' ? 'Fruits' : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* View Toggle */}
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <LayoutGrid className="size-5" />
          </Button>
          <Button variant="outline" size="icon">
            <Filter className="size-5" />
          </Button>
        </div>
      </div>

      {/* Products Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredProducts.length} products
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => {
          return (
            <ProductCard
              key={product.product_id}
              product_id={product.product_id}
              name={product.name}
              category={product.tag}
              description={product.description}
              prices={product.price}
              image={`/Products/${product.tag.trim().toLowerCase()}.png`}
              is_active={product.is_active}
              onEdit={() => handleEditProduct(product)}
              onDelete={() => handleDeleteProduct(product.product_id)}
            />
          );
        })}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">No products found</p>
          <p className="text-sm text-muted-foreground mt-2">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-background rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-semibold">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="space-y-2">
                <label className="text-sm font-medium">User ID</label>
                <Input
                  required
                  placeholder={`e.g. ${import.meta.env.VITE_DEFAULT_USER_ID}`}
                  value={formData.userid}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, userid: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Product Name</label>
                <Input
                  required
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked: boolean | string) => setFormData({ ...formData, is_active: !!checked })}
                />
                <label
                  htmlFor="is_active"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Active Product
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <select
                    required
                    className="w-full h-9 rounded-md border border-input bg-input-background px-3 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                    value={formData.tag}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, tag: e.target.value })}
                  >
                    <option value="Milk Products">Milk Products</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="fruit">Fruits</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Packaging (Optional)</label>
                  <Input
                    placeholder="e.g. 1 box or 1 packet"
                    value={formData.packaging}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, packaging: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Unit/Weight & Price</label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddVariation}
                    className="h-7 px-2 text-xs"
                  >
                    + Add Variation
                  </Button>
                </div>

                {formData.priceVariations.map((variation, index) => (
                  <div key={index} className="grid grid-cols-2 gap-4 items-start bg-secondary/10 p-3 rounded-lg relative group">
                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground">Unit/Weight</label>
                      <div className="flex">
                        <Input
                          required
                          type="text"
                          placeholder="Qty"
                          value={variation.quantity}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleVariationChange(index, 'quantity', e.target.value)}
                          className="rounded-r-none border-r-0 h-8 text-xs"
                        />
                        <select
                          className="h-8 rounded-l-none border border-input bg-input-background px-1 text-xs outline-none"
                          value={variation.unit}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleVariationChange(index, 'unit', e.target.value)}
                        >
                          <option value="g">g</option>
                          <option value="kg">kg</option>
                          <option value="ml">ml</option>
                          <option value="L">L</option>
                          <option value="unit">unit</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs text-muted-foreground">Price (₹)</label>
                        {formData.priceVariations.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveVariation(index)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <X className="size-3" />
                          </button>
                        )}
                      </div>
                      <Input
                        required
                        type="number"
                        placeholder="0.00"
                        value={variation.priceAmount}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleVariationChange(index, 'priceAmount', e.target.value)}
                        className="h-8 text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  required
                  className="w-full rounded-md border border-input bg-input-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] min-h-[80px]"
                  placeholder="Enter product description"
                  value={formData.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Features (Key Points)</label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddFeature}
                    className="h-7 px-2 text-xs"
                  >
                    + Add Feature
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        required
                        // placeholder={`Feature ${index + 1}`}
                        value={feature}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFeatureChange(index, e.target.value)}
                        className="flex-1"
                      />
                      {formData.features.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveFeature(index)}
                          className="size-9 text-muted-foreground hover:text-destructive"
                        >
                          <X className="size-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {/* No empty state message needed since we always have at least one field */}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="size-4 animate-spin mr-2" />
                  ) : null}
                  Save Product
                </Button>
              </div>
            </form>
          </div>
        </div >
      )
      }
    </div >
  );
}

