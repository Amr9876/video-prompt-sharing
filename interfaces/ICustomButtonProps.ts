export interface ICustomButtonProps {
  title: string;
  onPress: () => void;
  containerStyles?: string;
  textStyles?: string;
  isLoading?: boolean;
}
