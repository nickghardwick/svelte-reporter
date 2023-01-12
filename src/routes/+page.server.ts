import axios from "axios";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone.js";
import utc from "dayjs/plugin/utc.js";
import type { Actions } from "./$types";

dayjs.extend(timezone);
dayjs.extend(utc);

export const actions: Actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const expenseData = {
      Timestamp: dayjs().tz("America/Los_Angeles").format("MM/DD/YYYYTHH:mm:ss"),
      Expense: data.get("expense"),
      Amount: data.get("amount"),
      Category: data.get("category"),
    };

    const sheetDBReq = axios.post(`${import.meta.env.VITE_SHEETDB_URL}`, {
      data: [expenseData],
      sheet: "Ledger",
    });

    const supabaseReq = axios.post(
      "https://okvzazvzpoxaztttoshl.supabase.co/rest/v1/2023",
      {
        Expense: expenseData.Expense,
        Amount: expenseData.Amount,
        Category: expenseData.Category,
      },
      {
        headers: {
          apikey: `${import.meta.env.VITE_SUPABASE_KEY}`,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    const [sheetDBRes, supabaseRes] = await Promise.all([sheetDBReq, supabaseReq]);

    console.log(sheetDBRes.data, supabaseRes.data);

    return { success: true };
  },
};
