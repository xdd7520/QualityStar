import {
  Button,
  Container,
  Heading,
  Text,
  useDisclosure,
} from "@chakra-ui/react"

import DeleteConfirmation from "./DeleteConfirmation"

const DeleteAccount = () => {
  const confirmationModal = useDisclosure()

  return (
    <>
      <Container maxW="full">
        <Heading size="sm" py={4}>
          删除账户
        </Heading>
        <Text>
          永久删除您的数据和与您的账户相关的所有内容。
        </Text>
        <Button variant="danger" mt={4} onClick={confirmationModal.onOpen}>
          删除
        </Button>
        <DeleteConfirmation
          isOpen={confirmationModal.isOpen}
          onClose={confirmationModal.onClose}
        />
      </Container>
    </>
  )
}
export default DeleteAccount
