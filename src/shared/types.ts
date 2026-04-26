export type WishItem = {
  id: number;
  title: string;
  url: string;
  notes: string | null;
  createdAt: string;
};

export type CreateWishItemInput = {
  title: string;
  url: string;
  notes?: string;
};
