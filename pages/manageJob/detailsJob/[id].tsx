/* eslint-disable react-hooks/rules-of-hooks */
import { LayoutMain } from "@/components/layout";
import withAuth from "@/hocs/withAuth";
import { selectAuth } from "@/redux/reducers/authReducers";
import {
  getInfoCompanyAsync,
  selectCompany,
} from "@/redux/reducers/companyReducers";
import { getJobsByCompanyAsync, selectJob } from "@/redux/reducers/jobReducers";
import { useAppDispatch } from "@/redux/store";
import { User } from "@/types/User";
import {
  Button,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Tab,
  Table,
  TableCaption,
  TableContainer,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import dateFormat from "dateformat";
import { DeleteIcon, EditIcon, ViewIcon } from "@chakra-ui/icons";
import { deleteJob } from "@/redux/apis/jobApi";

const manageJob = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const auth = useSelector(selectAuth);
  const job = useSelector(selectJob);
  const company = useSelector(selectCompany);

  const [userAuth, setUserAuth] = useState<User>();
  const [idDelete, setIdDelete] = useState<string>("");
  const [loadingDelete, setLoadingDelete] = useState(false);

  let userLocal: string | null = "";
  if (typeof window !== "undefined") {
    userLocal = localStorage.getItem("user");
  }

  useEffect(() => {
    if (!userLocal) return;
    setUserAuth(JSON.parse(userLocal));
  }, [userLocal]);

  useEffect(() => {
    if (auth && auth?.role !== "company") {
      router.push("/");
      return;
    }
  }, [auth, router]);

  useEffect(() => {
    if (userAuth?._id) dispatch(getInfoCompanyAsync(userAuth._id));
  }, [userAuth?._id, dispatch]);

  useEffect(() => {
    if (company.infoCompany?.idCompany)
      dispatch(getJobsByCompanyAsync(company.infoCompany.idCompany));
  }, [company.infoCompany.idCompany, dispatch]);

  console.log(job?.listJobCompany);

  const handleDeleteJob = async (id: string) => {
    setLoadingDelete(true);
    try {
      await deleteJob(id);

      onClose();
      dispatch(getJobsByCompanyAsync(company.infoCompany.idCompany));
      setLoadingDelete(false);
      setIdDelete("");
    } catch (err) {
      setLoadingDelete(true);
      console.log(err);
    }
  };

  return (
    <LayoutMain>
      <section className="w-full bg-[url('/assets/images/page-title.png')] bg-cover bg-[#029663] bg-center border-radius-custom relative pt-14 pb-16">
        <div className="md:max-w-[1140px] mx-auto flex items-center justify-between text-white">
          <div className="mx-auto pr-20">
            <h3 className="text-2xl font-medium">Manage Job</h3>
          </div>
        </div>
      </section>
      <section className="w-full min-h-[100vh] bg-white py-10">
        <div className="md:max-w-[1164px] mx-auto shadow-md p-6">
          <div className="flex items-center justify-end">
            <Button
              colorScheme={"green"}
              mt={4}
              float={"right"}
              onClick={() => {
                router.push("/jobPost");
              }}
            >
              Create a job
            </Button>
          </div>
          <div className="mt-4">
            <Tabs variant="enclosed">
              <TabList>
                <Tab>Job available</Tab>
                <Tab>Expired Job</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <TableContainer>
                    <Table variant="striped" colorScheme="green">
                      <Thead>
                        <Tr>
                          <Th>Job title</Th>
                          <Th>Industry</Th>
                          <Th>Level</Th>
                          <Th>Create date</Th>
                          <Th>Expiring date</Th>
                          <Th sx={{ textAlign: "center" }}>Action</Th>
                        </Tr>
                      </Thead>
                      {job?.isLoading ? (
                        <div className="flex items-center justify-center">
                          <Spinner
                            thickness="4px"
                            speed="0.65s"
                            emptyColor="gray.200"
                            color="green"
                            size="xl"
                          />
                        </div>
                      ) : (
                        <Tbody>
                          {job?.listJobCompany
                            ?.filter((ele: any) => {
                              const date = new Date();
                              const eleDate = new Date(ele?.expiring_date);
                              return eleDate > date;
                            })
                            ?.map((item: any) => (
                              <Tr key={item._id}>
                                <Td>{item?.job_title}</Td>
                                <Td>{item?.industry?.title}</Td>
                                <Td>{item?.level}</Td>
                                <Td>
                                  {dateFormat(item?.updatedAt, "dd/mm/yyyy")}
                                </Td>
                                <Td>
                                  {dateFormat(
                                    item?.expiring_date,
                                    "dd/mm/yyyy"
                                  )}
                                </Td>
                                <Td>
                                  <IconButton
                                    aria-label="Edit"
                                    icon={<EditIcon />}
                                    variant="ghost"
                                    onClick={() => {
                                      router.push(`/jobPost/${item._id}`);
                                    }}
                                  />
                                  <IconButton
                                    aria-label="Delete"
                                    icon={<DeleteIcon />}
                                    variant="ghost"
                                    onClick={() => {
                                      setIdDelete(item._id);
                                      onOpen();
                                    }}
                                  />
                                  <IconButton
                                    aria-label="View job"
                                    icon={<ViewIcon />}
                                    variant="ghost"
                                    onClick={() => {
                                      setIdDelete(item._id);
                                      onOpen();
                                    }}
                                  />
                                </Td>
                              </Tr>
                            ))}
                        </Tbody>
                      )}
                    </Table>
                  </TableContainer>
                </TabPanel>
                <TabPanel>
                  <TableContainer>
                    <Table variant="striped" colorScheme="green">
                      <Thead>
                        <Tr>
                          <Th>Job title</Th>
                          <Th>Industry</Th>
                          <Th>Level</Th>
                          <Th>Create date</Th>
                          <Th>Expiring date</Th>
                          <Th>Action</Th>
                        </Tr>
                      </Thead>
                      {job?.isLoading ? (
                        <div className="flex items-center justify-center">
                          <Spinner
                            thickness="4px"
                            speed="0.65s"
                            emptyColor="gray.200"
                            color="green"
                            size="xl"
                          />
                        </div>
                      ) : (
                        <Tbody>
                          {job?.listJobCompany
                            ?.filter((ele: any) => {
                              const date = new Date();
                              const eleDate = new Date(ele?.expiring_date);
                              return eleDate < date;
                            })
                            ?.map((item: any) => (
                              <Tr key={item._id}>
                                <Td>{item?.job_title}</Td>
                                <Td>{item?.industry?.title}</Td>
                                <Td>{item?.level}</Td>
                                <Td>
                                  {dateFormat(item?.updatedAt, "dd/mm/yyyy")}
                                </Td>
                                <Td>
                                  {dateFormat(
                                    item?.expiring_date,
                                    "dd/mm/yyyy"
                                  )}
                                </Td>
                                <Td>
                                  <IconButton
                                    aria-label="Edit"
                                    icon={<EditIcon />}
                                    variant="ghost"
                                    onClick={() => {
                                      router.push(`/jobPost/${item._id}`);
                                    }}
                                  />
                                  <IconButton
                                    aria-label="Delete"
                                    icon={<DeleteIcon />}
                                    variant="ghost"
                                    onClick={() => {
                                      setIdDelete(item._id);
                                      onOpen();
                                    }}
                                  />
                                  <IconButton
                                    aria-label="View job"
                                    icon={<ViewIcon />}
                                    variant="ghost"
                                    onClick={() => {
                                      setIdDelete(item._id);
                                      onOpen();
                                    }}
                                  />
                                </Td>
                              </Tr>
                            ))}
                        </Tbody>
                      )}
                    </Table>
                  </TableContainer>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </div>
        </div>
      </section>
    </LayoutMain>
  );
};

export default withAuth(manageJob);
