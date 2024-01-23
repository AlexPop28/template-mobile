import React, { useLayoutEffect } from "react";
import { Button, FlatList, Text, TouchableOpacity, View } from "react-native";
import { useRepository } from "../lib/RepositoryContext";
import { Model } from "../model/model";
import { sharedStyles } from "./styles";

// const renderDeleteButton = (id: number, repository: Repository) => {
//   return (
//     <TouchableOpacity
//       onPress={() => repository.remove(id)}
//       style={{
//         backgroundColor: "red",
//         justifyContent: "center",
//         paddingLeft: 20,
//       }}
//     >
//       <Text style={{ color: "white", fontWeight: "bold" }}>Delete</Text>
//     </TouchableOpacity>
//   );
// };

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
    <View style={sharedStyles.container}>
      {repository.isLoading && <Text>Loading...</Text>}
      {!repository.isLoading && (
        <>
          {!repository.isOffline && (
            <Text style={{ color: "green" }}>Online</Text>
          )}
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
        </>
      )}
    </View>
  );
};

export default HomeScreen;
