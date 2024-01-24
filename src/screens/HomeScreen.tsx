import React, { useLayoutEffect } from "react";
import { Button, FlatList, Text, TouchableOpacity } from "react-native";
import { Container } from "../components/Container";
import { useRepository } from "../lib/RepositoryContext";
import { Model } from "../model/model";
import { sharedStyles } from "./styles";

const HomeScreen = ({ navigation }: any) => {
  const repository = useRepository();

  const renderItem = ({ item }: { item: Model }) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("Detail", { id: item.id })}
      >
        <Text style={sharedStyles.text}>{item.id}</Text>
      </TouchableOpacity>
    );
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <>
          <Button title="Add" onPress={() => navigation.navigate("Add")} />
          <Button
            title="Search"
            onPress={() => navigation.navigate("Search")}
          />
        </>
      ),
    });
  }, [navigation]);

  return (
    <Container isAvailable={true}>
      {!repository.isOffline && <Text style={{ color: "green" }}>Online</Text>}
      {repository.isOffline && (
        <>
          <Text>It looks like you are offline. Do you want to retry?</Text>
          <Button onPress={repository.retryFetch} title="Retry" />
        </>
      )}
      <FlatList
        data={repository.objects}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </Container>
  );
};

export default HomeScreen;
