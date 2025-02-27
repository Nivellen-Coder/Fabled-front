// export interface CardDetailModel {
//   identifier: string;
//   name: string;
//   rarity: string;
//   keywords: string[];
//   image: string;
//   type: string;
//   stats: {
//     resource: string;
//   };
//   text: string;
//   flavour: string;
//   comments: string;
//   next: string;
//   prev: string;
// }

export interface CardDetailModel {
  object: string;
  id: string;
  oracle_id: string;
  multiverse_ids: number[];
  tcgplayer_id: number;
  cardmarket_id: number;
  name: string;
  lang: string;
  released_at: string;
  uri: string;
  scryfall_uri: string;
  layout: string;
  highres_image: boolean;
  image_status: string;
  image_uris: {
    small: string;
    normal: string;
    large: string;
    png: string;
    art_crop: string;
    border_crop: string;
  };
  mana_cost: string;
  cmc: number;
  type_line: string;
  oracle_text: string;
  colors: string[];
  color_identity: string[];
  produced_mana: string[];
  legalities: {
    [key: string]: string;
  };
  games: string[];
  reserved: boolean;
  foil: boolean;
  nonfoil: boolean;
  finishes: string[];
  oversized: boolean;
  promo: boolean;
  reprint: boolean;
  variation: boolean;
  set_id: string;
  set: string;
  set_name: string;
  set_type: string;
  set_uri: string;
  set_search_uri: string;
  scryfall_set_uri: string;
  rulings_uri: string;
  prints_search_uri: string;
  collector_number: string;
  digital: boolean;
  rarity: string;
  card_back_id: string;
  artist: string;
  artist_ids: string[];
  illustration_id: string;
  border_color: string;
  frame: string;
  full_art: boolean;
  textless: boolean;
  booster: boolean;
  story_spotlight: boolean;
  prices: {
    usd: string;
    usd_foil: string | null;
    usd_etched: string | null;
    eur: string;
    eur_foil: string | null;
    tix: string | null;
  };
  related_uris: {
    gatherer: string;
    tcgplayer_infinite_articles: string;
    tcgplayer_infinite_decks: string;
    edhrec: string;
  };
  purchase_uris: {
    tcgplayer: string;
    cardmarket: string;
    cardhoarder: string;
  };
}
