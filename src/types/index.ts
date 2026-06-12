// Auth Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  location?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Restaurant Types
export interface Restaurant {
  id: string;
  name: string;
  logo?: string;
  images?: string[];
  rating: number;
  reviewCount?: number;
  location: string;
  distance?: number;
  category?: string;
  priceRange?: string;
  isOpen?: boolean;
  description?: string;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  category?: string;
  isAvailable?: boolean;
}

export interface Review {
  id: string;
  userId: string;
  restaurantId: string;
  star: number;
  comment: string;
  createdAt: string;
  user?: {
    name: string;
    avatar?: string;
  };
}

export interface RestaurantDetail extends Restaurant {
  menus: MenuItem[];
  reviews: Review[];
}

// Cart Types
export interface CartItem {
  id: string;
  menuId: string;
  restaurantId: string;
  quantity: number;
  menu: MenuItem;
}

export interface CartGroup {
  restaurant: Restaurant;
  items: CartItem[];
}

// Order Types
export interface OrderItem {
  menuId: string;
  quantity: number;
  menu?: MenuItem;
}

export interface Order {
  id: string;
  status: "pending" | "processing" | "delivered" | "cancelled";
  totalAmount: number;
  deliveryAddress: string;
  paymentMethod: string;
  notes?: string;
  createdAt: string;
  items?: OrderItem[];
  restaurant?: Restaurant;
}

// API Response Types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

// Filter Types
export interface RestaurantFilter {
  location?: string;
  range?: number;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  category?: string;
  page?: number;
  limit?: number;
  q?: string;
}
