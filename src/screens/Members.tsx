import { useState, useEffect } from 'react'
import { ScreenHeader } from "@components/ScreenHeader";
import { RefreshControl, ActivityIndicator} from 'react-native'
import {  VStack, FlatList, View } from "native-base";
import { api } from '@services/api';
import { MyCard } from '@components/Card';
import { useNavigation } from '@react-navigation/native'
import { Input } from '@components/Input';

import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { Ionicons } from '@expo/vector-icons';

interface Member {
  id: number;
  nome_membro: string;
  email_dizimista: string;
  cidade: string;
  barrio: string;
  endereco: string;
  telefone: string;
  batismo_agua: string;
  data_nascimento: string;
  cargo: string;
  situacao: string;
  fk_igreja: number;
  data_batismo_espirito_santo: string | null;
  sexo: string;
  updated_at: string;
  created_at: string;
  igreja: {
    id: number;
    dirigente: string;
    nome_igreja: string;
    cidade: string;
    barrio: string;
    endereco: string;
  };
  tipo: {
    id: number;
    tipo: string;
  };
}

interface ApiResponse {
  current_page: number;
  Membros: Member[];
}

export function Members() {
  const [membros, setMembros] = useState<ApiResponse>()
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(false)
  const [searchTerm, setSearchTerm] = useState('');
  const [hasMore, setHasMore] = useState(true);
  
  const navigation = useNavigation<AppNavigatorRoutesProps>()

  const fetchMembros = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/api/membros/all`);
      const data = await response.data;
      setMembros(data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMembros();
  }, []);

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/api/membros/find?nome=${searchTerm}`);
      const data = await response.data.Membros;
      setMembros(data);
      setHasMore(false);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const handleRefresh = async () => {
    setRefresh(true);
    await fetchMembros();
    setRefresh(false);
  };

  const handleMemberPress = (memberId: string) => {
    navigation.navigate('memberDetails', {memberId});
  };

  return (
    <VStack flex={1}>
      <ScreenHeader title='Membros cadastrados' />

      <Input
        value={searchTerm}
        onChangeText={text => setSearchTerm(text)}
        onSubmitEditing={handleSearch}
        placeholder="Buscar por nome"
        h={58}
        px={2}
        mb={0}
        mt={2}
        mx={4}
        borderWidth={2}
        InputLeftElement={
          <Ionicons
            name="search-outline"
            size={24}
            color="gray"
            style={{ marginLeft: 5 }}
          />
        }
      />

      <FlatList
          data={membros?.Membros?.filter(item => item?.nome_membro?.includes(searchTerm)) ?? []}
          renderItem={({ item, index }) => (
            <MyCard
              key={item?.id}
              id={item?.id}
              barrio={item.barrio}
              nome_membro={item.nome_membro}
              onPress={() => handleMemberPress(item.id.toString())}
              />
              // <Text color='white'>{item.nome_membro}</Text>
          )}
        ListEmptyComponent={
        isLoading ? (
        <View  flex={1} justifyContent="center" alignItems="center">
           <ActivityIndicator size="large" color="blue.500" />
        </View>
        ) : (
          <View flex={1} justifyContent="center" alignItems="center">
          <Ionicons
                     name="person-circle-outline"
                     size={100}
                     color="gray"
                   />
        </View>
        )
        }
          refreshControl={
            <RefreshControl refreshing={refresh} onRefresh={handleRefresh} />
          }
          onEndReached={() => {
            if (hasMore) {
              // Lógica para buscar mais membros, caso existam
            }
          }
        }
        onEndReachedThreshold={0.50}
        />
        </VStack>
        );
        }
