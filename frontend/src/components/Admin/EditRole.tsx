import {
  Button,
  FormControl,
  FormErrorMessage,
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
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { type SubmitHandler, useForm } from "react-hook-form"

import {
  type ApiError,
  type RolePublic,
  type RoleUpdate,
  RolesService,
} from "../../client"
import useCustomToast from "../../hooks/useCustomToast"
import { handleError } from "../../utils"

interface EditRoleProps {
  role: RolePublic
  isOpen: boolean
  onClose: () => void
}

const EditRole = ({ role, isOpen, onClose }: EditRoleProps) => {
  const queryClient = useQueryClient()
  const showToast = useCustomToast()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<RoleUpdate>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: role,
  })

  const mutation = useMutation({
    mutationFn: (data: RoleUpdate) =>
      RolesService.updateRole({ roleId: role.id, requestBody: data }),
    onSuccess: () => {
      showToast("成功!", "角色更新成功。", "success")
      onClose()
    },
    onError: (err: ApiError) => {
      handleError(err, showToast)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] })
    },
  })

  const onSubmit: SubmitHandler<RoleUpdate> = async (data) => {
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
        size={{ base: "sm", md: "md" }}
        isCentered
      >
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>编辑角色</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isInvalid={!!errors.name}>
              <FormLabel htmlFor="name">角色名称</FormLabel>
              <Input
                id="name"
                {...register("name", {
                  required: "角色名称是必填的",
                })}
              />
              {errors.name && (
                <FormErrorMessage>{errors.name.message}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl mt={4}>
              <FormLabel htmlFor="description">描述</FormLabel>
              <Input id="description" {...register("description")} />
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