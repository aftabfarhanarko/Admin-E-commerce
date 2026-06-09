import { apiSlice } from "../api/apiSlice";

export const settingApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createSetting: builder.mutation({
      query: (body) => ({
        url: "/setting",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "settings", id: "LIST" }],
    }),

    getSettings: builder.query({
      query: (params) => ({ url: "/setting", method: "GET", params }),
      transformResponse: (res) => res?.data ?? [],
      providesTags: [{ type: "settings", id: "LIST" }],
    }),

    getSetting: builder.query({
      query: (id) => ({ url: `/setting/${id}`, method: "GET" }),
      transformResponse: (res) => res?.data,
      providesTags: (result, error, id) => [{ type: "settings", id }],
    }),

    updateSetting: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/setting/${id}`,
        method: "PATCH",
        body,
        headers: { "Content-Type": "application/json;charset=UTF-8" },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "settings", id },
        { type: "settings", id: "LIST" },
      ],
    }),

    upsertSmtp: builder.mutation({
      query: (body) => ({
        url: "/setting/smtp",
        method: "PATCH",
        body,
        headers: { "Content-Type": "application/json;charset=UTF-8" },
      }),
      invalidatesTags: [{ type: "settings", id: "LIST" }],
    }),

    getSuperadminSmtp: builder.query({
      query: () => ({ url: "/superadmin/setting/smtp", method: "GET" }),
      transformResponse: (res) => res?.data ?? null,
      providesTags: [{ type: "settings", id: "SUPERADMIN_SMTP" }],
    }),

    upsertSuperadminSmtp: builder.mutation({
      query: (body) => ({
        url: "/superadmin/setting/smtp",
        method: "PATCH",
        body,
        headers: { "Content-Type": "application/json;charset=UTF-8" },
      }),
      invalidatesTags: [{ type: "settings", id: "SUPERADMIN_SMTP" }],
    }),

    deleteSetting: builder.mutation({
      query: (id) => ({
        url: `/setting/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "settings", id: "LIST" }],
    }),

    getOrderReceiptUrl: builder.query({
      query: () => ({ url: "/setting/order-receipt-url", method: "GET" }),
      transformResponse: (res) => res?.data ?? null,
      providesTags: [{ type: "settings", id: "ORDER_RECEIPT_URL" }],
    }),

    upsertOrderReceiptUrl: builder.mutation({
      query: (body) => ({
        url: "/setting/order-receipt-url",
        method: "PATCH",
        body,
        headers: { "Content-Type": "application/json;charset=UTF-8" },
      }),
      invalidatesTags: [{ type: "settings", id: "ORDER_RECEIPT_URL" }],
    }),
  }),
});

export const {
  useGetSettingsQuery,
  useGetSettingQuery,
  useCreateSettingMutation,
  useUpdateSettingMutation,
  useUpsertSmtpMutation,
  useGetSuperadminSmtpQuery,
  useUpsertSuperadminSmtpMutation,
  useDeleteSettingMutation,

  useGetOrderReceiptUrlQuery,
  useUpsertOrderReceiptUrlMutation,
} = settingApiSlice;
