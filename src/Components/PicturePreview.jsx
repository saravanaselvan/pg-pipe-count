import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "@chakra-ui/alert";
import { Button } from "@chakra-ui/button";
import { Checkbox } from "@chakra-ui/checkbox";
import { Heading, HStack, Text, VStack } from "@chakra-ui/layout";
import { Select } from "@chakra-ui/select";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

const PicturePreview = ({ file, pictureURL, removePicture }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadCompleted, setUploadCompleted] = useState(false);
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);
  const navigate = useNavigate();
  const toast = useToast();
  const canvasRef = useRef();
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
      const { data } = await axios.post("/api/pipe_count", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setIsUploading(false);
      setUploadCompleted(true);
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
    <VStack alignItems="flex-start" gap="6">
      <VStack>
        <img ref={imgRef} src={pictureURL} />
      </VStack>
      <VStack alignItems="flex-start" gap="4" w="30%">
        <HStack w="100%" p="0 3rem">
          {/* {!uploadCompleted && ( */}
          <Button
            colorScheme="blue"
            alignSelf="center"
            flex="1"
            onClick={handleSubmit}
            isLoading={isUploading}
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
