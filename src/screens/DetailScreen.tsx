import React, { useEffect, useLayoutEffect, useState } from "react";
import { Alert, Button, Text } from "react-native";
import Container from "../components/Container";
import { useRepository } from "../lib/RepositoryContext";
import { Model, modelToString } from "../model/model";
import { sharedStyles } from "./styles";

const DetailScreen = ({ route, navigation }: any) => {
  const { id } = route.params;
  const repository = useRepository();
  const [model, setModel] = useState<Model>();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <>
          {repository.isEditAvailable && (
            <Button
              title="Edit"
              onPress={() => navigation.navigate("Edit", { id })}
            />
          )}
          {repository.isDeleteAvailable && (
            <Button
              title="Delete"
              onPress={() => {
                Alert.alert(
                  "Are you sure you want to delete this object?",
                  "This operation cannot be undone.",
                  [
                    {
                      text: "Delete",
                      onPress: () => {
                        repository.remove(id).finally(() => {
                          navigation.navigate("Home");
                        });
                      },
                    },
                    { text: "Cancel", onPress: () => {} },
                  ],
                );
              }}
            />
          )}
        </>
      ),
    });
  }, [navigation, id]);

  useEffect(() => {
    repository
      .getById(id)
      .then((model) => setModel(model))
      .catch((_e) => {});
  }, [id]);

  return (
    <Container>
      {model?.has_data && (
        <Text style={sharedStyles.text}>{modelToString(model)}</Text>
      )}
      {model === undefined && (
        <Text style={sharedStyles.text}>
          You are offline and there is no data for this entity in the local
          database.
        </Text>
      )}
    </Container>
  );
};

export default DetailScreen;
