import React, { ReactNode } from "react";
import { Text, View } from "react-native";
import { useRepository } from "../lib/RepositoryContext";
import { sharedStyles } from "../screens/styles";

interface ConditionalWrapperProps {
  children: ReactNode;
}

const Container: React.FC<ConditionalWrapperProps> = ({
  children,
}) => {
  const repository = useRepository();
  return (
    <View style={sharedStyles.container}>
      {repository.isLoading && <Text>Loading...</Text>}
      {!repository.isLoading && <>{children}</>}
    </View>
  );
};

export default Container;
