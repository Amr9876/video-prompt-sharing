import { Models } from "react-native-appwrite";

export interface ITrendingProps {
  posts: Models.Document[];
}

export interface ITrendingItemProps {
  activeItem: string;
  item: Models.Document;
}
