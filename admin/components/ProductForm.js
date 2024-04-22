import React, { useState, useEffect } from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/router";

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
  category: assignedCategory,
  properties: assignedProperties,
  onProductUpdated,
}) {
  const router = useRouter();
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [category, setCategory] = useState(assignedCategory || "");
  const [productProperties, setProductProperties] = useState(assignedProperties || {});
  const [price, setPrice] = useState(existingPrice || "");
  const [images, setImages] = useState(existingImages || []);
  const [goToProducts, setGoToProducts] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    setTitle(existingTitle || "");
    setDescription(existingDescription || "");
    setCategory(assignedCategory || "");
    setProductProperties(assignedProperties || {});
    setPrice(existingPrice || "");
    setImages(existingImages || []);
    setImagePreviews(existingImages || []);
  }, [existingTitle, existingDescription, assignedCategory, assignedProperties, existingPrice, existingImages]);

  useEffect(() => {
    setCategoriesLoading(true);
    axios
      .get("/api/categories")
      .then((result) => {
        setCategories(result.data);
        setCategoriesLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setCategoriesLoading(false);
      });
  }, []);

  useEffect(() => {
    if (existingImages && existingImages.length > 0) {
      setImagePreviews(existingImages);
    }
  }, [existingImages]);

  async function saveProduct(ev) {
    ev.preventDefault();
    const data = {
      _id,
      title,
      description,
      price,
      images,
      category,
      properties: productProperties,
    };
    try {
      const response = _id ? await axios.put(`/api/products?id=${_id}`, data) : await axios.post("/api/products", data);
      console.log("Product saved successfully:", response.data);
      setGoToProducts(true); // Redirect after successful save
      if (onProductUpdated) {
        onProductUpdated(); // Call onProductUpdated if provided
      }
    } catch (error) {
      console.error("Error saving product:", error);
    }
  }

  useEffect(() => {
    if (goToProducts) {
      router.push("/products").catch((error) => {
        console.error("Error redirecting to products page:", error);
      });
    }
  }, [goToProducts]);

  async function uploadImages(ev) {
    const files = ev.target.files;
    if (files.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
      }
      try {
        const res = await axios.post("/api/upload", data);
        setImages((oldImages) => [...oldImages, ...res.data.links]);
        setIsUploading(false);
        setImagePreviews((prevPreviews) => [...prevPreviews, ...res.data.links]);
      } catch (error) {
        console.error("Error uploading images:", error);
        setIsUploading(false);
      }
    }
  }

  function deleteImage(index) {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);

    const updatedPreviews = [...imagePreviews];
    updatedPreviews.splice(index, 1);
    setImagePreviews(updatedPreviews);
  }

  function setProductProp(propName, value) {
    setProductProperties((prev) => ({
      ...prev,
      [propName]: value,
    }));
  }

  const propertiesToFill = [];
  if (categories.length > 0 && category) {
    let catInfo = categories.find(({ _id }) => _id === category);
    propertiesToFill.push(...catInfo.properties);
    while (catInfo?.parent?._id) {
      const parentCat = categories.find(({ _id }) => _id === catInfo?.parent?._id);
      propertiesToFill.push(...parentCat.properties);
      catInfo = parentCat;
    }
  }

  return (
    <form onSubmit={saveProduct}>
      <label>Product name</label>
      <input
        type="text"
        placeholder="Product name"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <label>Category</label>
      <select value={category} onChange={(ev) => setCategory(ev.target.value)}>
        <option value="">Uncategorized</option>
        {categories.map((c) => (
          <option key={c._id} value={c._id}>
            {c.name}
          </option>
        ))}
      </select>
      {categoriesLoading && <Spinner />}
      {propertiesToFill.length > 0 &&
        propertiesToFill.map((p) => (
          <div key={p._id} className="">
            <label>{p.name[0].toUpperCase() + p.name.substring(1)}</label>
            <div>
              <select
                value={productProperties[p.name]}
                onChange={(ev) => setProductProp(p.name, ev.target.value)}
              >
                {p.values.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      <label>Photos</label>
      <div className="mb-2 flex flex-wrap gap-4">
        {isUploading ? (
          <div className="h-24 flex items-center">
            <Spinner />
          </div>
        ) : (
          <>
            <label className="w-32 h-32 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1 text-primary rounded-sm bg-gray-200 shadow-sm border border-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
              <div>Add image</div>
              <input type="file" onChange={uploadImages} className="hidden" multiple />
            </label>
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative w-32 h-32 bg-gray-200 border-blue-700 border flex items-center justify-center">
                <div className="w-28 h-28 overflow-hidden flex justify-center items-center mx-auto my-auto">
                  <img src={preview} alt="Preview" className="max-w-full max-h-full flex " />
                </div>
                <button
                  className="absolute top-[-12px] right-[-10px] bg-blue-700 text-white rounded-full p-1"
                  onClick={() => deleteImage(index)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </>
        )}
      </div>
      <label>Description</label>
      <textarea
        placeholder="Description"
        value={description}
        onChange={(ev) => setDescription(ev.target.value)}
      />
      <label>Price (in ₹)</label>
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(ev) => setPrice(ev.target.value)}
      />
      <button type="submit" className="btn-primary">
        Save
      </button>
    </form>
  );
}
