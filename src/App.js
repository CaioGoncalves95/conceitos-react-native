import React, { useState, useEffect } from "react";

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import api from './services/api';

export default function App() {

  const [repos, updateRepos] = useState([]);

  useEffect(() => {
    api.get('/repositories').then(response => {
      updateRepos(response.data);
    })
  }, [])

  async function handleLikeRepository(id) {
    const response = await api.post(`/repositories/${id}/like`, {}); // tenho a resposta de quantos likes o repo tem agora
    const repoIndex = repos.findIndex(repo => repo.id === response.data.id); // acho o index desse repo no meu state
    const reposToUpdate = [...repos]; // uso imutabilidade para pegar meus repos
    reposToUpdate[repoIndex].likes = response.data.likes; // atualizo o numero de likes do repo com o novo nr de likes

    updateRepos(reposToUpdate); //atualiza state dos componentes
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
           <FlatList
            data={repos}
            keyExtractor={repo => repo.id}
            renderItem={({ item }) => (
              <View style={styles.repositoryContainer}>
                <Text style={styles.repository}>{item.title}</Text>

                <View style={styles.techsContainer}>
                  {item.techs.map(tech => <Text key={tech} style={styles.tech}>{tech}</Text>)}
                </View>           

                <View style={styles.likesContainer}>
                  <Text
                    style={styles.likeText}
                    testID={`repository-likes-${item.id}`}
                  >
                    {item.likes} curtidas
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleLikeRepository(item.id)}
                  testID={`like-button-${item.id}`}
                  >
                  <Text style={styles.buttonText}>Curtir</Text>
                  </TouchableOpacity>
              </View>
            )}/> 
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginTop:10,
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10
  },
  repository: {
    textAlign: 'center',
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
    display: 'flex',
    alignItems: 'center',
  },
  buttonText: {
    textAlign: 'center',
    width: 100,
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
    borderRadius: 10
  },
});
