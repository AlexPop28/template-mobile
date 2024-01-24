import React, { useEffect, useState } from "react";
import { FlatList, Text, TextInput, TouchableOpacity } from "react-native";
import { Container } from "../components/Container";
import { useRepository } from "../lib/RepositoryContext";
import { Model } from "../model/model";
import { sharedStyles } from "./styles";

const SearchScreen = ({}) => {
  const repository = useRepository();
  const [items, setItems] = useState<Model[]>([]);
  const [selectedObjects, setSelectedObjects] = useState<Model[]>([]);
  const [searchField, setSearchField] = useState<string>();

  const renderItem = ({ item }: { item: Model }) => {
    return (
      <TouchableOpacity onPress={() => {}}>
        <Text style={sharedStyles.text}>{item.id}</Text>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    repository
      .search()
      .then((items) => setItems(items))
      .catch((_e) => {});
  }, []);

  useEffect(() => {
    console.log("Filtering again");
    const filteredObjects = [...items];
    setSelectedObjects(filteredObjects);
  }, [items, searchField]);

  return (
    <Container isAvailable={repository.isSearchAvailable || true}>
      <TextInput
        placeholder="Search field"
        onChangeText={(text) => setSearchField(text)}
      />
      <FlatList
        data={selectedObjects}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </Container>
  );
};

export default SearchScreen;
