import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { IFormField } from "@/interfaces/IFormField";
import { icons } from "@/constants";

const FormField = ({
  onTextChange,
  title,
  value,
  keyboardType,
  otherStyles,
  placeholder,
  secure = false,
  ...props
}: IFormField) => {
  const [showText, setShowText] = useState(secure);

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-100 font-pmedium">{title}</Text>

      <View className="border-2 border-black-200 w-full h-16 px-4 bg-black-100 rounded-2xl focus:border-secondary items-center flex-row">
        <TextInput
          className="flex-1 text-white font-psemibold text-base"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7b7b8b"
          onChangeText={onTextChange}
          secureTextEntry={showText}
          keyboardType={keyboardType}
          {...props}
        />

        {secure && (
          <TouchableOpacity onPress={() => setShowText((prev) => !prev)}>
            <Image
              source={showText ? icons.eyeHide : icons.eye}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
