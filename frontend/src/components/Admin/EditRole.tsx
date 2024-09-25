import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react"
import type React from "react"
import {type SubmitHandler, useForm} from "react-hook-form"
import {useMutation, useQueryClient} from "react-query"

import {
  type ApiError,
  type RolePublic,
  type RoleUpdate,
  RoleService,
} from "../../client"
import useCustomToast from "../../hooks/useCustomToast"

interface EditRoleProps {
  role: RoleOut
  isOpen: boolean
  onClose: () => void
}


const EditRole: React.FC<EditRoleProps> = ({role, isOpen, onClose}) => {
  const queryClient = useQueryClient()
  const showToast = useCustomToast()

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, isDirty},
  } = useForm<RoleUpdate>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: role,
  })

  const updateRole = async (data: RoleUpdate) => {
    await RoleService.updateRole({roleId: role.id, requestBody: data})
  }

  const mutation = useMutation(updateRole, {
    onSuccess: () => {
      showToast("Success!", "Role updated successfully.", "success")
      onClose()
    },
    onError: (err: ApiError) => {
      const errDetail = err.body?.detail
      showToast("Something went wrong.", `${errDetail}`, "error")
    },
    onSettled: () => {
      queryClient.invalidateQueries("users")
    },
  })

  const onSubmit: SubmitHandler<RoleUpdate> = async (data) => {
    if (data.name === "") {
      data.name = undefined
    }
    mutation.mutate(data)
  }

  const onCancel = () => {
    reset()
    onClose()
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={{base: "sm", md: "md"}}
        isCentered
      >
        <ModalOverlay/>
        <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>编辑角色信息</ModalHeader>
          <ModalCloseButton/>
          <ModalBody pb={6}>
            <FormControl mt={4}>
              <FormLabel htmlFor="name">角色名称</FormLabel>
              <Input id="name" {...register("name")} type="text"/>
            </FormControl>
            <FormControl mt={4}>
              <FormLabel htmlFor="name">角色编码</FormLabel>
              <Input id="code" {...register("code")} type="text"/>
            </FormControl>
            <FormControl mt={4}>
              <Checkbox {...register("status")} colorScheme="teal">
                是否开启？
              </Checkbox>
            </FormControl>


          </ModalBody>

          <ModalFooter gap={3}>
            <Button
              variant="primary"
              type="submit"
              isLoading={isSubmitting}
              isDisabled={!isDirty}
            >
              保存
            </Button>
            <Button onClick={onCancel}>取消</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default EditRole
