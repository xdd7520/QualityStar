import {
  Box,
  Container,
  Flex,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Button,
  Input,
} from "@chakra-ui/react"
import {createFileRoute} from "@tanstack/react-router"
import {useQuery, useQueryClient} from "react-query"
import {useState} from "react"

import {type ApiError, RoleService, type UserPublic} from "../../client"
import Navbar from "../../components/Common/Navbar"
import useCustomToast from "../../hooks/useCustomToast"
import ActionsMenu from "../Common/ActionsMenu.tsx"

export const Route = createFileRoute("/_layout/admin")({
  component: Role,
})

function Role() {
  const showToast = useCustomToast()
  const queryClient = useQueryClient()
  const currentUser = queryClient.getQueryData<UserPublic>("currentUser")
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  // const [pageSize, setPageSize] = useState(10)
  const [totalItems, setTotalItems] = useState(0)

  const {
    data: roles,
    isLoading,
    isError,
    error,
  } = useQuery(["roles", page, pageSize], async () => {
    const response = await RoleService.readRoles({page: page, size: pageSize})
    // @ts-ignore
    setTotalItems(response.total) // 假设API返回的结构中包含 total 属性
    return response
  })

  if (isError) {
    const errDetail = (error as ApiError).body?.detail
    showToast("Something went wrong.", `${errDetail}`, "error")
  }

  // const handlePreviousPage = () => {
  //   setPage((prevPage) => Math.max(prevPage - 1, 1))
  // }
  //
  // const handleNextPage = () => {
  //   setPage((prevPage) => prevPage + 1)
  // }
  //
  // const handlePageSizeChange = (event) => {
  //   setPageSize(Number(event.target.value))
  //   setPage(1) // 当页大小变化时，重置页码为第一页
  // }

  const handlePageInputChange = (event: { target: { value: any } }) => {
    const pageNumber = Number(event.target.value)
    if (pageNumber >= 1 && pageNumber <= Math.ceil(totalItems / pageSize)) {
      setPage(pageNumber)
    }
  }

  const totalPages = Math.ceil(totalItems / pageSize)
  const pages = Array.from({length: totalPages}, (_, i) => i + 1)

  return (
    <>
      {isLoading ? (
        <Flex justify="center" align="center" height="100vh" width="full">
          <Spinner size="xl" color="ui.main"/>
        </Flex>
      ) : (
        roles && (
          <Container maxW="full">
            <Navbar type={"角色"}/>
            <TableContainer>
              <Table fontSize="md" size={{base: "mx", md: "md"}}>
                <Thead>
                  <Tr>
                    <Th>角色名称</Th>
                    <Th>角色编码</Th>
                    <Th>状态</Th>
                    <Th>操作</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {roles.items.map((role) => (
                    <Tr key={role.id}>
                      <Td color={!role.name ? "gray.400" : "inherit"}>
                        {role.name || "N/A"}
                      </Td>
                      <Td>{role.code}</Td>
                      <Td>
                        <Flex gap={2}>
                          <Box
                            w="2"
                            h="2"
                            borderRadius="50%"
                            bg={role.status ? "ui.success" : "ui.danger"}
                            alignSelf="center"
                          />
                        </Flex>
                      </Td>
                      <Td>
                        <ActionsMenu
                          type="角色"
                          value={role}
                          disabled={!currentUser?.is_superuser}
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              <Flex justify="space-between" align="center" mt={4}>
                {/*<Box>共 {totalItems} 条</Box>*/}
                {/*<Select value={pageSize} onChange={handlePageSizeChange} width="auto">*/}
                {/*  <option value={10}>10条/页</option>*/}
                {/*  <option value={20}>20条/页</option>*/}
                {/*  <option value={50}>50条/页</option>*/}
                {/*</Select>*/}
                <Flex>
                  {pages.map((pageNum) => (
                    <Button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      isActive={page === pageNum}
                      mx={1}
                    >
                      {pageNum}
                    </Button>
                  ))}
                </Flex>
                <Box>
                  Page {page} of {totalPages}  count: {totalItems}
                </Box>
                <Flex align="center">
                  前往
                  <Input
                    type="number"
                    value={page}
                    onChange={handlePageInputChange}
                    width="50px"
                    ml={2}
                    mr={2}
                    min={1}
                    max={totalPages}
                  />
                  页
                </Flex>
              </Flex>
            </TableContainer>
          </Container>
        )
      )}
    </>
  )
}

export default Role
