import type { Position } from "./entities.js";

export interface CurrencyType {
  id: string;
  name: string;
  description: string;
}

export interface TradeOfferItem {
  itemId: string;
  quantity: number;
}

export interface TradeOffer {
  playerId: string;
  items: TradeOfferItem[];
  currencies: Record<string, number>;
}

export interface VendorStallListing {
  itemId: string;
  price: number;
  quantity: number;
}

export interface VendorStall {
  ownerId: string;
  position: Position;
  isActive: boolean;
  stallName: string;
  itemsForSale: VendorStallListing[];
}
