import { DeleteIcon } from "@chakra-ui/icons";
import { Button, IconButton, Input, Textarea } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export type FormSkillValues = {
  skill: string;
  description: string;
  id: string;
};

interface Props {
  handleRemove: (id: string) => void;
  id: string;
  value?: string;
  handleForm: (
    form: FormSkillValues,
    type: "experience" | "education" | "skill"
  ) => void;
}
const FormSkill = ({ id, handleRemove, handleForm, value }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [form, setForm] = useState<FormSkillValues>({
    skill: "",
    description: "",
    id: id,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    handleForm(form, "skill");
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleOnChange = (e: any) => {
    setForm((prev: FormSkillValues) => {
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
        <label className="text-gray-700">Skill</label>
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
          name="skill"
          value={form.skill || ""}
          onChange={handleOnChange}
        />
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
            onClick={() => handleRemove(id)}
          />
          <Button colorScheme={"green"} isLoading={isLoading} type={"submit"}>
            Done
          </Button>
        </div>
      </div>
    </form>
  );
};

export default FormSkill;
