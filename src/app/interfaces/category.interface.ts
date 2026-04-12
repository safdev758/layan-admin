export interface Category {
  id: string;
  name: string;
  description?: string;
  emoji?: string;
  imageUrl?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
