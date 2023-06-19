import { LANGUAGE_LEVEL } from "@/constants/CV";
import { DeleteIcon } from "@chakra-ui/icons";
import {
  Button,
  Checkbox,
  IconButton,
  Input,
  Select,
  Textarea,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

export type FormLanguageValues = {
  language: string;
  level: string;
  description: string;
  id: string;
};

interface Props {
  handleRemoveLanguage: (id: string) => void;
  id: string;
  handleForm: (
    form: FormLanguageValues,
    type: "experience" | "education" | "language"
  ) => void;
}
const FormLanguage = ({ id, handleRemoveLanguage, handleForm }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [form, setForm] = useState<FormLanguageValues>({
    language: "",
    level: "",
    description: "",
    id: id,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    handleForm(form, "language");
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleOnChange = (e: any) => {
    setForm((prev: FormLanguageValues) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };

  useEffect(() => {
    if (form) {
      setForm(form);
    }
  }, [form]);
  return (
    <form
      className="border border-gray-500 py-3 px-5 rounded-lg"
      onSubmit={handleSubmit}
    >
      <div className="grid grid-cols-2 mb-3 gap-3">
        <div className="flex flex-col">
          <label className="text-gray-700">Language</label>
          <Input
            type="text"
            autoComplete="off"
            name="language"
            value={form.language}
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
          <label className="text-gray-700">Level</label>
          <Select
            defaultValue={LANGUAGE_LEVEL[0]}
            name="level"
            onChange={handleOnChange}
          >
            {LANGUAGE_LEVEL.map((ele) => (
              <option value={ele} key={ele}>
                {ele}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <div className="flex flex-col">
        <label className="text-gray-700">Description</label>
        <Textarea
          id="jobDescription"
          placeholder="Say something..."
          autoComplete="off"
          name="description"
          value={form.description}
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
            onClick={() => handleRemoveLanguage(id)}
          />
          <Button colorScheme={"green"} isLoading={isLoading} type="submit">
            Done
          </Button>
        </div>
      </div>
    </form>
  );
};

export default FormLanguage;
