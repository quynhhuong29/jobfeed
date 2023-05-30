import { ArrowUpIcon } from "@chakra-ui/icons";
import { Box, Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function BackToTopButton() {
  const [showButton, setShowButton] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 200) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Box
      display={showButton ? "block" : "none"}
      position="fixed"
      bottom="20px"
      right="30px"
      zIndex="999"
    >
      <Button
        onClick={handleBackToTop}
        colorScheme="teal"
        size={"sm"}
        sx={{ backgroundColor: "#02c885" }}
        _hover={{ backgroundColor: "#02af74" }}
      >
        <ArrowUpIcon />
      </Button>
    </Box>
  );
}
