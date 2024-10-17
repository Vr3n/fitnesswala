import { H2, YStack, ScrollView } from "tamagui";
import { useRef } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import MeasurementsForm from "app/components/MeasurementsForm";

export default function TabOneScreen() {
  const scrollViewRef = useRef<ScrollView>(null);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
      >
        <YStack
          f={1}
          ai="stretch"
          gap="$4"
          px="$4"
          pt="$4"
          pb="$4"
          bg="$background"
        >
          <H2 ta="left">New Customer</H2>
          <MeasurementsForm />
        </YStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
