import { DeleteIcon } from "@chakra-ui/icons";
import {
  Button,
  Checkbox,
  IconButton,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import dateFormat from "dateformat";

export type FormEducationValues = {
  school: string;
  major: string;
  startDate: string;
  endDate: string;
  description: string;
  id: string;
};

interface Props {
  handleRemoveEducation: (id: string) => void;
  id: string;
  value?: any;
  handleForm: (
    form: FormEducationValues,
    type: "experience" | "education"
  ) => void;
}

const FormEducation = ({
  id,
  handleRemoveEducation,
  handleForm,
  value,
}: Props) => {
  const [isPresent, setIsPresent] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [form, setForm] = useState<FormEducationValues>({
    school: "",
    major: "",
    startDate: "",
    endDate: "",
    description: "",
    id: id,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (isPresent) {
      setForm((prev: FormEducationValues) => {
        return {
          ...prev,
          endDate: "Present",
        };
      });
      handleForm(
        {
          ...form,
          startDate: new Date(form.startDate).toISOString(),
          endDate: "Present",
        },
        "education"
      );
    } else {
      handleForm(
        {
          ...form,
          startDate: new Date(form.startDate).toISOString(),
          endDate: new Date(form.endDate).toISOString(),
        },
        "education"
      );
    }
    setIsPresent(false);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleOnChange = (e: any) => {
    setForm((prev: FormEducationValues) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };

  useEffect(() => {
    if (form) {
      if (form.endDate && form.endDate === "Present") {
        setIsPresent(true);
      }
      setForm(form);
    }
  }, [form]);

  useEffect(() => {
    if (value) {
      setForm(value);
    }
  }, [value]);
  return (
    <form
      className="border border-gray-500 py-3 px-5 rounded-lg"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col mb-3">
        <label className="text-gray-700">School</label>
        <Input
          type="text"
          autoComplete="off"
          name="school"
          value={form.school || ""}
          onChange={handleOnChange}
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
        />
      </div>
      <div className="flex flex-col mb-3">
        <label className="text-gray-700">Major</label>
        <Input
          type="text"
          autoComplete="off"
          name="major"
          value={form.major || ""}
          onChange={handleOnChange}
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
        />
      </div>
      <div className="grid grid-cols-2 gap-6 mb-3">
        <div className="flex flex-col">
          <label className="text-gray-700">Start date</label>
          <Input
            type="date"
            autoComplete="off"
            name="startDate"
            value={form.startDate || ""}
            onChange={handleOnChange}
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
          />
        </div>
        <div className="flex flex-col">
          <div className="flex justify-between">
            <label className="text-gray-700">End date</label>
            <Checkbox
              colorScheme="green"
              isChecked={isPresent}
              onChange={() => {
                setIsPresent(!isPresent);
              }}
            >
              Present
            </Checkbox>
          </div>
          <Input
            type="date"
            autoComplete="off"
            name="endDate"
            value={form.endDate && !isPresent ? form.endDate : ""}
            onChange={handleOnChange}
            isDisabled={isPresent}
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
          />
        </div>
      </div>
      <div className="flex flex-col">
        <label className="text-gray-700">Description</label>
        <Textarea
          placeholder="Say something..."
          autoComplete="off"
          name="description"
          value={form.description || ""}
          onChange={handleOnChange}
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
        />
      </div>
      <div className="flex justify-end mt-4">
        <div className="flex items-center gap-2">
          <IconButton
            aria-label="remove"
            icon={<DeleteIcon />}
            onClick={() => handleRemoveEducation(id)}
          />
          <Button colorScheme={"green"} type={"submit"} isLoading={isLoading}>
            Done
          </Button>
        </div>
      </div>
    </form>
  );
};

export default FormEducation;
