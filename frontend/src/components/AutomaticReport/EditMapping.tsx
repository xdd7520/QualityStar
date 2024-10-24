import React from "react";
import {
  Button,
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
} from "@chakra-ui/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import {ApiError, type ProjectNameMappingOut, ProjectsService} from "../../client";
import useCustomToast from "../../hooks/useCustomToast";

interface EditProjectMappingProps {
  projectMapping: ProjectNameMappingOut;
  isOpen: boolean;
  onClose: () => void;
}

const EditProjectMapping: React.FC<EditProjectMappingProps> = ({
                                                                 projectMapping,
                                                                 isOpen,
                                                                 onClose,
                                                               }) => {
  const queryClient = useQueryClient();
  const showToast = useCustomToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, isDirty },
  } = useForm<ProjectNameMappingOut>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: projectMapping,
  });

  const updateProjectMapping = async (data: ProjectNameMappingOut) => {
    await ProjectsService.updateProjectMapping({ mappingId: projectMapping.id, requestBody: data });
  };

  const mutation = useMutation(updateProjectMapping, {
    onSuccess: () => {
      showToast("Success!", "Project mapping updated successfully.", "success");
      onClose();
    },
    onError: (err: ApiError) => {
      const errDetail = err.body?.detail;
      showToast("Something went wrong.", `${errDetail}`, "error");
    },
    onSettled: () => {
      queryClient.invalidateQueries("mappings");
    },
  });

  const onSubmit: SubmitHandler<ProjectNameMappingOut> = async (data) => {
    console.log(data);
    if (data.name === "") {
      data.name = "";
    }
    if (data.upload_name === "") {
      data.upload_name = "";
    }
    // Ensure eureka_name is not changed
    data.eureka_name = projectMapping.eureka_name;
    mutation.mutate(data);
  };

  const onCancel = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: "sm", md: "md" }} isCentered>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader>编辑项目映射</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl mt={4}>
            <FormLabel htmlFor="name">报告展示名称</FormLabel>
            <Input id="name" {...register("name")} type="text" />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel htmlFor="eureka_name">采集名称</FormLabel>
            <Input
              id="eureka_name"
              value={projectMapping.eureka_name}
              readOnly
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel htmlFor="upload_name">上传名称</FormLabel>
            <Input id="upload_name" {...register("upload_name")} type="text" />
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
  );
};

export default EditProjectMapping;
