import React, { useState } from "react";
import { Button, TextInput } from "react-native";
import { Container } from "../components/Container";
import { useRepository } from "../lib/RepositoryContext";
import { Model } from "../model/model";

const AddScreen = ({ navigation }: any) => {
  const repository = useRepository();
  const [_name, setName] = useState("");

  const handleSave = () => {
    const formData: Model = {
      id: -42,
      has_data: 1,
    };
    repository.add(formData).then(() => {
      navigation.navigate("Home");
    });
  };

  return (
      <Container isAvailable={repository.isAddAvailable}>
      <TextInput placeholder="Name" onChangeText={(text) => setName(text)} />
      <Button title="Save" onPress={handleSave} />
    </Container>
  );
};

export default AddScreen;
