import { Button } from "@chakra-ui/button";
import { HStack, VStack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router";

const PicturePreview = ({ file, pictureURL, removePicture }) => {
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const imgRef = useRef();

  const showServerError = useCallback(
    (message = "Something went wrong") => {
      toast({
        description: message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    },
    [toast],
  );

  const handleSubmit = async () => {
    try {
      let formData = new FormData();
      formData.append("file", file);

      const { accessToken } = JSON.parse(localStorage.getItem("userInfo"));
      setIsUploading(true);
      await axios.post("/api/pipe_count", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setIsUploading(false);
      toast({
        description: `Upload successful.`,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
      removePicture();
    } catch (error) {
      setIsUploading(false);
      console.log(error);
      if (error.response.status === 401 || error.response.status === 422) {
        navigate("/login");
      } else if (error.response.status === 400) {
        showServerError(error.response.data.message);
      } else {
        showServerError();
      }
    }
  };

  return (
    <VStack alignItems="center" gap="6">
      <VStack>
        <img ref={imgRef} src={pictureURL} alt="Pipe" />
      </VStack>
      <VStack alignItems="center" justifyContent="center" gap="4">
        <HStack w="100%" p="0 3rem">
          {/* {!uploadCompleted && ( */}
          <Button
            colorScheme="blue"
            alignSelf="center"
            flex="1"
            onClick={handleSubmit}
            isLoading={isUploading}
            loadingText="Uploading..."
          >
            Upload
          </Button>
          {/* )} */}
          <Button colorScheme="red" onClick={removePicture}>
            Remove
          </Button>
        </HStack>
      </VStack>
    </VStack>
  );
};

export default PicturePreview;
