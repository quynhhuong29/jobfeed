/* eslint-disable react-hooks/rules-of-hooks */
import FormEducation, {
  FormEducationValues,
} from "@/components/CVBuilder/FormEducation";
import FormExperience, {
  FormExperienceValues,
} from "@/components/CVBuilder/FormExperience";
import FormLanguage, {
  FormLanguageValues,
} from "@/components/CVBuilder/FormLanguage";
import FormSkill, { FormSkillValues } from "@/components/CVBuilder/FormSkill";
import FooterAlt from "@/components/FooterAlt";
import { FacebookIcon, LinkedInIcon, TwitterIcon } from "@/components/icons";
import { LayoutMain } from "@/components/layout";
import withAuth from "@/hocs/withAuth";
import { selectAuth } from "@/redux/reducers/authReducers";
import { checkImage, imageUpload } from "@/utils/upload.util";
import {
  AddIcon,
  ChevronRightIcon,
  EditIcon,
  MinusIcon,
} from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Button,
  Input,
  Textarea,
  WrapItem,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { cloneDeep } from "lodash";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { getCVInfo, updateResume } from "@/redux/apis/resumeAPI";
import { isUrl } from "@/utils/string.util";

type FormValues = {
  profileTitle: string;
  firstName: string;
  lastName: string;
  phone: string;
  DOB: string;
  country: string;
  languages: any;
  email: string;
  city: string;
  address: string;
  overview: string;
  workExperience: any;
  skill: any;
  education: any;
  hobbies: string;
  linkIn: string;
};

function updateCV() {
  const router = useRouter();
  const auth = useSelector(selectAuth);

  const [avatar, setAvatar] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);

  const [formExperience, setFormExperience] = useState<FormExperienceValues[]>([
    {
      id: "0",
      position: "",
      company: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  ]);
  const [formEducation, setFormEducation] = useState<FormEducationValues[]>([
    {
      id: "0",
      description: "",
      endDate: "",
      major: "",
      school: "",
      startDate: "",
    },
  ]);
  const [formSkill, setFormSkill] = useState<FormSkillValues[]>([
    {
      id: "0",
      description: "",
      skill: "",
    },
  ]);
  const [formLanguage, setFormLanguage] = useState<FormLanguageValues[]>([
    {
      id: "0",
      description: "",
      language: "",
      level: "",
    },
  ]);
  const [experienceList, setExperienceList] = useState<any[]>([
    {
      id: 0,
    },
  ]);
  const [educationList, setEducationList] = useState<any[]>([
    {
      id: 0,
    },
  ]);
  const [languagesList, setLanguagesList] = useState<any[]>([
    {
      id: 0,
    },
  ]);
  const [skillsList, setSkillsList] = useState<any[]>([
    {
      id: 0,
    },
  ]);

  const { handleSubmit, register, setValue } = useForm<FormValues>({
    defaultValues: {
      profileTitle: "",
      firstName: "",
      lastName: "",
      phone: "",
      DOB: "",
      country: "",
      email: "",
      city: "",
      address: "",
      overview: "",
      hobbies: "",
      linkIn: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (auth && auth?.role !== "candidate") {
      router.push("/");
    }
  }, [auth, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!router.query.id) return;

        const res = await getCVInfo(router.query.id.toString());
        return res;
      } catch (err) {
        console.log(err);
      }
    };

    const fetchDataAndSetValues = async () => {
      const data = await fetchData();
      if (data) {
        console.log(data?.avatar);
        setAvatar(data?.avatar);
        setValue("profileTitle", data?.title);
        setValue("firstName", data?.firstName);
        setValue("lastName", data?.lastName);
        setValue("phone", data?.phone);
        setValue("DOB", data?.DOB);
        setValue("country", data?.country);
        setValue("email", data?.email);
        setValue("city", data?.city);
        setValue("address", data?.address);
        setValue("hobbies", data?.hobbies);
        setValue("linkIn", data?.linkIn);
        setValue("overview", data?.overview);

        setFormExperience(data?.workExperience);
        setFormEducation(data?.education);
        setFormSkill(data?.skill);
        setFormLanguage(data?.language);
      }
    };

    fetchDataAndSetValues();
  }, [router.query.id, setValue]);

  const handleChangeAvatar = (e: any) => {
    const file = e.target.files[0];

    const err = checkImage(file);
    if (err) {
      toast.error(err);
      return;
    }
    setAvatar(file);
  };

  const handleAddExperience = () => {
    setFormExperience((prevList: any) => [
      ...prevList,
      { id: formExperience.length },
    ]);
  };

  const handleRemoveExperience = (id: string) => {
    setExperienceList((prevList) =>
      prevList.filter((item: any) => item.id !== id)
    );
    setFormExperience((prevList) =>
      prevList.filter((item: FormExperienceValues) => item.id !== id)
    );
  };

  const handleAddEducation = () => {
    setEducationList((prevList: any) => [
      ...prevList,
      { id: educationList.length },
    ]);
  };

  const handleRemoveEducation = (id: string) => {
    setEducationList((prevList) =>
      prevList.filter((item: any) => item.id !== id)
    );
    setFormEducation((prevList) =>
      prevList.filter((item: FormEducationValues) => item.id !== id)
    );
  };

  const handleAddLanguage = () => {
    setLanguagesList((prevList: any) => [
      ...prevList,
      { id: languagesList.length },
    ]);
  };

  const handleRemoveLanguage = (id: string) => {
    setLanguagesList((prevList) =>
      prevList.filter((item: any) => item.id !== id)
    );
    setFormLanguage((prevList) =>
      prevList.filter((item: FormLanguageValues) => item.id !== id)
    );
  };

  const handleAddSkill = () => {
    setSkillsList((prevList: any) => [...prevList, { id: skillsList.length }]);
  };

  const handleRemoveSkill = (id: string) => {
    setSkillsList((prevList) => prevList.filter((item: any) => item.id !== id));
    setFormSkill((prevList) =>
      prevList.filter((item: FormSkillValues) => item.id !== id)
    );
  };

  const handleForm = (
    form:
      | FormEducationValues
      | FormExperienceValues
      | FormSkillValues
      | FormLanguageValues,
    type: "education" | "experience" | "skill" | "language"
  ): void => {
    let cloneForm: any;

    if (type === "education") {
      cloneForm = cloneDeep<FormEducationValues[]>(formEducation);
    } else if (type === "experience") {
      cloneForm = cloneDeep<FormExperienceValues[]>(formExperience);
    } else if (type === "skill") {
      cloneForm = cloneDeep<FormSkillValues[]>(formSkill);
    } else {
      cloneForm = cloneDeep<FormLanguageValues[]>(formLanguage);
    }

    const existIndex = cloneForm.findIndex(
      (
        ele:
          | FormExperienceValues
          | FormEducationValues
          | FormSkillValues
          | FormLanguageValues
      ) => ele.id === form.id
    );

    if (existIndex > -1) {
      cloneForm[existIndex] = form;
    } else {
      cloneForm = [...cloneForm, form];
    }

    if (type === "education") {
      setFormEducation(cloneForm as FormEducationValues[]);
    } else if (type === "experience") {
      setFormExperience(cloneForm as FormExperienceValues[]);
    } else if (type === "skill") {
      setFormSkill(cloneForm as FormSkillValues[]);
    } else {
      setFormLanguage(cloneForm as FormLanguageValues[]);
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);

    let dataRequest;
    let img: any = [];
    if (avatar) {
      img = await imageUpload([avatar]);
    }

    if (data) {
      dataRequest = {
        id: router.query.id?.toString(),
        title: data.profileTitle || "",
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        email: data.email || "",
        overview: data.overview || "",
        address: data.address || "",
        avatar: img[0]?.url || "",
        phone: data.phone || "",
        DOB: data.DOB || "",
        country: data.country || "",
        language: formLanguage,
        city: data.city || "",
        workExperience: formExperience,
        skill: formSkill,
        education: formEducation,
        hobbies: data.hobbies || "",
        linkedin: data.linkIn || "",
        tags: [],
      };
    }

    try {
      const res = await updateResume(dataRequest);
      setIsLoading(false);
      if (res?.status === 200) {
        toast.success("Update CV Successful");
      }
    } catch (err: any) {
      setIsLoading(false);
      if (err.response?.data) toast.error(err.response?.data?.message);
      else toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <LayoutMain>
      <section className="w-full bg-[url('/assets/images/page-title.png')] bg-cover bg-[#029663] bg-center border-radius-custom relative pt-14 pb-16">
        <div className="md:max-w-[1140px] mx-auto flex items-center justify-between text-white">
          <div className="mx-auto pr-20">
            <h3 className="text-2xl font-medium">CV Builder Information</h3>
          </div>
        </div>
      </section>
      <section className="w-full min-h-[100vh] bg-white py-20">
        <div className="md:max-w-[1164px] mx-auto">
          <div className="flex flex-col gap-4">
            <Accordion allowMultiple defaultIndex={[0, 1]}>
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <div className="text-left flex-1 text-xl font-medium text-gray-800">
                      Profile Title
                    </div>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <Input
                    type="text"
                    placeholder="Profile title"
                    autoComplete="off"
                    sx={{
                      backgroundColor: "#fff",
                      border: "1px solid #dbdfe2",
                      color: "#495057",
                      padding: "10px",
                      fontSize: "14px",
                      fontWeight: "500",
                      "&:focus-visible": {
                        outline: "0",
                        border: "1px solid #dbdfe2",
                        boxShadow: "none",
                      },
                    }}
                    {...register("profileTitle")}
                  />
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                {({ isExpanded }) => (
                  <>
                    <h2>
                      <AccordionButton>
                        <div className="text-left flex-1 text-xl font-medium text-gray-800">
                          Personal Details
                        </div>
                        {isExpanded ? (
                          <MinusIcon fontSize="12px" />
                        ) : (
                          <AddIcon fontSize="12px" />
                        )}
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      <div className="flex gap-10 w-full">
                        <div className="flex flex-col">
                          <p className="text-gray-700">Photo</p>
                          <div className="relative">
                            <div className="border border-gray-300 bg-white rounded-full p-1">
                              <WrapItem>
                                <Avatar
                                  size="2xl"
                                  src={
                                    avatar
                                      ? isUrl(avatar)
                                        ? avatar
                                        : URL.createObjectURL(avatar)
                                      : "/assets/images/img/png"
                                  }
                                />
                              </WrapItem>
                            </div>
                            <div className="absolute cursor-pointer bg-white rounded-full right-1 z-10 bottom-4 flex items-center justify-center">
                              <Button
                                variant="unstyled"
                                size="sm"
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  cursor: "pointer",
                                }}
                              >
                                <EditIcon />
                                <Input
                                  type="file"
                                  height="100%"
                                  width="100%"
                                  position="absolute"
                                  top="0"
                                  left="0"
                                  opacity="0"
                                  aria-hidden="true"
                                  accept="image/*"
                                  cursor="pointer"
                                  onChange={handleChangeAvatar}
                                />
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div className="flex-1 w-full">
                          <div className="grid grid-cols-2 gap-x-6 gap-y-4 w-full">
                            <div className="flex flex-col">
                              <label className="text-gray-700">
                                First Name
                              </label>
                              <Input
                                type="text"
                                placeholder="Profile title"
                                autoComplete="off"
                                sx={{
                                  backgroundColor: "#fff",
                                  border: "1px solid #dbdfe2",
                                  color: "#495057",
                                  padding: "10px",
                                  fontSize: "14px",
                                  fontWeight: "500",
                                  "&:focus-visible": {
                                    outline: "0",
                                    border: "1px solid #dbdfe2",
                                    boxShadow: "none",
                                  },
                                }}
                                {...register("firstName")}
                              />
                            </div>
                            <div className="flex flex-col">
                              <p className="text-gray-700">Last Name</p>
                              <Input
                                type="text"
                                placeholder="Profile title"
                                autoComplete="off"
                                sx={{
                                  backgroundColor: "#fff",
                                  border: "1px solid #dbdfe2",
                                  color: "#495057",
                                  padding: "10px",
                                  fontSize: "14px",
                                  fontWeight: "500",
                                  "&:focus-visible": {
                                    outline: "0",
                                    border: "1px solid #dbdfe2",
                                    boxShadow: "none",
                                  },
                                }}
                                {...register("lastName")}
                              />
                            </div>
                            <div className="flex flex-col">
                              <p className="text-gray-700">Email address</p>
                              <Input
                                type="email"
                                placeholder="Profile title"
                                autoComplete="off"
                                sx={{
                                  backgroundColor: "#fff",
                                  border: "1px solid #dbdfe2",
                                  color: "#495057",
                                  padding: "10px",
                                  fontSize: "14px",
                                  fontWeight: "500",
                                  "&:focus-visible": {
                                    outline: "0",
                                    border: "1px solid #dbdfe2",
                                    boxShadow: "none",
                                  },
                                }}
                                {...register("email")}
                              />
                            </div>
                            <div className="flex flex-col">
                              <p className="text-gray-700">Phone number</p>
                              <Input
                                type="number"
                                placeholder="Profile title"
                                autoComplete="off"
                                sx={{
                                  backgroundColor: "#fff",
                                  border: "1px solid #dbdfe2",
                                  color: "#495057",
                                  padding: "10px",
                                  fontSize: "14px",
                                  fontWeight: "500",
                                  "&:focus-visible": {
                                    outline: "0",
                                    border: "1px solid #dbdfe2",
                                    boxShadow: "none",
                                  },
                                }}
                                {...register("phone")}
                              />
                            </div>
                            <div className="flex flex-col">
                              <p className="text-gray-700">Country</p>
                              <Input
                                type="text"
                                autoComplete="off"
                                sx={{
                                  backgroundColor: "#fff",
                                  border: "1px solid #dbdfe2",
                                  color: "#495057",
                                  padding: "10px",
                                  fontSize: "14px",
                                  fontWeight: "500",
                                  "&:focus-visible": {
                                    outline: "0",
                                    border: "1px solid #dbdfe2",
                                    boxShadow: "none",
                                  },
                                }}
                                {...register("country")}
                              />
                            </div>
                            <div className="flex flex-col">
                              <p className="text-gray-700">City</p>
                              <Input
                                type="text"
                                autoComplete="off"
                                sx={{
                                  backgroundColor: "#fff",
                                  border: "1px solid #dbdfe2",
                                  color: "#495057",
                                  padding: "10px",
                                  fontSize: "14px",
                                  fontWeight: "500",
                                  "&:focus-visible": {
                                    outline: "0",
                                    border: "1px solid #dbdfe2",
                                    boxShadow: "none",
                                  },
                                }}
                                {...register("city")}
                              />
                            </div>
                            <div className="flex flex-col">
                              <p className="text-gray-700">Date of birth</p>
                              <Input
                                type="date"
                                placeholder="Profile title"
                                autoComplete="off"
                                sx={{
                                  backgroundColor: "#fff",
                                  border: "1px solid #dbdfe2",
                                  color: "#495057",
                                  padding: "10px",
                                  fontSize: "14px",
                                  fontWeight: "500",
                                  "&:focus-visible": {
                                    outline: "0",
                                    border: "1px solid #dbdfe2",
                                    boxShadow: "none",
                                  },
                                }}
                                {...register("DOB")}
                              />
                            </div>
                            <div className="flex flex-col">
                              <p className="text-gray-700">LinkIn</p>
                              <Input
                                type="url"
                                placeholder="Profile title"
                                autoComplete="off"
                                sx={{
                                  backgroundColor: "#fff",
                                  border: "1px solid #dbdfe2",
                                  color: "#495057",
                                  padding: "10px",
                                  fontSize: "14px",
                                  fontWeight: "500",
                                  "&:focus-visible": {
                                    outline: "0",
                                    border: "1px solid #dbdfe2",
                                    boxShadow: "none",
                                  },
                                }}
                                {...register("linkIn")}
                              />
                            </div>
                          </div>
                          <div className="flex flex-col mt-4">
                            <p className="text-gray-700">Address</p>
                            <Input
                              type="text"
                              autoComplete="off"
                              sx={{
                                backgroundColor: "#fff",
                                border: "1px solid #dbdfe2",
                                color: "#495057",
                                padding: "10px",
                                fontSize: "14px",
                                fontWeight: "500",
                                "&:focus-visible": {
                                  outline: "0",
                                  border: "1px solid #dbdfe2",
                                  boxShadow: "none",
                                },
                              }}
                              {...register("address")}
                            />
                          </div>
                        </div>
                      </div>
                    </AccordionPanel>
                  </>
                )}
              </AccordionItem>

              <AccordionItem>
                {({ isExpanded }) => (
                  <>
                    <h2>
                      <AccordionButton>
                        <div className="text-left flex-1 text-xl font-medium text-gray-800">
                          Overview
                        </div>
                        {isExpanded ? (
                          <MinusIcon fontSize="12px" />
                        ) : (
                          <AddIcon fontSize="12px" />
                        )}
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      <Textarea
                        placeholder="Say something..."
                        autoComplete="off"
                        sx={{
                          minHeight: "125px",
                          backgroundColor: "#fff",
                          border: "1px solid #dbdfe2",
                          color: "#495057",
                          padding: "10px",
                          fontSize: "14px",
                          fontWeight: "500",
                          "&:focus-visible": {
                            outline: "0",
                            border: "1px solid #dbdfe2",
                            boxShadow: "none",
                          },
                        }}
                        {...register("overview")}
                      />
                    </AccordionPanel>
                  </>
                )}
              </AccordionItem>

              <AccordionItem>
                {({ isExpanded }) => (
                  <>
                    <h2>
                      <AccordionButton>
                        <div className="text-left flex-1 text-xl font-medium text-gray-800">
                          Work Experience
                        </div>
                        {isExpanded ? (
                          <MinusIcon fontSize="12px" />
                        ) : (
                          <AddIcon fontSize="12px" />
                        )}
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      <div className="flex flex-col gap-3">
                        {formExperience.map((item) => (
                          <FormExperience
                            key={item.id}
                            id={item.id}
                            handleRemoveExperience={handleRemoveExperience}
                            handleForm={handleForm}
                            value={item}
                          />
                        ))}
                        <div className="flex justify-end">
                          <Button
                            rightIcon={<AddIcon />}
                            onClick={handleAddExperience}
                          >
                            Add field
                          </Button>
                        </div>
                      </div>
                    </AccordionPanel>
                  </>
                )}
              </AccordionItem>

              <AccordionItem>
                {({ isExpanded }) => (
                  <>
                    <h2>
                      <AccordionButton>
                        <div className="text-left flex-1 text-xl font-medium text-gray-800">
                          Education
                        </div>
                        {isExpanded ? (
                          <MinusIcon fontSize="12px" />
                        ) : (
                          <AddIcon fontSize="12px" />
                        )}
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      <div className="flex flex-col gap-3">
                        {formEducation.map((item) => (
                          <FormEducation
                            key={item.id}
                            id={item.id}
                            handleRemoveEducation={handleRemoveEducation}
                            handleForm={handleForm}
                            value={item}
                          />
                        ))}
                        <div className="flex justify-end">
                          <Button
                            rightIcon={<AddIcon />}
                            onClick={handleAddEducation}
                          >
                            Add field
                          </Button>
                        </div>
                      </div>
                    </AccordionPanel>
                  </>
                )}
              </AccordionItem>

              <AccordionItem>
                {({ isExpanded }) => (
                  <>
                    <h2>
                      <AccordionButton>
                        <div className="text-left flex-1 text-xl font-medium text-gray-800">
                          Languages
                        </div>
                        {isExpanded ? (
                          <MinusIcon fontSize="12px" />
                        ) : (
                          <AddIcon fontSize="12px" />
                        )}
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      <div className="flex flex-col gap-3">
                        {formLanguage.map((item) => (
                          <FormLanguage
                            key={item.id}
                            id={item.id}
                            handleRemoveLanguage={handleRemoveLanguage}
                            handleForm={handleForm}
                            value={item}
                          />
                        ))}
                        <div className="flex justify-end">
                          <Button
                            rightIcon={<AddIcon />}
                            onClick={handleAddLanguage}
                          >
                            Add field
                          </Button>
                        </div>
                      </div>
                    </AccordionPanel>
                  </>
                )}
              </AccordionItem>

              <AccordionItem>
                {({ isExpanded }) => (
                  <>
                    <h2>
                      <AccordionButton>
                        <div className="text-left flex-1 text-xl font-medium text-gray-800">
                          Skills
                        </div>
                        {isExpanded ? (
                          <MinusIcon fontSize="12px" />
                        ) : (
                          <AddIcon fontSize="12px" />
                        )}
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      <div className="flex flex-col gap-3">
                        {formSkill.map((item) => (
                          <FormSkill
                            key={item.id}
                            id={item.id}
                            handleRemove={handleRemoveSkill}
                            handleForm={handleForm}
                            value={item}
                          />
                        ))}
                        <div className="flex justify-end">
                          <Button
                            rightIcon={<AddIcon />}
                            onClick={handleAddSkill}
                          >
                            Add field
                          </Button>
                        </div>
                      </div>
                    </AccordionPanel>
                  </>
                )}
              </AccordionItem>

              <AccordionItem>
                {({ isExpanded }) => (
                  <>
                    <h2>
                      <AccordionButton>
                        <div className="text-left flex-1 text-xl font-medium text-gray-800">
                          Hobbies
                        </div>
                        {isExpanded ? (
                          <MinusIcon fontSize="12px" />
                        ) : (
                          <AddIcon fontSize="12px" />
                        )}
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      <Textarea
                        placeholder="Say something..."
                        autoComplete="off"
                        sx={{
                          minHeight: "125px",
                          backgroundColor: "#fff",
                          border: "1px solid #dbdfe2",
                          color: "#495057",
                          padding: "10px",
                          fontSize: "14px",
                          fontWeight: "500",
                          "&:focus-visible": {
                            outline: "0",
                            border: "1px solid #dbdfe2",
                            boxShadow: "none",
                          },
                        }}
                        {...register("hobbies")}
                      />
                    </AccordionPanel>
                  </>
                )}
              </AccordionItem>
            </Accordion>
            <Button
              onClick={handleSubmit(onSubmit)}
              colorScheme={"green"}
              isLoading={isLoading}
              ml="auto"
            >
              Update CV
            </Button>
          </div>
        </div>
      </section>
      <section className="w-full min-h-[100vh]  bg-white py-20">
        <div className="md:max-w-[1164px] mx-auto"></div>
      </section>
    </LayoutMain>
  );
}

export default withAuth(updateCV);
