import {
  Badge,
  Container,
  Heading,
  Radio,
  RadioGroup,
  Stack,
  useColorMode,
} from "@chakra-ui/react"

const Appearance = () => {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <>
      <Container maxW="full">
        <Heading size="sm" py={4}>
          外观
        </Heading>
        <RadioGroup onChange={toggleColorMode} value={colorMode}>
          <Stack>
            {/* TODO: 添加系统默认选项 */}
            <Radio value="light" colorScheme="teal">
              浅色模式
              <Badge ml="1" colorScheme="teal">
                默认
              </Badge>
            </Radio>
            <Radio value="dark" colorScheme="teal">
              深色模式
            </Radio>
          </Stack>
        </RadioGroup>
      </Container>
    </>
  )
}
export default Appearance
