import { useCallback, useState } from 'react'
import { ScreenHeader } from "@components/ScreenHeader";
import {  VStack, FlatList } from "native-base";
import { useFocusEffect } from '@react-navigation/native';
import { api } from '@services/api';
import { MyCard } from '@components/Card';

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
  Membros: Member[];
}

export function Members() {
  const [membros, setMembros] = useState<ApiResponse>()

  async function fetchMembros() {
    try {
      const response = await api.get('/api/membros/all')
      setMembros(response.data)
      //console.log(response.data)
    } catch(error) {
      console.log(error)
    }
  }

  useFocusEffect(useCallback(() => {
    fetchMembros()
  }, []))

  return (
    <VStack flex={1}>
      <ScreenHeader title='Membros cadastrados' />

      {/* <SectionList
        sections={exercises}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <HistoryCard />
        )}
        renderSectionHeader={({ section }) => (
          <Heading color='gray.200' fontSize='md' mt={10} mb={3} fontFamily='heading'>
            {section.title}
          </Heading>
        )}
        px={8}
        contentContainerStyle={exercises.length === 0 && { flex: 1, justifyContent: 'center' }}
        ListEmptyComponent={() => (
          <Text color='gray.100' textAlign='center'>
            Não há exercícios registrados ainda. {'\n'}
            Vamos fazer exercícios hoje?
          </Text>
        )}
        showsVerticalScrollIndicator={false}
      /> */}

    <FlatList
      data={membros?.Membros ?? []}
      renderItem={({ item }) => (
        <MyCard barrio={item.barrio} nome_membro={item.nome_membro} />
          // <Text color='white'>{item.nome_membro}</Text>
      )}
      keyExtractor={(item) => item.id.toString()}
    />

    </VStack>
  )
}