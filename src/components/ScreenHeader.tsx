import { Center, Heading } from "native-base";

type Props = {
  title: string;
}

export function ScreenHeader({ title }: Props) {
  return (
    <Center bg='gray.600' pb={6} pt={10}>
      <Heading color='gray.100' fontSize={12} fontFamily='heading'>
        {title}
      </Heading>
    </Center>
  )
}