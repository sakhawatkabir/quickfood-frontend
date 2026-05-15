"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createMenuItem } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const AddMenuPage = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate, isPending, error, isSuccess } = useMutation({
    mutationFn: createMenuItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner-menu-items"] });
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
      router.push("/dashboard/menu-items");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    if (imageFile) formData.append("image", imageFile);
    mutate(formData);
  };

  return (
    <div className="container mx-auto px-4 max-w-3xl">
      <div className="mb-6">
        <Link
          href="/dashboard/menu-items"
          className="flex items-center text-gray-600 hover:text-black"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Menu
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Add New Menu Item</h1>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
            {error.message}
          </div>
        )}
        {isSuccess && (
          <div className="bg-green-50 text-green-500 p-4 rounded-md mb-6">
            Menu item created! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block mb-2 text-gray-700">
              Item Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              required
              placeholder="e.g. Margherita Pizza"
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label htmlFor="description" className="block mb-2 text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              rows="3"
              required
              placeholder="e.g. Classic cheese pizza with fresh tomatoes and basil"
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label htmlFor="price" className="block mb-2 text-gray-700">
              Price ($)
            </label>
            <input
              type="number"
              id="price"
              value={price}
              step="0.01"
              min="0"
              required
              placeholder="e.g. 12.99"
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label htmlFor="image" className="block mb-2 text-gray-700">
              Image
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-60"
            >
              {isPending ? "Creating..." : "Add Menu Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMenuPage;
