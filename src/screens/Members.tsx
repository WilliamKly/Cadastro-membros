import { useCallback, useState, useEffect } from 'react'
import { ScreenHeader } from "@components/ScreenHeader";
import { RefreshControl, TouchableOpacity, ActivityIndicator } from 'react-native'
import {  VStack, FlatList, Text, View } from "native-base";
import { useFocusEffect } from '@react-navigation/native';
import { api } from '@services/api';
import { MyCard } from '@components/Card';
import usePagination from 'react-native-flatlist-pagination-hook';

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
  data: Member[];
}

export function Members() {
  const [membros, setMembros] = useState<ApiResponse>()
  const [page, setPage] = useState(1);
  //const [params, setParams] = useState({page: 1})
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(false)
  const [lastId, setLastId] = useState(0)

  async function fetchMembros() {
    try {
      setIsLoading(true)
      setRefresh(true)
      const response = await api.get(`/api/membros/all?page=${page}`)
      const data = await response.data.Membros;
      setMembros({ ...data, data: [...membros?.data ?? [], ...data.data] });
      setIsLoading(false)
      setRefresh(false)
    } catch(error) {
      setIsLoading(false)
      console.log(error)
    }
  }

  useEffect(() => {
    fetchMembros()
  }, [page])

  return (
    <VStack flex={1}>
      <ScreenHeader title='Membros cadastrados' />

    <FlatList
      data={membros?.data ?? []}
      renderItem={({ item, index }) => (
        <MyCard key={item?.id} barrio={item.barrio} nome_membro={item.nome_membro} />
          // <Text color='white'>{item.nome_membro}</Text>
      )}
      keyExtractor={(item) => item?.id?.toString()}
      refreshControl={
        <RefreshControl
          refreshing={refresh}
          onRefresh={() => setPage(1)}
          tintColor='white'
          colors={['white']}
        />
      }
      onEndReached={() => {
        if (!refresh) {
          setPage(page + 1)
        }
      }}
      onEndReachedThreshold={0.1}
      ListFooterComponent={() => refresh ? <ActivityIndicator style={{ marginVertical: 20 }} /> : <View style={{height: 50}} />}
    />

    </VStack>
  )
}