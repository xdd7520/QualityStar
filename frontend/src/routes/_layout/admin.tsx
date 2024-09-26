import {
  Container,
  Heading, Tab, TabList, TabPanel, TabPanels, Tabs,

} from "@chakra-ui/react"
import { createFileRoute } from "@tanstack/react-router"
import { z } from "zod"

import UserManager from "../../components/Admin/UserManager.tsx";
import { useQueryClient } from "@tanstack/react-query"
import {UserPublic} from "../../client";
import RoleManager from "../../components/Admin/RoleManager.tsx";

const tabsConfig = [
  {title: "用户管理", component: UserManager},
  {title: "角色管理", component: RoleManager},

]

const usersSearchSchema = z.object({
  page: z.number().catch(1),
})

export const Route = createFileRoute("/_layout/admin")({
  component: Admin,
  validateSearch: (search) => usersSearchSchema.parse(search),
})



function Admin() {
  const queryClient = useQueryClient()
  const currentUser = queryClient.getQueryData<UserPublic>(["currentUser"])
  const finalTabs = currentUser?.is_superuser
    ? tabsConfig.slice(0, 3)
    : tabsConfig

  return (
    <Container maxW="full">
      <Heading size="lg" textAlign={{base: "center", md: "left"}} py={12}>
        用户设置
      </Heading>
      <Tabs variant="enclosed">
        <TabList>
          {finalTabs.map((tab, index) => (
            <Tab key={index}>{tab.title}</Tab>
          ))}
        </TabList>
        <TabPanels>
          {finalTabs.map((tab, index) => (
            <TabPanel key={index}>
              <tab.component/>
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Container>
  )
}
