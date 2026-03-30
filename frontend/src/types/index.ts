// src/types/index.ts
export interface StatCardProps {
  title: string;
  value: string;
  change: string;
  subValue: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  hpp: number;
}

export interface CartItem extends Product {
  quantity: number;
}