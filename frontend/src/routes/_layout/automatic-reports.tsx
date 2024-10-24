import {
  Container,
  Heading,
  Tab,
  TabList, TabPanel, TabPanels, Tabs,
} from "@chakra-ui/react"
import { createFileRoute } from "@tanstack/react-router"
import { useQueryClient } from "@tanstack/react-query"

import ProjectReport from "../../components/AutomaticReport/ProjectReport";
import UploadReport from "../../components/AutomaticReport/UploadReport";
import GatherReport from "../../components/AutomaticReport/GatherReport";
import type {UserPublic} from "../../client";


const tabsConfig = [
  { title: "项目报告", component: ProjectReport },
  { title: "上报信息", component: UploadReport },
  { title: "采集信息", component: GatherReport },
  // { title: "项目名称映射", component: ProjectMapping },
]
export const Route = createFileRoute('/_layout/automatic-reports')({
  component: Reports,
})

function Reports()  {
  const queryClient = useQueryClient()
  const currentUser = queryClient.getQueryData<UserPublic>(["currentUser"])
  const finalTabs = currentUser?.is_superuser
    ? tabsConfig.slice(0, tabsConfig.length)
    : tabsConfig

  return (
    <Container maxW="full">
      <Heading size="lg" textAlign={{ base: "center", md: "left" }} py={12}>
        接口自动化综合报告
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
              <tab.component />
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Container>
  )
}

export default Reports
