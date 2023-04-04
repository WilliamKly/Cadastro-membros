import { ReactNode, useCallback, useState ,} from 'react'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { ActivityIndicator, StyleSheet } from "react-native";
import { HomeHeader } from "@components/HomeHeader";
import { VStack, HStack, Heading, Text, useToast, ScrollView, Select, Center, Skeleton, usePlatformProps, Card, View } from "native-base";
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import { Controller, useForm } from 'react-hook-form';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { KeyboardAvoidingView } from 'native-base';
import { TouchableOpacity } from 'react-native'
import { UserPhoto } from '@components/UserPhoto';
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import { useAuth } from '@hooks/useAuth';

type FormData = {
  nome_membro: string;
  email_dizimista: string;
  cidade: string;
  barrio: string;
  endereco: string;
  telefone: string;
  batismo_agua: string;
  data_nascimento: string;
  cargo: string;
  situacao: number;
  fk_igreja: number;
  data_batismo_espirito_santo: string;
  sexo: string;
}

interface Cargo {
  id: number;
  tipo: string;
}

export interface ApiResponse {
  Cargos: Cargo[];
}

interface Igreja {
  id: number;
  nome_igreja: string;
}

export interface ResponseIgrejas {
  Igrejas: Igreja[];
}

const signUpSchema = yup.object({
  nome_membro: yup.string().required('Informe o nome.')
})

const PHOTO_SIZE = 33

export function Home() {


  const [isLoading, setIsLoading] = useState(false)

  const toast = useToast()
  const navigation = useNavigation<AppNavigatorRoutesProps>()
  const [names, setNames] = useState<ApiResponse>();
  const [igrejas, setIgrejas] = useState<ResponseIgrejas>();
  const [selectedType, setSelectedType] = useState()
  const [selectedIgreja, setSelectedIgreja] = useState();
  const [selectedTypeId, setSelectedTypeId] = useState("");
  const [selectedTypeIdIgreja, setSelectedTypeIdIgreja] = useState("");
  const [photoIsLoading, setPhotoIsLoading] = useState(false)
  const [userPhoto, setUserPhoto] = useState('https://www.pngitem.com/pimgs/m/150-1503945_transparent-user-png-default-user-image-png-png.png')
  const [saveIdMember, setSaveIdMember] = useState()
  const [photo, setPhoto] = useState<any>()

  const { user } = useAuth()
  const [loading, setLoading] = useState(false);
  async function handleUsePhotoSelect() {
    setPhotoIsLoading(true)
    try{
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
        //mediaTypes: ImagePicker.MediaTypeOptions.All,
      })
  
      if(photoSelected.canceled) {
        return
      }

      if(photoSelected.assets[0].uri){
        const photoInfo = await FileSystem.getInfoAsync(photoSelected.assets[0].uri)
        
        if(photoInfo.size && (photoInfo.size / 1024 / 1024) > 5) {
          return toast.show({
            title: 'Essa imagem é muito grande! escolha uma de até 5mb',
            placement: 'top',
            bgColor: 'red.500'
          })
        }
        
        const fileExtension = photoSelected.uri?.split('.').pop()
        const photoFile = {
          name: `${user.name}.${fileExtension}`.toLocaleLowerCase(),
          uri: photoSelected.uri,
          type: `${photoSelected.type}/${fileExtension}`
        } as any

        const userPhotoUploadForm = new FormData()
        userPhotoUploadForm.append('file', photoFile)

        // toast.show({
        //   title: 'Foto atualizada!',
        //   placement: 'top',
        //   bgColor: 'green.400'
        // })

        console.log('photoFile', photoFile)
        setPhoto(userPhotoUploadForm)
        setUserPhoto(photoSelected.assets[0].uri)
      }
  
    } catch(err) {
      console.log(err)
    } finally {
      setPhotoIsLoading(false)
    }
  }
  
  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(signUpSchema)
  })

  async function fetchTypes() {
    try {
      const response = await api.get('/api/igrejas/tipos')
      setNames(response.data)
    } catch(error) {
      console.log(error)
    }
  }

  async function fetchIgrejas() {
    try {
      const response = await api.get('/api/igrejas/all')
      setIgrejas(response.data)
    } catch(error) {
      console.log(error)
    }
  }

  async function handleCreate({ 
    nome_membro,
    email_dizimista,
    cidade,
    barrio,
    endereco,
    telefone,
    batismo_agua,
    data_nascimento,
    cargo,
    situacao,
    fk_igreja,
    data_batismo_espirito_santo,
    sexo,
   }: FormData) {
    try {
      setIsLoading(true)

      //const base64Photo = await FileSystem.readAsStringAsync(userPhoto, { encoding: FileSystem.EncodingType.Base64 });
      console.log('user photo', userPhoto)
      const res = await api.post('/api/membros/create', {
        nome_membro,
        email_dizimista,
        cidade,
        barrio,
        endereco,
        telefone,
        batismo_agua,
        data_nascimento,
        cargo: selectedType,
        situacao,
        fk_igreja: selectedIgreja,
        data_batismo_espirito_santo,
        sexo,
      })
      setSaveIdMember(res.data.Membro.id)
      const id = await res?.data?.Membro?.id

      await api.post(`/api/membros/create/perfil/${id}`, photo, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      
      const message = "Membro cadastrado com sucesso!";
      toast.show({
        title: message,
        bgColor: 'green.800',
        placement: 'top',
        duration: 9000,
      });
    

      setIsLoading(false)
      reset()
    } catch(error) {
      setIsLoading(false)

      const isAppError = error instanceof AppError
      const title = isAppError ? error.mensagem : 'Não foi possível cadastrat o membro. Tente novamente mais tarde.'
      
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    }
  }
  
  function setTypeFunction(type: any) {
    setSelectedType(type);
    setSelectedTypeId(type.value);
  }

  function setTypeIgrejaFunction(type: any) {
    setSelectedIgreja(type);
    setSelectedTypeIdIgreja(type.value);
  }

  useFocusEffect(useCallback(() => {
    fetchTypes()
    fetchIgrejas()
  }, []))

  const types = names?.Cargos.map(item => ({ label: item.tipo, value: item.id.toString() }));
  const typesIgrejas = igrejas?.Igrejas.map(item => ({ label: item.nome_igreja, value: item.id.toString() }));

  return (

    
    <VStack flex={1}>

      
      <HomeHeader />

      <VStack flex={1} mt={4} px={8}>
        <HStack justifyContent='space-between' mb={5}>
          <Heading color='gray.200' fontSize='md' fontFamily='heading'>
            Cadastrar um novo membro
          </Heading>
        </HStack>
        <KeyboardAvoidingView
          keyboardVerticalOffset={5}
          style={{ flex: 1 }}>
        <ScrollView>
          
    <Card flex={1} style={styles.cardLista}>

        <Center mt={6} px={10}>
          {
            
            photoIsLoading ?
            <Skeleton
              w={PHOTO_SIZE}
              h={PHOTO_SIZE}
              rounded='full'
              startColor='gray.500'
              endColor='gray.400'
            />
            :
            <UserPhoto 
              source={{ uri: userPhoto }}
              alt='Foto do usuário'
              size={PHOTO_SIZE}
            />
          }
          

          <TouchableOpacity onPress={handleUsePhotoSelect}>
            <Text color='black' fontWeight='bold' fontSize='md' mt={2} mb={8}>
              Escolher foto do membro
            </Text>
          </TouchableOpacity>
        </Center>

        <Controller
            control={control}
            name='nome_membro'
            rules={{ required: 'Informe o nome' }}
            render={({ field: { onChange } }) => (
              <Input
              style={styles.text}
              placeholder='Nome Completo'
              onChangeText={onChange}
              errorMessage={errors.nome_membro?.message}
            />
            )}
        />

        <Controller
            control={control}
            name='email_dizimista'
            render={({ field: { onChange } }) => (
              <Input
              style={styles.text}
              placeholder='E-mail'
              onChangeText={onChange}
              errorMessage={errors.email_dizimista?.message}
            />
            )}
        />
        

        <Controller
            control={control}
            name='cidade'
            rules={{ required: 'Informe a cidade' }}
            render={({ field: { onChange } }) => (
              <Input
              style={styles.text}
              placeholder='Cidade'
              onChangeText={onChange}
              errorMessage={errors.cidade?.message}
            />
            )}
        />

        <Controller
            control={control}
            name='barrio'
            rules={{ required: 'Informe o bairro' }}
            render={({ field: { onChange } }) => (
              <Input
              style={styles.text}
              placeholder='Bairro'
              onChangeText={onChange}
              errorMessage={errors.barrio?.message}
            />
            )}
        />

        <Controller
            control={control}
            name='endereco'
            rules={{ required: 'Informe o endereço' }}
            render={({ field: { onChange } }) => (
              <Input
              style={styles.text}
              placeholder='Endereço'
              onChangeText={onChange}
              errorMessage={errors.endereco?.message}
            />
            )}
        />


        <Controller
            control={control}
            name='telefone'
            rules={{ required: 'Informe o número do telefone' }}
            render={({ field: { onChange } }) => (
              <Input
              style={styles.text}
              placeholder='Telefone - (00) 00000-0000'
              onChangeText={onChange}
              errorMessage={errors.telefone?.message}
            />
            )}
        />

        <Controller
            control={control}
            name='batismo_agua'
            rules={{ required: 'Informe a data do batismo' }}
            render={({ field: { onChange } }) => (
              <Input
              style={styles.text}
              placeholder='Data de Batismo nas águas'
              onChangeText={onChange}
              errorMessage={errors.batismo_agua?.message}
            />
            )}
        />

        <Controller
            control={control}
            name='data_nascimento'
            rules={{ required: 'Informe a data de nascimento' }}
            render={({ field: { onChange } }) => (
              <Input
              style={styles.text}
              placeholder='Data de nascimento'
              onChangeText={onChange}
              errorMessage={errors.data_nascimento?.message}
            />
            )}
        />

        <Controller
            control={control}
            name='data_batismo_espirito_santo'
            render={({ field: { onChange } }) => (
              <Input
              style={styles.text}
              placeholder='Data do batismo no ES'
              onChangeText={onChange}
              errorMessage={errors.data_batismo_espirito_santo?.message}
            />
            )}
        />

        <Select
          placeholder='Cargo'
          placeholderTextColor='gray.900'
          selectedValue={selectedType}
          onValueChange={setTypeFunction}
          bg='gray.100'
          h={14}
          px={4}
          mb={15}
          borderWidth={2}
          style={styles.text}
          color='gray.900'
          fontFamily='body'
        >
          {types?.map(type => (
            <Select.Item key={type.value} label={type.label} value={type.value} />
          ))}
        </Select>

        <Controller
            control={control}
            name='situacao'
            render={({ field: { onChange } }) => (
              <Input
              style={styles.text}
              placeholder='Situação do membro'
              onChangeText={onChange}
              errorMessage={errors.situacao?.message}
            />
            )}
        />

        <Select
          placeholder='Igreja'
          placeholderTextColor='gray.900'
          selectedValue={selectedIgreja}
          onValueChange={setTypeIgrejaFunction}
          bg='gray.100'
          h={14}
          px={4}
          mb={15}
          borderWidth={2}
          style={styles.text}
          color='gray.900'
          fontFamily='body'
        >
          {typesIgrejas?.map(type => (
            <Select.Item key={type.value} label={type.label} value={type.value} />
          ))}
        </Select>

        <Controller
            
            control={control}
            name='sexo'
            render={({ field: { onChange } }) => (
              <Input
              style={styles.text}
              placeholder='Sexo'
              onChangeText={onChange}
              errorMessage={errors.sexo?.message}
            />
            )}
        />

        
        <Button
            
            title='Cadastrar membro'
            onPress={handleSubmit(handleCreate)}
            isLoading={isLoading}
            h={12}
          />

</Card>
        
        </ScrollView>
        </KeyboardAvoidingView>
      </VStack>

    </VStack>
  )
}

const styles = StyleSheet.create({
  card: {
    padding: 0,
    margin: 0,
    marginVertical: 1,
    marginHorizontal: 1,
    shadowColor: '#000',
    fontSize: 12,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },

  cardLista: {
    backgroundColor: 'white',
    borderRadius: 8,
    margin:58,
    marginVertical: 2,
    marginHorizontal: 1,
    borderWidth: 1,
    borderColor: '#dcdcdc',  
  },

  text:{
    fontSize: 10,
  }
});