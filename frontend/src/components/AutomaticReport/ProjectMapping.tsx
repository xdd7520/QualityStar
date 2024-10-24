import React, {useState} from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  Input,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from "@chakra-ui/react";
import useCustomToast from "../../hooks/useCustomToast";
import {useQuery} from "react-query";
import {ApiError, ProjectsService} from "../../client";
import ActionsMenu from "../Common/ActionsMenu";


const ProjectMapping: React.FC = () => {
  const showToast = useCustomToast()
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  // const [pageSize, setPageSize] = useState(10)
  const [totalItems, setTotalItems] = useState(0)

  const {
    data: mappings,
    isLoading,
    isError,
    error,
  } = useQuery(["mappings", page, pageSize], async () => {
    const response = await ProjectsService.readProjectMappings({page: page, size: pageSize})
    // @ts-ignore
    setTotalItems(response.total) // 假设API返回的结构中包含 total 属性
    return response
  })

  if (isError) {
    const errDetail = (error as ApiError).body
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
        mappings && (
          <Container maxW="full">
            {/*<Navbar type={"角色"}/>*/}
            <TableContainer>
              <Table fontSize="md" size={{base: "mx", md: "md"}}>
                <Thead>
                  <Tr>
                    <Th>报告展示名称</Th>
                    <Th>采集名称</Th>
                    <Th>上传名称</Th>
                    <Th>操作</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {mappings.items.map((data) => (
                    <Tr key={data.id}>
                      <Td color={!data.name ? "gray.400" : "inherit"}>
                        {data.name || "N/A"}
                      </Td>
                      <Td>{data.eureka_name}</Td>
                      <Td color={!data.upload_name ? "gray.400" : "inherit"}>
                        {data.upload_name || "N/A"}</Td>
                      <Td>
                        <ActionsMenu
                          type="映射名称"
                          value={data}
                          // canDelete={false}
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              <Flex justify="space-between" align="center" mt={4}>
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
                  Page {page} of {totalPages} count: {totalItems}
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

export default ProjectMapping
