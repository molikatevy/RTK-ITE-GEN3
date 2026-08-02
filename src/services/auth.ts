
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

type UserLoginType = {
  email: string;
  password: string;
}

export const authApi = createApi({
  reducerPath: 'authAPI',
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_ISHOP_BASE_URL}` }),
    endpoints: (builder) => ({
        loginUser : builder.mutation<UserLoginType, unknown>({
            query: ({email,password}) => ({
                url: '/auth/login',
                method: 'POST',
                body: { email, password },
            }),
        }), 
    })
})


export const { useLoginUserMutation } = authApi;