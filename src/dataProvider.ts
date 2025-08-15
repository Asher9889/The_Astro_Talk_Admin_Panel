import simpleRestProvider from "ra-data-simple-rest";
// import { DataProvider } from "react-admin";
import { DataProvider, GetListResult } from "react-admin";

const baseDataProvider = simpleRestProvider(
  import.meta.env.VITE_SIMPLE_REST_URL,
);

const baseUrl = import.meta.env.VITE_SIMPLE_REST_URL;

// Custom data provider that handles file uploads
export const dataProvider: DataProvider = {
  ...baseDataProvider,
  // Adapt getList response format
  getList: async (resource, params): Promise<GetListResult<any>> => {
    const url = new URL(`${baseUrl}/${resource}`);

    // Preserve React-Admin query params (filter, range, sort)
    if (params.filter) {
      url.searchParams.set("filter", JSON.stringify(params.filter));
    }
    if (params.sort) {
      url.searchParams.set("sort", JSON.stringify([params.sort.field, params.sort.order]));
    }
    if (params.pagination) {
      const { page, perPage } = params.pagination;
      const range = [(page - 1) * perPage, page * perPage - 1];
      url.searchParams.set("range", JSON.stringify(range));
    }

    const response = await fetch(url.toString(), {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();

    // Your API already returns { data: [...], total: n }
    return {
      data: json.data,
      total: json.total,
    };
  },

  create: async (resource, params) => {
    // Handle file uploads for blogs
    if (resource === "blogs" && params.data.image instanceof File) {
      const formData = new FormData();

      // Add text fields
      Object.keys(params.data).forEach(key => {
        if (key !== 'image') {
          formData.append(key, params.data[key]);
        }
      });

      // Add file
      if (params.data.image) {
        formData.append('image', params.data.image);
      }

      // Make the request with FormData
      const url = `${baseUrl}/${resource}`;
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header - let browser set it with boundary for FormData
      });

      if (!response.status) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data: data?.data };
    }

    // For other resources, use the default provider
    return baseDataProvider.create(resource, params);
  },

  // Get single blog
  getOne: async (resource, params) => {
    const url = `${baseUrl}/${resource}/${params.id}`;
    const res = await fetch(url);
    const json = await res.json();

    return {
      data: json.data, // unwrap the data object
    };
  },
  // update
  update: (resource, params) => {
    const formData = new FormData();
    formData.append("title", params.data.title);
    formData.append("content", params.data.content);

    // If image is a File object, send it
    if (params.data.image && params.data.image.rawFile instanceof File) {
      formData.append("image", params.data.image.rawFile);
    }

    return fetch(`${baseUrl}/${resource}/${params.id}`, {
      method: "PUT",
      body: formData
    })
      .then(response => response.json())
      .then(json => ({ data: json.data }));
  },
  // Delete
  delete: (resource, params) =>
    fetch(`${baseUrl}/${resource}/${params.id}`, {
      method: "DELETE"
    })
      .then(response => response.json())
      .then(json => ({ data: json.data }))
};


