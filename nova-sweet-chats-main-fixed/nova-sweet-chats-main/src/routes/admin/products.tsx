import { createFileRoute } from "@tanstack/react-router";
import {
  ImagePlus,
  Pencil,
  Plus,
  Trash2,
  X,
  Upload,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/products")({
  component: ProductsPage,
});

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  image_url: string | null;
  tag: string | null;
  size: string | null;
  active: boolean;
};

type ProductForm = {
  name: string;
  slug: string;
  description: string;
  price: string;
  tag: string;
  size: string;
  image_url: string;
  active: boolean;
};

const emptyForm: ProductForm = {
  name: "",
  slug: "",
  description: "",
  price: "0",
  tag: "",
  size: "",
  image_url: "",
  active: true,
};

function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null);

  const [form, setForm] = useState<ProductForm>(emptyForm);

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  async function loadProducts() {
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error("Failed to load products:", error);
      setProducts([]);
    } else {
      setProducts((data as Product[]) || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function openAddModal() {
    setEditingProduct(null);
    setForm(emptyForm);
    setShowModal(true);
  }

  function openEditModal(product: Product) {
    setEditingProduct(product);

    setForm({
      name: product.name,
      slug: product.slug,
      description: product.description || "",
      price: String(product.price ?? 0),
      tag: product.tag || "",
      size: product.size || "",
      image_url: product.image_url || "",
      active: product.active,
    });

    setShowModal(true);
  }

  function closeModal() {
    if (saving || uploading) return;

    setShowModal(false);
    setEditingProduct(null);
    setForm(emptyForm);
  }

  function updateForm(
    field: keyof ProductForm,
    value: string | boolean
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function createSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function handleNameChange(value: string) {
    setForm((current) => ({
      ...current,
      name: value,
      slug:
        editingProduct
          ? current.slug
          : createSlug(value),
    }));
  }

  async function uploadImage(file: File) {
    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert(
        "Please upload a JPG, PNG, WEBP or AVIF image."
      );
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      alert("Image must be smaller than 5MB.");
      return;
    }

    setUploading(true);

    try {
      const extension =
        file.name.split(".").pop()?.toLowerCase() ||
        "jpg";

      const baseName = createSlug(
        form.name || "cake"
      );

      const fileName = `${baseName}-${crypto.randomUUID()}.${extension}`;

      const filePath = `products/${fileName}`;

      const { error: uploadError } =
        await supabase.storage
          .from("product")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type,
          });

      if (uploadError) {
        console.error(
          "Image upload failed:",
          uploadError
        );

        alert(
          `Image upload failed: ${uploadError.message}`
        );

        return;
      }

      const {
        data: publicUrlData,
      } = supabase.storage
        .from("product")
        .getPublicUrl(filePath);

      const publicUrl =
        publicUrlData.publicUrl;

      setForm((current) => ({
        ...current,
        image_url: publicUrl,
      }));
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    if (!form.name.trim()) {
      alert("Please enter a product name.");
      return;
    }

    if (!form.slug.trim()) {
      alert("Please enter a slug.");
      return;
    }

    const price = Number(form.price);

    if (Number.isNaN(price) || price < 0) {
      alert("Please enter a valid price.");
      return;
    }

    setSaving(true);

    const productData = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      description:
        form.description.trim() || null,
      price,
      image_url:
        form.image_url.trim() || null,
      tag: form.tag.trim() || null,
      size: form.size.trim() || null,
      active: form.active,
    };

    try {
      if (editingProduct) {
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", editingProduct.id);

        if (error) {
          console.error(
            "Failed to update product:",
            error
          );

          alert(
            `Failed to update product: ${error.message}`
          );

          return;
        }
      } else {
        const { error } = await supabase
          .from("products")
          .insert(productData);

        if (error) {
          console.error(
            "Failed to create product:",
            error
          );

          if (error.code === "23505") {
            alert(
              "A product with this slug already exists."
            );
          } else {
            alert(
              `Failed to create product: ${error.message}`
            );
          }

          return;
        }
      }

      closeModal();
      await loadProducts();
    } finally {
      setSaving(false);
    }
  }

  async function deleteProduct(id: string) {
    const product = products.find(
      (item) => item.id === id
    );

    if (!product) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(
        "Failed to delete product:",
        error
      );

      alert(
        `Failed to delete product: ${error.message}`
      );

      return;
    }

    await loadProducts();
  }

  async function toggleProduct(
    id: string,
    active: boolean
  ) {
    const { error } = await supabase
      .from("products")
      .update({
        active: !active,
      })
      .eq("id", id);

    if (error) {
      console.error(
        "Failed to update product status:",
        error
      );

      alert(
        `Failed to update status: ${error.message}`
      );

      return;
    }

    await loadProducts();
  }

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm text-[#A18E86]">
            Catalog
          </p>

          <h1 className="font-serif text-3xl text-[#40332E]">
            Products
          </h1>

          <p className="mt-2 text-sm text-[#8D7B74]">
            Manage your cakes, images and pricing.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#4A3934] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#352823]"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* Products Table */}
      <div className="overflow-hidden rounded-2xl border border-[#E9DDD7] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#EEE3DE] bg-[#FFFCFA] text-left text-xs uppercase tracking-wider text-[#A18E86]">
                <th className="px-6 py-4">
                  Product
                </th>

                <th className="px-6 py-4">
                  Price
                </th>

                <th className="px-6 py-4">
                  Tag
                </th>

                <th className="px-6 py-4">
                  Size / Occasion
                </th>

                <th className="px-6 py-4">
                  Status
                </th>

                <th className="px-6 py-4 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-[#F2EAE6] last:border-0"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#F6ECE8]">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <ImagePlus
                            size={20}
                            className="text-[#B9A39A]"
                          />
                        )}
                      </div>

                      <div>
                        <div className="font-medium text-[#463630]">
                          {product.name}
                        </div>

                        <div className="mt-1 max-w-md text-xs text-[#98857D]">
                          {product.description ||
                            "No description"}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5 font-medium text-[#463630]">
                    $
                    {Number(
                      product.price
                    ).toFixed(2)}
                  </td>

                  <td className="px-6 py-5">
                    {product.tag && (
                      <span className="rounded-full bg-[#F5E9E5] px-3 py-1 text-xs text-[#76544B]">
                        {product.tag}
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-5 text-sm text-[#806F68]">
                    {product.size || "—"}
                  </td>

                  <td className="px-6 py-5">
                    <button
                      onClick={() =>
                        toggleProduct(
                          product.id,
                          product.active
                        )
                      }
                      className={`rounded-full px-3 py-1 text-xs ${
                        product.active
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {product.active
                        ? "Active"
                        : "Hidden"}
                    </button>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() =>
                          openEditModal(product)
                        }
                        title="Edit product"
                        className="rounded-lg p-2 text-[#806F68] transition hover:bg-[#F8F0ED]"
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        onClick={() =>
                          deleteProduct(product.id)
                        }
                        title="Delete product"
                        className="rounded-lg p-2 text-red-400 transition hover:bg-red-50"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {loading && (
            <div className="py-12 text-center text-sm text-[#95837B]">
              Loading products...
            </div>
          )}

          {!loading &&
            products.length === 0 && (
              <div className="py-16 text-center">
                <ImagePlus
                  size={28}
                  className="mx-auto text-[#B9A39A]"
                />

                <p className="mt-3 font-serif text-xl text-[#40332E]">
                  No products yet
                </p>

                <p className="mt-1 text-sm text-[#95837B]">
                  Add your first cake to the catalog.
                </p>
              </div>
            )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#2E211D]/30 p-4 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-[#E6DAD5] bg-[#FFFDFC] shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-[#EEE3DE] px-6 py-5">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-[#A18E86]">
                  {editingProduct
                    ? "Edit catalog"
                    : "New catalog item"}
                </p>

                <h2 className="mt-1 font-serif text-2xl text-[#40332E]">
                  {editingProduct
                    ? "Edit Product"
                    : "Add Product"}
                </h2>
              </div>

              <button
                onClick={closeModal}
                className="rounded-full p-2 text-[#806F68] transition hover:bg-[#F8F0ED]"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-5 p-6">
              {/* Image */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#5B4640]">
                  Cake Image
                </label>

                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#E6DAD5] bg-[#F8F0ED]">
                    {form.image_url ? (
                      <img
                        src={form.image_url}
                        alt={
                          form.name ||
                          "Cake preview"
                        }
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ImagePlus
                        size={30}
                        className="text-[#B9A39A]"
                      />
                    )}
                  </div>

                  <div className="flex flex-1 flex-col justify-center">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      className="hidden"
                      onChange={(event) => {
                        const file =
                          event.target.files?.[0];

                        if (file) {
                          uploadImage(file);
                        }

                        event.target.value = "";
                      }}
                    />

                    <button
                      type="button"
                      disabled={uploading}
                      onClick={() =>
                        fileInputRef.current?.click()
                      }
                      className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#E1D3CE] px-4 py-3 text-sm font-medium text-[#6E5148] transition hover:bg-[#F8F0ED] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Upload size={17} />

                      {uploading
                        ? "Uploading..."
                        : "Upload Image"}
                    </button>

                    <p className="mt-2 text-xs leading-5 text-[#A18E86]">
                      JPG, PNG, WEBP or AVIF.
                      Maximum 5MB.
                    </p>
                  </div>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#5B4640]">
                  Product Name
                </label>

                <input
                  value={form.name}
                  onChange={(event) =>
                    handleNameChange(
                      event.target.value
                    )
                  }
                  placeholder="Nova Signature"
                  className="w-full rounded-xl border border-[#E3D6D1] bg-white px-4 py-3 text-sm text-[#40332E] outline-none placeholder:text-[#B3A39C] focus:border-[#B99389] focus:ring-2 focus:ring-[#F0E1DC]"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#5B4640]">
                  Slug
                </label>

                <input
                  value={form.slug}
                  onChange={(event) =>
                    updateForm(
                      "slug",
                      createSlug(
                        event.target.value
                      )
                    )
                  }
                  placeholder="gold-leaf-signature"
                  className="w-full rounded-xl border border-[#E3D6D1] bg-white px-4 py-3 text-sm text-[#40332E] outline-none placeholder:text-[#B3A39C] focus:border-[#B99389] focus:ring-2 focus:ring-[#F0E1DC]"
                />

                <p className="mt-1 text-xs text-[#A18E86]">
                  Used as the unique URL-friendly
                  identifier.
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#5B4640]">
                  Description
                </label>

                <textarea
                  value={form.description}
                  onChange={(event) =>
                    updateForm(
                      "description",
                      event.target.value
                    )
                  }
                  rows={4}
                  placeholder="Describe the cake..."
                  className="w-full resize-none rounded-xl border border-[#E3D6D1] bg-white px-4 py-3 text-sm leading-6 text-[#40332E] outline-none placeholder:text-[#B3A39C] focus:border-[#B99389] focus:ring-2 focus:ring-[#F0E1DC]"
                />
              </div>

              {/* Price */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#5B4640]">
                    Price
                  </label>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#927E76]">
                      $
                    </span>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.price}
                      onChange={(event) =>
                        updateForm(
                          "price",
                          event.target.value
                        )
                      }
                      className="w-full rounded-xl border border-[#E3D6D1] bg-white py-3 pl-8 pr-4 text-sm text-[#40332E] outline-none focus:border-[#B99389] focus:ring-2 focus:ring-[#F0E1DC]"
                    />
                  </div>
                </div>

                {/* Tag */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#5B4640]">
                    Filling / Tag
                  </label>

                  <input
                    value={form.tag}
                    onChange={(event) =>
                      updateForm(
                        "tag",
                        event.target.value
                      )
                    }
                    placeholder="Dulce de leche"
                    className="w-full rounded-xl border border-[#E3D6D1] bg-white px-4 py-3 text-sm text-[#40332E] outline-none placeholder:text-[#B3A39C] focus:border-[#B99389] focus:ring-2 focus:ring-[#F0E1DC]"
                  />
                </div>
              </div>

              {/* Size / Occasion */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#5B4640]">
                  Occasion / Size
                </label>

                <input
                  value={form.size}
                  onChange={(event) =>
                    updateForm(
                      "size",
                      event.target.value
                    )
                  }
                  placeholder="Birthdays"
                  className="w-full rounded-xl border border-[#E3D6D1] bg-white px-4 py-3 text-sm text-[#40332E] outline-none placeholder:text-[#B3A39C] focus:border-[#B99389] focus:ring-2 focus:ring-[#F0E1DC]"
                />

                <p className="mt-1 text-xs text-[#A18E86]">
                  Example: Birthdays, Weddings,
                  Celebrations, 8&quot; serves 12–14.
                </p>
              </div>

              {/* Image URL */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#5B4640]">
                  Image URL
                </label>

                <input
                  value={form.image_url}
                  onChange={(event) =>
                    updateForm(
                      "image_url",
                      event.target.value
                    )
                  }
                  placeholder="https://..."
                  className="w-full rounded-xl border border-[#E3D6D1] bg-white px-4 py-3 text-sm text-[#40332E] outline-none placeholder:text-[#B3A39C] focus:border-[#B99389] focus:ring-2 focus:ring-[#F0E1DC]"
                />

                <p className="mt-1 text-xs text-[#A18E86]">
                  Uploading an image above will
                  automatically fill this field.
                </p>
              </div>

              {/* Active */}
              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-[#E6DAD5] bg-[#FFFCFA] p-4">
                <div>
                  <p className="text-sm font-medium text-[#55433D]">
                    Product visible
                  </p>

                  <p className="mt-1 text-xs text-[#95837B]">
                    Hidden products won't appear on
                    the public cakes page.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(event) =>
                    updateForm(
                      "active",
                      event.target.checked
                    )
                  }
                  className="h-5 w-5 accent-[#4A3934]"
                />
              </label>
            </div>

            {/* Footer */}
            <div className="flex flex-col-reverse gap-3 border-t border-[#EEE3DE] px-6 py-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeModal}
                disabled={saving || uploading}
                className="rounded-xl px-5 py-3 text-sm font-medium text-[#806F68] transition hover:bg-[#F8F0ED] disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving || uploading}
                className="inline-flex items-center justify-center rounded-xl bg-[#4A3934] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#352823] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingProduct
                    ? "Update Product"
                    : "Create Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}