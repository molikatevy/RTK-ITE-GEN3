// services/uploadApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface UploadResponse {
  name: string;
  url?: string;
  success?: boolean;
}

export const uploadApi = createApi({
  reducerPath: "uploadApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_ISHOP_BASE_URL || "",
  }),
  tagTypes: ["Files"],
  endpoints: (builder) => ({
    uploadFiles: builder.mutation<UploadResponse, File[]>({
      query: (files) => {
        const formData = new FormData();
        files.forEach((file) => {
          formData.append("files", file);
        });

        return {
          url: "/medias/upload-multiple",
          method: "POST",
          body: formData,
          // DO NOT set content-type header manually - let browser set it with boundary
        };
      },
      invalidatesTags: ["Files"],
    }),
    uploadSingleFile: builder.mutation<UploadResponse, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append("file", file);

        return {
          url: "/medias/upload",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Files"],
    }),
  }),
});

export const { useUploadFilesMutation, useUploadSingleFileMutation } = uploadApi;