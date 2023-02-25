import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigation } from '@react-navigation/native'
import { VStack, Image, Text, Center, Heading, ScrollView, HStack, useToast } from 'native-base'

import { useAuth } from '@hooks/useAuth'

import { AuthNavigatiorRoutesProps } from '@routes/auth.routes'

import { Input } from '@components/Input'
import { Button } from '@components/Button'
import { AppError } from '@utils/AppError'

type FormData = {
  email: string;
  password: string;
}

export function SignIn() {
  const [isLoading, setIsLoading] = useState(false)

  const { signIn } = useAuth()

  const navigation = useNavigation<AuthNavigatiorRoutesProps>()
  
  const toast = useToast()

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>()

  async function handleSignIn({ email, password }: FormData) {
    try {
      setIsLoading(true)
      await signIn(email, password)
    } catch(error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.mensagem : 'Email e/ou senha incorreta.'

      setIsLoading(false)
      toast.show({
        title,
        justifyContent: 'center',
        marginBottom: 250,
        bgColor: 'red.500'
      })
    
    }
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
      <VStack flex={1} px={10} pb={16} bg='white'>
        
        <Center my={24}>
          <Heading fontSize='xl' fontWeight='bold' color='green.700'>
            Assembleia de Deus Fronteiras - PI
          </Heading>
          <Text color='gray.400' fontSize='sm'>
            Sistema de cadastro de membros
          </Text>
        </Center>

        <Center mt={50}>
          <Heading color='gray.400' fontSize='xl' mb={6} fontFamily='heading'>
            Acesse sua conta
          </Heading>

          <Controller
            control={control}
            name='email'
            rules={{ required: 'Informe o e-mail' }}
            render={({ field: { onChange } }) => (
              <Input
              placeholder='E-mail'
              keyboardType='email-address'  
              onChangeText={onChange}
              errorMessage={errors.email?.message}
              autoCapitalize='none'
            />
            )}
          />

          <Controller
            control={control}
            name='password'
            rules={{ required: 'Informe a senha' }}
            render={({ field: { onChange } }) => (
              <Input
              secureTextEntry
              placeholder='Senha'
              onChangeText={onChange}
              errorMessage={errors.email?.message}
            />
            )}
          />

          <Button
            title='Acessar'
            onPress={handleSubmit(handleSignIn)}
            isLoading={isLoading}
          />
        </Center>
        
        <Center mt="70%">
          
          <Text mt={5}>
            Versão 1.0 ™
          </Text>
        </Center>  
      </VStack>
      
      
    </ScrollView>
      
  )
}