export interface TechsiroProduct {
  url: string;
  status: string;
  products: Products;
  queryString: string;
  pagination_data: PaginationData;
}

export interface Products {
  current_page: number;
  data: Daum[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Link[];
  next_page_url: string;
  path: string;
  per_page: number;
  prev_page_url: any;
  to: number;
  total: number;
}

export interface Daum {
  id: number;
  title: string;
  url_title: string;
  price: number;
  primary_price: number;
  quantity: number;
  status: string;
  stock_status: string;
  comments_rate: number;
  created_at: string;
  updated_at: string;
  sort_priority: number;
  orders_rate: number;
  visibility: string;
  has_regardless: number;
  has_off: number;
  group_id?: number;
  edit_url: string;
  show_product_url: string;
  status_text: string;
  has_off_text: string;
  stock_status_text: string;
  visibility_text: string;
  commentable_text: string;
  min_competitor_price: number;
  max_competitor_price: number;
  show_price: string;
  star_points: number;
  discount_percent: number;
  fa_quantity: string;
  fa_discount_percent: string;
  fa_price: string;
  fa_primary_price: string;
  daily_discount: DailyDiscount;
  is_new: boolean;
  comment_rate_html: string[];
  card_show_remained_quantity: boolean;
  show_in_category: boolean;
  default_warranty_name: string;
  has_region: any;
  max_quantity: number;
  has_incoming_dd: boolean;
  created_at_fa: string;
  coming_soon: any;
  event_title?: string;
  labels_array: LabelsArray[];
  is_foreign_text: string;
  active_pre_order_product_for_request: any;
  first_photo: FirstPhoto;
  active_group_product?: ActiveGroupProduct;
}

export interface DailyDiscount {
  exists: boolean;
}

export interface LabelsArray {
  title: string;
  short_title: string;
  background_color: string;
  text_color: string;
  top: number;
}

export interface FirstPhoto {
  id: number;
  warehouse_photo_id: any;
  product_id: number;
  url: string;
  title: string;
  alt: string;
  position: number;
  is_from_wp: number;
  is_webp: number;
  has_uploaded: number;
  created_at: string;
  updated_at: string;
  deleted_at: any;
  pure_url: string;
}

export interface ActiveGroupProduct {
  id: number;
  event_id: any;
  title: string;
  saleable: number;
  discounted_price: number;
  created_at: string;
  updated_at: string;
  deleted_at: any;
  group_products: GroupProduct[];
  event: any;
}

export interface GroupProduct {
  id: number;
  group_id: number;
  product_id: number;
  title: string;
  count: number;
  created_at: string;
  updated_at: string;
  deleted_at: any;
  product: Product;
}

export interface Product {
  id: number;
  price: number;
  primary_price: number;
  quantity: number;
  is_saleable: number;
  has_regardless: number;
  stock_status: string;
  sort_priority: number;
  title: string;
  url_title: string;
  commentable: string;
  status: string;
  visibility: string;
  sku: string;
  has_off: number;
  is_foreign: number;
  comments_rate: number;
  orders_rate: number;
  monthly_orders_rate: number;
  linkable: number;
  object_id: number;
  available_at: string;
  group_id: any;
  created_at: string;
  updated_at: string;
  deleted_at: any;
  edit_url: string;
  show_product_url: string;
  status_text: string;
  has_off_text: string;
  stock_status_text: string;
  visibility_text: string;
  commentable_text: string;
  min_competitor_price: number;
  max_competitor_price: number;
  show_price: string;
  star_points: number;
  discount_percent: number;
  fa_quantity: string;
  fa_discount_percent: string;
  fa_price: string;
  fa_primary_price: string;
  daily_discount: DailyDiscount2;
  is_new: boolean;
  comment_rate_html: string[];
  card_show_remained_quantity: boolean;
  show_in_category: boolean;
  default_warranty_name: string;
  has_region: any;
  max_quantity: number;
  has_incoming_dd: boolean;
  created_at_fa: string;
  coming_soon: any;
  event_title: any;
  labels_array: LabelsArray2[];
  is_foreign_text: string;
  active_pre_order_product_for_request: any;
  active_group_product: any;
}

export interface DailyDiscount2 {
  exists: boolean;
}

export interface LabelsArray2 {
  title: string;
  short_title: string;
  background_color: string;
  text_color: string;
  top: number;
}

export interface Link {
  url?: string;
  label: string;
  active: boolean;
}

export interface PaginationData {
  elements: Element[];
  currentPage: number;
  hasPages: boolean;
  onFirstPage: boolean;
  hasMorePages: boolean;
  showPagination: boolean;
  nextPageUrl: string;
  previousPageUrl: any;
}

export interface Element {
  "1": string;
  "2": string;
  "3": string;
}

export interface CategoryDataRes {
  data: CategoryTechSiro[];
}

export interface CategoryTechSiro {
  id: number;
  title: string;
  url: string;
  hasChild: number;
  position: number;
  parentCategories?: CategoryTechSiro[];
  childCategories?: CategoryTechSiro[];
}

export interface ProductResponse {
  title: string;
  short_description?: string;
  price: number;
  a_href?: string;
  type?: string;
  creator?: string;
  images: string[];
  details: string[];
  information?: Record<string, any>;
}
