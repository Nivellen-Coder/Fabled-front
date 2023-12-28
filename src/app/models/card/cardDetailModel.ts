export interface CardDetailModel {
  identifier: string;
  name: string;
  rarity: string;
  keywords: string[];
  image: string;
  stats: {
    resource: string;
  };
  text: string;
  flavour: string;
  comments: string;
  next: string;
  prev: string;
}
