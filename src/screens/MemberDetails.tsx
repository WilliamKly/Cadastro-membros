import { useNavigation, useRoute } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import { Card, Heading, HStack, Icon, Image, ScrollView, Text, useToast, View, VStack } from "native-base";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from '@expo/vector-icons'
import { Loading } from "@components/Loading";
import { decode } from 'react-native-base64';
import { UserPhoto } from "@components/UserPhoto";

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
  image: string;
}

interface ApiResponse {
  current_page: number;
  data: Member[];
}

type RouteParamsProps = {
  memberId: string;
}

export function MemberDetails() {
  const [membros, setMembros] = useState<Member>()
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation<AppNavigatorRoutesProps>()

  const toast = useToast()
  const route = useRoute()

  const { memberId } = route.params as RouteParamsProps

  function handleGoBack() {
    navigation.navigate('members')
  }

  async function fetchExerciseDetails() {
    try {
      setIsLoading(true)
      const response = await api.get(`/api/membros/find/${memberId}`)
      setMembros(response.data)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.mensagem : 'Não foi possível carregar os detalhes do exercício.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const base64Image = membros?.image

  useEffect(() => {
    fetchExerciseDetails()
  }, [memberId])

  return(

    <VStack flex={1}>
      <VStack px={8} bg='gray.600' pt={12}>
        <TouchableOpacity onPress={handleGoBack}>
          <Icon
            as={Feather}
            name='arrow-left'
            color='green.500'
            size={6}
          />
        </TouchableOpacity>

        <HStack justifyContent='space-between' mt={4} mb={8} alignItems='center'>
          <Heading color='gray.100' fontSize='lg' flexShrink={1} fontFamily='heading'>
            Informações de {membros?.nome_membro}
          </Heading>
        </HStack>
      </VStack>

      { isLoading ? <Loading /> : 
        <ScrollView>
          <VStack p={8}>

          <View color='white' >
          <Card style={styles.card}>
          <Heading>
            <Text>{membros?.nome_membro}</Text>
          </Heading>
              {
                membros?.image && <UserPhoto position='absolute' top={2} right={2} size={24} alt="Imagem do membro" source={{ uri: `data:image/png;base64,${base64Image}` }} />
              }
              <Text mt={70}>ID: {membros?.id}</Text>
              <Text>__________________________________</Text>
              <Text>Email: {membros?.email_dizimista}</Text>
              <Text>__________________________________</Text>
              <Text>Cidade: {membros?.cidade}</Text>
              <Text>__________________________________</Text>
              <Text>Bairro: {membros?.barrio}</Text>
              <Text>__________________________________</Text>
              <Text>Endereço: {membros?.endereco}</Text>
              <Text>__________________________________</Text>
              <Text>Telefone: {membros?.telefone}</Text>
              <Text>__________________________________</Text>
              <Text>Batismo nas águas: {membros?.batismo_agua}</Text>
              <Text>__________________________________</Text>
              <Text>Data de nascimento: {membros?.data_nascimento}</Text>
              <Text>__________________________________</Text>
              <Text>Situação: {membros?.situacao}</Text>
              <Text>__________________________________</Text>
              <Text>Igreja: {membros?.igreja?.nome_igreja}</Text>
              <Text>__________________________________</Text>
              <Text>Tipo: {membros?.tipo?.tipo}</Text>
              <Text>__________________________________</Text>
              <Text>Data de batismo no Espírito Santo: {membros?.data_batismo_espirito_santo || '-'}</Text>
              <Text>__________________________________</Text>
              <Text>Sexo: {membros?.sexo}</Text>
          </Card>
      </View>
          </VStack>
        </ScrollView>
      }
    </VStack>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
});
