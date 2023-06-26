import { DeleteIcon } from "@chakra-ui/icons";
import {
  Button,
  Checkbox,
  IconButton,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useController, UseControllerProps } from "react-hook-form";
import dateFormat from "dateformat";
import { formatDate } from "@/utils/datetime.util";

export type FormExperienceValues = {
  position: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
  id: string;
};

interface Props {
  handleRemoveExperience: (id: string) => void;
  id: string;
  value?: any;
  handleForm: (
    form: FormExperienceValues,
    type: "experience" | "education"
  ) => void;
}

const FormExperience = ({
  id,
  handleRemoveExperience,
  handleForm,
  value,
}: Props) => {
  const [isPresent, setIsPresent] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [form, setForm] = useState<FormExperienceValues>({
    position: "",
    company: "",
    startDate: "",
    endDate: "",
    description: "",
    id: id,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (isPresent) {
      setForm((prev: FormExperienceValues) => {
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
        "experience"
      );
    } else {
      handleForm(
        {
          ...form,
          startDate: new Date(form.startDate).toISOString(),
          endDate: new Date(form.endDate).toISOString(),
        },
        "experience"
      );
    }
    setIsPresent(false);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    if (value) {
      setForm(value);
    }
  }, [value]);

  useEffect(() => {
    if (form) {
      if (form.endDate && form.endDate === "Present") {
        setIsPresent(true);
      }
      setForm(form);
    }
  }, [form]);

  return (
    <form
      className="border border-gray-500 py-3 px-5 rounded-lg"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col mb-3">
        <label className="text-gray-700">Position</label>
        <Input
          type="text"
          autoComplete="off"
          value={form.position || ""}
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
          onChange={(event) => {
            event.preventDefault();
            setForm((prev: FormExperienceValues) => {
              return { ...prev, position: event.target.value };
            });
          }}
        />
      </div>
      <div className="flex flex-col mb-3">
        <label className="text-gray-700">Company</label>
        <Input
          type="text"
          autoComplete="off"
          value={form.company || ""}
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
          onChange={(event) => {
            event.preventDefault();
            setForm((prev) => {
              return { ...prev, company: event.target.value };
            });
          }}
        />
      </div>
      <div className="grid grid-cols-2 gap-6 mb-3">
        <div className="flex flex-col">
          <label className="text-gray-700">Start date</label>
          <Input
            type="date"
            autoComplete="off"
            value={formatDate(form.startDate) || ""}
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
            onChange={(event) => {
              event.preventDefault();
              setForm((prev) => {
                return { ...prev, startDate: event.target.value };
              });
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
            value={form.endDate && !isPresent ? formatDate(form.endDate) : ""}
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
            onChange={(event) => {
              event.preventDefault();
              setForm((prev) => {
                return { ...prev, endDate: event.target.value };
              });
            }}
            isDisabled={isPresent}
          />
        </div>
      </div>
      <div className="flex flex-col">
        <label className="text-gray-700">Description</label>
        <Textarea
          placeholder="Say something..."
          autoComplete="off"
          value={form.description || ""}
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
          onChange={(event) => {
            event.preventDefault();
            setForm((prev) => {
              return { ...prev, description: event.target.value };
            });
          }}
        />
      </div>
      <div className="flex justify-end mt-4">
        <div className="flex items-center gap-2">
          <IconButton
            aria-label="remove"
            icon={<DeleteIcon />}
            onClick={() => handleRemoveExperience(id)}
          />
          <Button colorScheme={"green"} type={"submit"} isLoading={isLoading}>
            Done
          </Button>
        </div>
      </div>
    </form>
  );
};

export default FormExperience;
