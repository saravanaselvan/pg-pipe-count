import { Button } from "@chakra-ui/button";
import { Box, Flex, Heading, HStack, Text, VStack } from "@chakra-ui/layout";
import { useEffect, useRef, useState } from "react";
import PicturePreview from "./PicturePreview";

const ProcessPicture = () => {
  const [file, setFile] = useState();
  const [fileName, setFileName] = useState();
  const [pictureURL, setPictureURL] = useState(null);
  const fileUploadRef = useRef();

  const pictureUploadHandler = (event) => {
    let pickedFile;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFileName(pickedFile.name);
      setFile(pickedFile);
      const url = URL.createObjectURL(pickedFile);
      setPictureURL(url);
    }
  };

  const removePicture = () => {
    setFileName(null);
    setFile(null);
    setPictureURL(null);
  };
  return (
    <Box bg="#fff" h="100vh">
      <Box maxW="1400px" m="auto" p="4rem 5%">
        {!file && (
          <Flex alignItems="center" justifyContent="center" w="100%">
            <VStack>
              <Heading as="h3" fontSize="2xl" mb="4">
                Please select a PNG file to identify pipes
              </Heading>
              <HStack>
                <input
                  type="file"
                  accept="image/png"
                  onChange={pictureUploadHandler}
                  id="jsonUploadButton"
                  style={{ display: "none" }}
                  ref={fileUploadRef}
                />
                <Button
                  type="button"
                  onClick={() => fileUploadRef.current.click()}
                >
                  Browse
                </Button>
                <Text ml={4} minW="150px">
                  {fileName || "No file chosen"}
                </Text>
              </HStack>
            </VStack>
          </Flex>
        )}
        {file && (
          <PicturePreview
            file={file}
            pictureURL={pictureURL}
            removePicture={removePicture}
          />
        )}
      </Box>
    </Box>
  );
};

export default ProcessPicture;
