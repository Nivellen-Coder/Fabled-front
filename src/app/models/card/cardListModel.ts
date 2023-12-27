export interface Card {
  identifier: string;
  name: string;
  keywords: string[];
  stats: {
    cost: string;
    defense: string;
    resource: string;
  };
  image: string;
  text: string;
  rarity: string;
}

export interface cardListModel {
  data: Card[];
  current_page: number;
  first_page_url: string;
  from: number;
  next_page_url: string | null;
  path: string;
  per_page: string;
  prev_page_url: string;
  to: number;
  total: number;
  meta: Meta;
}

export interface Meta {
  current_page: number;
  first_page_url: string;
  from: number;
  next_page_url: string | null;
  path: string;
  per_page: string;
  prev_page_url: string;
  last_page: number;
  to: number;
  total: number;
}
