import { UpdateProductType } from './../components/tables/Columns';

import { CreateProductType, ProductResponse, ProductType } from '@/lib/products';
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'


export const ecommerceApi= createApi({
  reducerPath: 'ecommerceApi',
  baseQuery: fetchBaseQuery({baseUrl: `${process.env.NEXT_PUBLIC_ISHOP_BASE_URL}`}),
    tagTypes: ["Products"],

  endpoints: (builder)=>({
    // getAllProducts
     getAllProduct: builder.query<ProductResponse,{page:number,size:number}>({
      query: ({page, size}) => `/products?page=${page}&size=${size}`,
       providesTags: ["Products"]
     }),
    //  getProductByUUid
    getProductByUuid: builder.query<ProductType, string>({
      query: (uuid: string) => ({
        url: `/products/${uuid}`,providesTags: ["Products"]
      })
    }),
    // create Product
    createProduct : builder.mutation<CreateProductType,unknown,unknown>({
      query: (newProduct:CreateProductType)=> ({
         url: `/products`,
         method: 'POST',
         headers: {
          'content-type': 'application/json',
          Authorization: `bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`
         },
         body: newProduct
      }),
            invalidatesTags: ["Products"]
    }),
    updateProduct: builder.mutation<
      ProductType, 
      { uuid: string; data: UpdateProductType }>({
      query: ({ uuid, data }) => ({
        url: `/products/${uuid}`,
        method: "PUT",
           headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`,
          },
        body: data,
      }),
            invalidatesTags: ["Products"]
    }),
    deleteProduct: builder.mutation<void, string>({
      query: (uuid) => ({
        url: `/products/${uuid}`,
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`,
          },
      }),
            invalidatesTags: ["Products"]
    })
  })
})

export const {
 useGetAllProductQuery,
 useGetProductByUuidQuery, 
 useCreateProductMutation,
 useDeleteProductMutation,
 useUpdateProductMutation
} = ecommerceApi;