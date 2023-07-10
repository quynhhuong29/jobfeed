/* eslint-disable react-hooks/rules-of-hooks */
import { LayoutMain } from "@/components/layout";
import withAuth from "@/hocs/withAuth";
import { selectAuth } from "@/redux/reducers/authReducers";
import {
  getInfoCompanyAsync,
  selectCompany,
} from "@/redux/reducers/companyReducers";
import { getInfoJobAsync, selectJob } from "@/redux/reducers/jobReducers";
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
  Select,
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
import { formatMoney } from "@/utils/number.util";
import {
  getListCVByJobAsync,
  selectResumes,
} from "@/redux/reducers/resumeReducers";
import Link from "next/link";
import { STATUS } from "@/constants/CV";
import { updateStatusCV } from "@/redux/apis/submitCvAPI";
import { toast } from "react-toastify";
import { createNotify } from "@/redux/apis/notifyAPI";
import { selectSocket } from "@/redux/reducers/socketReducers";

const manageJob = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { id } = router?.query;
  const { isOpen, onClose, onOpen } = useDisclosure();

  const auth = useSelector(selectAuth);
  const job = useSelector(selectJob);
  const resumes = useSelector(selectResumes);
  const socket = useSelector(selectSocket);

  const [userAuth, setUserAuth] = useState<User>();
  const [cvUpload, setCvUpload] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);

  let userLocal: string | null = "";
  if (typeof window !== "undefined") {
    userLocal = localStorage.getItem("user");
  }

  const handleUpdateStatus = async () => {
    if (!cvUpload || !id) return;

    setIsLoading(true);
    try {
      await updateStatusCV({
        ...cvUpload,
        idJob: id!.toString(),
      });

      // // Notify
      const msg = {
        id: id,
        text: "updated status for your CV",
        recipients: cvUpload?.idCandidate,
        url: `/appliedJobs`,
        content: cvUpload?.status,
      };

      const res = await createNotify(msg);
      socket?.emit("createNotify", {
        ...res.notify,
        user: {
          username: auth.data.user.username,
          avatar: auth.data.user.avatar,
          fullName:
            auth.role !== "company"
              ? auth.data.user.firstName + " " + auth.data.user.lastName
              : auth.data.user.lastName,
        },
      });
      onClose();
      toast.success("Update status successfully");
      await dispatch(getListCVByJobAsync(id!.toString()));
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      toast.error(error?.response?.data?.msg || "Error");
    }
  };

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
    if (!id) return;
    dispatch(getInfoJobAsync(id!.toString()));
    dispatch(getListCVByJobAsync(id!.toString()));
  }, [id, dispatch]);

  return (
    <LayoutMain>
      <section className="w-full bg-[url('/assets/images/page-title.png')] bg-cover bg-[#029663] bg-center border-radius-custom relative pt-14 pb-16">
        <div className="md:max-w-[1140px] mx-auto flex items-center justify-between text-white">
          <div className="mx-auto pr-20">
            <h3 className="text-2xl font-medium">List CV</h3>
          </div>
        </div>
      </section>
      <section className="w-full min-h-[100vh] bg-white py-10">
        <div className="md:max-w-[1164px] mx-auto shadow-md p-6">
          <div className="border border-gray-300 rounded-lg shadow-lg p-6">
            <h1 className="mb-4 text-3xl text-gray-700 font-semibold leading-tight">
              {job?.infoJob?.job_title}
            </h1>
            <div className="grid grid-cols-3 gap-2">
              <div className="flex items-center gap-2">
                <p className="font-medium text-gray-800">Date of expiring:</p>
                <p className="text-gray-800">
                  {dateFormat(job?.infoJob?.expiring_date, "dd/mm/yyyy")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <p className="font-medium text-gray-800">Date of creation:</p>
                <p className="text-gray-800">
                  {dateFormat(job?.infoJob?.updatedAt, "dd/mm/yyyy")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <p className="font-medium text-gray-800">Level:</p>
                <p className="text-gray-800">{job?.infoJob?.level}</p>
              </div>
              <div className="flex items-center gap-2">
                <p className="font-medium text-gray-800">Job category:</p>
                <p className="text-gray-800">{job?.infoJob?.industry?.title}</p>
              </div>
              <div className="flex items-center gap-2">
                <p className="font-medium text-gray-800">Employment type:</p>
                <p className="text-gray-800">{job?.infoJob?.employment_type}</p>
              </div>
              <div className="flex items-center gap-2">
                <p className="font-medium text-gray-800">Salary:</p>
                <p className="text-gray-800">
                  {formatMoney(
                    Number(job?.infoJob?.salary?.min),
                    job?.infoJob?.salary?.money_type
                  )}{" "}
                  -{" "}
                  {formatMoney(
                    Number(job?.infoJob?.salary?.max),
                    job?.infoJob?.salary?.money_type
                  )}
                </p>
              </div>
            </div>
            <div className="mt-10">
              <TableContainer>
                <Table variant="striped" colorScheme="green">
                  <Thead>
                    <Tr>
                      <Th>Name</Th>
                      <Th>Email</Th>
                      <Th>Status</Th>
                      <Th sx={{ textAlign: "center" }}>CV</Th>
                      <Th sx={{ textAlign: "center" }}>Document</Th>
                      <Th sx={{ textAlign: "center" }}>Action</Th>
                    </Tr>
                  </Thead>
                  {resumes?.isLoading ? (
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
                      {Array.isArray(resumes?.listCVOfJob) &&
                        resumes?.listCVOfJob?.map((item: any, index) => (
                          <Tr key={index}>
                            <Td>
                              {item?.name
                                ? item?.name
                                : `${item?.dataCV?.firstName} ${item?.dataCV?.lastName}`}
                            </Td>
                            <Td>
                              {item?.email
                                ? item?.email
                                : `${item?.dataCV?.email}`}
                            </Td>
                            <Td>{item?.status}</Td>
                            <Td sx={{ textAlign: "center" }}>
                              {item?.resumeFile ? (
                                <Link href={item?.resumeFile} target="_blank">
                                  <IconButton
                                    aria-label="View CV"
                                    icon={<ViewIcon />}
                                    variant="ghost"
                                    onClick={() => {}}
                                  />
                                </Link>
                              ) : (
                                <IconButton
                                  aria-label="View CV"
                                  icon={<ViewIcon />}
                                  variant="ghost"
                                  onClick={() => {
                                    window.open(
                                      `/viewCV?state=${encodeURIComponent(
                                        JSON.stringify(item?.dataCV)
                                      )}`,
                                      "_blank"
                                    );
                                  }}
                                />
                              )}
                            </Td>
                            <Td sx={{ textAlign: "center" }}>
                              {item?.documentFile && (
                                <Link href={item?.documentFile} target="_blank">
                                  <IconButton
                                    aria-label="View CV"
                                    icon={<ViewIcon />}
                                    variant="ghost"
                                    onClick={() => {}}
                                  />
                                </Link>
                              )}
                            </Td>
                            <Td sx={{ textAlign: "center" }}>
                              <IconButton
                                aria-label="Edit"
                                icon={<EditIcon />}
                                variant="ghost"
                                onClick={() => {
                                  setCvUpload(item);
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

              <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Update status CV?</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <label>Status: </label>
                    {cvUpload && (
                      <Select
                        value={cvUpload?.status}
                        onChange={(event) => {
                          setCvUpload({
                            ...cvUpload,
                            status: event.target.value,
                          });
                        }}
                      >
                        {STATUS.map((item) => (
                          <option value={item} key={item}>
                            {item}
                          </option>
                        ))}
                      </Select>
                    )}
                  </ModalBody>

                  <ModalFooter sx={{ gap: "4px" }}>
                    <Button variant="ghost" onClick={onClose}>
                      No
                    </Button>
                    <Button
                      colorScheme="green"
                      mr={3}
                      onClick={handleUpdateStatus}
                      isLoading={isLoading}
                    >
                      Update
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </div>
          </div>
        </div>
      </section>
    </LayoutMain>
  );
};

export default withAuth(manageJob);
