import {
  Button,
  Flex,
  SkeletonText,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useEffect } from "react"
import { z } from "zod"

import {RolesService, type UserPublic} from "../../client"
import ActionsMenu from "../Common/ActionsMenu"
import Navbar from "../Common/Navbar"
import AddRole from "./AddRole"

const rolesSearchSchema = z.object({
  page: z.number().catch(1),
})

export const Route = createFileRoute("/_layout/admin")({
  component: RoleManager,
  validateSearch: (search) => rolesSearchSchema.parse(search),
})

const PER_PAGE = 20

function getRolesQueryOptions({ page }: { page: number }) {
  return {
    queryFn: () =>
      RolesService.readRoles({ page: page , size: PER_PAGE }),
    queryKey: ["roles", { page }],
  }
}

function RoleManager() {
  const queryClient = useQueryClient()
  const currentUser = queryClient.getQueryData<UserPublic>(["currentUser"])
  console.log(currentUser)
  const { page } = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const setPage = (page: number) =>
    navigate({ search: (prev) => ({ ...prev, page }) })

  const {
    data: roles,
    isPending,
    isPlaceholderData,
  } = useQuery({
    ...getRolesQueryOptions({ page }),
    placeholderData: (prevData) => prevData,
  })

  const hasNextPage = !isPlaceholderData && roles?.data.length === PER_PAGE
  const hasPreviousPage = page > 1

  useEffect(() => {
    if (hasNextPage) {
      queryClient.prefetchQuery(getRolesQueryOptions({ page: page + 1 }))
    }
  }, [page, queryClient, hasNextPage])

  return (
    <>
      <Navbar type="添加角色" addModalAs={AddRole} />
      <TableContainer>
        <Table size={{ base: "sm", md: "md" }}>
          <Thead>
            <Tr>
              <Th width="30%">角色名称</Th>
              <Th width="50%">描述</Th>
              <Th width="20%">操作</Th>
            </Tr>
          </Thead>
          {isPending ? (
            <Tbody>
              <Tr>
                {new Array(4).fill(null).map((_, index) => (
                  <Td key={index}>
                    <SkeletonText noOfLines={1} paddingBlock="16px" />
                  </Td>
                ))}
              </Tr>
            </Tbody>
          ) : (
            <Tbody>
              {roles?.data.map((role) => (
                <Tr key={role.id}>
                  <Td isTruncated maxWidth="150px">
                    {role.name}
                  </Td>
                  <Td isTruncated maxWidth="150px">
                    {role.description}
                  </Td>

                  <Td>
                    <ActionsMenu
                      type="Role"
                      value={role}
                      disabled={!currentUser?.is_superuser}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          )}
        </Table>
      </TableContainer>
      <Flex
        gap={4}
        alignItems="center"
        mt={4}
        direction="row"
        justifyContent="flex-end"
      >
        <Button onClick={() => setPage(page - 1)} isDisabled={!hasPreviousPage}>
          上一页
        </Button>
        <span>第 {page} 页</span>
        <Button isDisabled={!hasNextPage} onClick={() => setPage(page + 1)}>
          下一页
        </Button>
      </Flex>
    </>
  )
}

export default RoleManager
