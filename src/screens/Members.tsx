import { useState, useEffect } from 'react'
import { ScreenHeader } from "@components/ScreenHeader";
import { RefreshControl, ActivityIndicator} from 'react-native'
import {  VStack, FlatList, View } from "native-base";
import { api } from '@services/api';
import { MyCard } from '@components/Card';
import { useNavigation } from '@react-navigation/native'
import { Input } from '@components/Input';

import { AppNavigatorRoutesProps } from '@routes/app.routes';

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
  //const [page, setPage] = useState(1);
  //const [params, setParams] = useState({page: 1})
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(false)
  const [searchTerm, setSearchTerm] = useState('');
  const [hasMore, setHasMore] = useState(true);
  
  const navigation = useNavigation<AppNavigatorRoutesProps>()

  async function fetchMembros() {
    try {
      setIsLoading(true)
      setRefresh(true)
      const response = await api.get(`/api/membros/all`)
      const data = await response.data;
      setMembros(data)
      //setMembros({ ...data, data: [...membros?.data ?? [], ...data.data] });
      setIsLoading(false)
      setRefresh(false)
    } catch(error) {
      setIsLoading(false)
      console.log(error)
    }
  }

  const handleSearch = async () => {
    const response = await api.get(`/api/membros/find?nome=${searchTerm}`)
    const data = await response.data.Membros;
    setMembros(data)
    setHasMore(false)
  };

  // const handleLoadMore = () => {
  //   if (!refresh && hasMore) {
  //     setPage(page + 1);
  //   }
  // };

  const handleMemberPress = (memberId: string) => {
    navigation.navigate('memberDetails', {memberId});
  };

  useEffect(() => {
    fetchMembros()
  }, [])

  return (
    <VStack flex={1}>
      <ScreenHeader title='Membros cadastrados' />

      <Input
        value={searchTerm}
        onChangeText={text => setSearchTerm(text)}
        onSubmitEditing={handleSearch}
        placeholder="Digite o nome a ser pesquisado"
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
      keyExtractor={(item) => item?.id?.toString()}
      refreshControl={
        <RefreshControl
          refreshing={refresh}
          onRefresh={() => refresh}
          tintColor='white'
          colors={['white']}
        />
      }
      // onEndReached={() => {
      //   if (hasMore && !refresh) {
      //     handleLoadMore();
      //   }
      // }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={() => refresh ? <ActivityIndicator style={{ marginVertical: 20 }} /> : <View style={{height: 50}} />}
    />

    </VStack>
  )
}