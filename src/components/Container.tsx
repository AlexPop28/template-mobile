import React, { ReactNode } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useRepository } from "../lib/RepositoryContext";
import { sharedStyles } from "../screens/styles";

interface ConditionalWrapperProps {
    isAvailable: boolean;
    children: ReactNode;
}

const Container: React.FC<ConditionalWrapperProps> = ({
    isAvailable,
    children,
}) => {
    const repository = useRepository();
    return (
        <View style={sharedStyles.container}>
      {repository.isLoading && (
        <>
          <ActivityIndicator animating={true} color="#007AFF" size="large" />
          <Text>Loading...</Text>
        </>
      )}
      {!repository.isLoading && (
        <>
          {isAvailable && children}
          {!isAvailable && (
            <Text>
              Sorry, this operations is not available at this time. Please try
              again later.
            </Text>
          )}
        </>
      )}
    </View>
  );
};

export { Container };
