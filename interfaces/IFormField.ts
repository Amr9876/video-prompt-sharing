import { KeyboardTypeOptions } from "react-native";

export interface IFormField {
  title: string;
  value: any;
  onTextChange: (value: string) => void;
  otherStyles?: string;
  keyboardType?: KeyboardTypeOptions;
  placeholder?: string;
  secure?: boolean;
  [key: string]: any;
}
