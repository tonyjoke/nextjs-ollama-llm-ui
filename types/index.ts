export interface Voucher {
  id: number;
  voucher_date: string;
}

export interface VoucherItem {
  id: number;
  amount: number;
  category_id: number;
  date: string; // This now represents voucher_date from the vouchers table
}

export interface VoucherCategory {
  id: number;
  name: string;
  type: string;
}

export interface DateRange {
  from: Date | null;
  to: Date | null;
}