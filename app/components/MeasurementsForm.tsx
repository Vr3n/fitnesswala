import React, { useEffect, useState } from "react";
import {
  Form,
  YStack,
  XStack,
  Label,
  Input,
  Button,
  RadioGroup,
  Text,
  Sheet,
  ScrollView,
} from "tamagui";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const schema = z.object({
  fullName: z.string().min(1, { message: "Full name is required" }),
  mobileNumber: z
    .string()
    .length(10, { message: "Mobile number must be exactly 10 digits" })
    .regex(/^\d+$/, { message: "Mobile number should only contain digits" }),
  email: z
    .string()
    .email({ message: "Invalid email format" })
    .optional()
    .or(z.literal("")),
  dob: z.date(),
  height: z
    .string()
    .regex(/^\d*\.?\d*$/, { message: "Height should be numeric" }),
  weight: z
    .string()
    .regex(/^\d*\.?\d*$/, { message: "Weight should be numeric" }),
});

type FormData = z.infer<typeof schema>;

const MeasurementsForm = () => {
  const [heightUnit, setHeightUnit] = useState("cm");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [submittedData, setSubmittedData] = useState<FormData | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
    setSubmittedData(data);
    setSheetOpen(true);
  };

  const [heightCm, setHeightCm] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");

  const [weightKg, setWeightKg] = useState("");
  const [weightLbs, setWeightLbs] = useState("");

  useEffect(() => {
    if (heightUnit === "cm" && heightCm) {
      const totalInches = parseFloat(heightCm) / 2.54;
      const ft = Math.floor(totalInches / 12);
      const inches = Math.round(totalInches % 12);
      setHeightFt(ft.toString());
      setHeightIn(inches.toString());
    } else if (heightUnit === "ft" && (heightFt || heightIn)) {
      const ft = parseFloat(heightFt) || 0;
      const inches = parseFloat(heightIn) || 0;
      const cm = Math.round((ft * 12 + inches) * 2.54);
      setHeightCm(cm.toString());
    }
  }, [heightUnit, heightCm, heightFt, heightIn]);

  const handleHeightChange = (value: string, unit: "cm" | "ft" | "in") => {
    if (unit === "cm") {
      setHeightCm(value);
    } else if (unit === "ft") {
      setHeightFt(value);
    } else {
      setHeightIn(value);
    }
  };

  useEffect(() => {
    if (weightUnit === "kg" && weightKg) {
      const lbs = Math.round(parseFloat(weightKg) * 2.20462 * 10) / 10;
      setWeightLbs(lbs.toString());
    } else if (weightUnit === "lbs" && weightLbs) {
      const kg = Math.round((parseFloat(weightLbs) / 2.20462) * 10) / 10;
      setWeightKg(kg.toString());
    }
  }, [weightUnit, weightKg, weightLbs]);

  const handleWeightChange = (value: string, unit: "kg" | "lbs") => {
    if (unit === "kg") {
      setWeightKg(value);
    } else {
      setWeightLbs(value);
    }
  };

  return (
    <>
      <Form gap="$4" onSubmit={handleSubmit(onSubmit)}>
        <YStack gap="$2">
          <Label htmlFor="fullName">Full Name</Label>
          <Controller
            name="fullName"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                id="fullName"
                placeholder="Full Name"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                backgroundColor={
                  errors.fullName ? "$red10" : isValid ? "$green4" : undefined
                }
                borderColor={
                  errors.fullName ? "$red10" : isValid ? "$green10" : undefined
                }
              />
            )}
          />
          {errors.fullName && (
            <Text color="$red10">{errors.fullName.message}</Text>
          )}
        </YStack>

        <XStack gap="$2" jc="space-between">
          <YStack gap="$2" flex={1}>
            <Label htmlFor="mobileNumber">Mobile Number</Label>
            <Controller
              name="mobileNumber"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <Input
                    id="mobileNumber"
                    placeholder="Mobile Number"
                    keyboardType="phone-pad"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    backgroundColor={
                      errors.mobileNumber
                        ? "$red10"
                        : isValid
                        ? "$green4"
                        : undefined
                    }
                    borderColor={
                      errors.mobileNumber
                        ? "$red10"
                        : isValid
                        ? "$green10"
                        : undefined
                    }
                  />
                  {value && (
                    <Text
                      color={isValid ? "$green10" : undefined}
                      fontSize="$1"
                      mt="$1"
                    >
                      {`${10 - value.length} characters left`}
                    </Text>
                  )}
                </>
              )}
            />
            {errors.mobileNumber && (
              <Text color="$red10">{errors.mobileNumber.message}</Text>
            )}
          </YStack>

          <YStack gap="$2" flex={1}>
            <Label htmlFor="email">Email Address</Label>
            <Controller
              name="email"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  id="email"
                  placeholder="Email Address"
                  keyboardType="email-address"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  backgroundColor={
                    errors.email ? "$red10" : isValid ? "$green4" : undefined
                  }
                  borderColor={
                    errors.email ? "$red10" : isValid ? "$green10" : undefined
                  }
                />
              )}
            />
            {errors.email && <Text color="$red10">{errors.email.message}</Text>}
          </YStack>
        </XStack>

        <YStack gap="$2">
          <Label htmlFor="dob">Date of Birth</Label>
          <Controller
            name="dob"
            control={control}
            render={({ field: { onChange, value } }) => (
              <>
                <Input
                  id="dob"
                  value={value?.toLocaleDateString("en-IN")}
                  placeholder="DD-MM-YYYY"
                  onPressIn={() => setShowDatePicker(true)}
                  backgroundColor={
                    errors.dob ? "$red10" : isValid ? "$green4" : undefined
                  }
                  borderColor={
                    errors.dob ? "$red10" : isValid ? "$green10" : undefined
                  }
                />
                {showDatePicker && (
                  <DateTimePicker
                    value={value || new Date()}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);
                      if (selectedDate) {
                        onChange(selectedDate);
                      }
                    }}
                  />
                )}
              </>
            )}
          />
        </YStack>

        <XStack gap="$2">
          <YStack flex={1} gap="$2">
            <Label htmlFor="height">Height</Label>
            <Controller
              name="height"
              control={control}
              render={({ field: { onChange, onBlur, value } }) =>
                heightUnit === "cm" ? (
                  <Input
                    id="height"
                    placeholder="Height in cm"
                    value={value}
                    onChangeText={(text) => {
                      onChange(text);
                      handleHeightChange(text, "cm");
                    }}
                    onBlur={onBlur}
                    backgroundColor={
                      errors.height ? "$red10" : isValid ? "$green4" : undefined
                    }
                    borderColor={
                      errors.height
                        ? "$red10"
                        : isValid
                        ? "$green10"
                        : undefined
                    }
                  />
                ) : (
                  <XStack gap="$2">
                    <Input
                      id="heightFt"
                      placeholder="Ft"
                      value={heightFt}
                      onChangeText={(text) => {
                        handleHeightChange(text, "ft");
                        onChange(`${text}.${heightIn}`);
                      }}
                      style={{ flex: 1 }}
                      backgroundColor={
                        errors.height
                          ? "$red10"
                          : isValid
                          ? "$green4"
                          : undefined
                      }
                      borderColor={
                        errors.height
                          ? "$red10"
                          : isValid
                          ? "$green10"
                          : undefined
                      }
                    />
                    <Input
                      id="heightIn"
                      placeholder="Inch"
                      value={heightIn}
                      onChangeText={(text) => {
                        handleHeightChange(text, "in");
                        onChange(`${heightFt}.${text}`);
                      }}
                      style={{ flex: 1 }}
                      backgroundColor={
                        errors.height
                          ? "$red10"
                          : isValid
                          ? "$green4"
                          : undefined
                      }
                      borderColor={
                        errors.height
                          ? "$red10"
                          : isValid
                          ? "$green10"
                          : undefined
                      }
                    />
                  </XStack>
                )
              }
            />
            {errors.height && (
              <Text color="$red10">{errors.height.message}</Text>
            )}
            <RadioGroup value={heightUnit} onValueChange={setHeightUnit}>
              <XStack gap="$2">
                <RadioGroup.Item value="cm" id="cm">
                  <RadioGroup.Indicator />
                </RadioGroup.Item>
                <Label htmlFor="cm">CM</Label>
                <RadioGroup.Item value="ft" id="ft">
                  <RadioGroup.Indicator />
                </RadioGroup.Item>
                <Label htmlFor="ft">Ft</Label>
              </XStack>
            </RadioGroup>
          </YStack>
          <YStack flex={1} gap="$2">
            <Label htmlFor="weight">Weight</Label>
            <Controller
              name="weight"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  id="weight"
                  placeholder={`Weight in ${weightUnit}`}
                  value={value}
                  onChangeText={(text) => {
                    onChange(text);
                    handleWeightChange(text, weightUnit as "kg" | "lbs");
                  }}
                  onBlur={onBlur}
                  backgroundColor={
                    errors.weight ? "$red10" : isValid ? "$green4" : undefined
                  }
                  borderColor={
                    errors.weight ? "$red10" : isValid ? "$green10" : undefined
                  }
                />
              )}
            />
            {errors.weight && (
              <Text color="$red10">{errors.weight.message}</Text>
            )}
            <RadioGroup value={weightUnit} onValueChange={setWeightUnit}>
              <XStack gap="$2">
                <RadioGroup.Item value="kg" id="kg">
                  <RadioGroup.Indicator />
                </RadioGroup.Item>
                <Label htmlFor="kg">Kg</Label>
                <RadioGroup.Item value="lbs" id="lbs">
                  <RadioGroup.Indicator />
                </RadioGroup.Item>
                <Label htmlFor="lbs">Lbs</Label>
              </XStack>
            </RadioGroup>
          </YStack>
        </XStack>

        <Button
          bg={!isValid ? "$gray10" : "$blue10Light"}
          onPress={handleSubmit(onSubmit)}
          disabled={!isValid}
        >
          Submit
        </Button>
      </Form>

      <Sheet
        modal
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        snapPoints={[80]}
        dismissOnSnapToBottom
      >
        <Sheet.Overlay />
        <Sheet.Frame>
          <Sheet.Handle />
          <ScrollView>
            <YStack padding="$4" space="$4">
              <Text fontSize="$6" fontWeight="bold">
                Submitted Form Data
              </Text>
              {submittedData && (
                <>
                  <Text>Full Name: {submittedData.fullName}</Text>
                  <Text>Mobile Number: {submittedData.mobileNumber}</Text>
                  <Text>Email: {submittedData.email || "Not provided"}</Text>
                  <Text>
                    Date of Birth:{" "}
                    {submittedData.dob.toLocaleDateString("en-IN")}
                  </Text>
                  <Text>
                    Height: {submittedData.height} {heightUnit}
                  </Text>
                  <Text>
                    Weight: {submittedData.weight} {weightUnit}
                  </Text>
                </>
              )}

              <Text fontSize="$6" fontWeight="bold" marginTop="$4">
                Form State
              </Text>
              <Text>Is Form Valid: {isValid ? "Yes" : "No"}</Text>
              <Text>Errors:</Text>
              {Object.entries(errors).map(([key, error]) => (
                <Text key={key}>
                  {key}: {error?.message}
                </Text>
              ))}
            </YStack>
          </ScrollView>
        </Sheet.Frame>
      </Sheet>
    </>
  );
};

export default MeasurementsForm;
