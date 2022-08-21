import { Button } from "@chakra-ui/button";
import { Checkbox } from "@chakra-ui/checkbox";
import { Box, Heading, HStack, Text, VStack } from "@chakra-ui/layout";
import { Select } from "@chakra-ui/select";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";

const UploadDetails = () => {
  const [imageURL, setImageURL] = useState(null);
  const [hideImg, setHideImg] = useState(false);
  const [videoConversion, setVideoConversion] = useState();
  const navigate = useNavigate();
  const toast = useToast();
  const canvasRef = useRef();
  const imgRef = useRef();

  const { id } = useParams();

  const getMarkerColor = (score) => {
    if (score < 50) {
      return "rgba(255, 51, 0, 0.5)";
    } else if (score > 50 && score < 80) {
      return "#ffaa00";
    } else {
      return "rgba(67, 230, 148, 0.5)";
    }
  };

  const getScoreColor = (score) => {
    if (score < 50) {
      return "rgb(255, 51, 0)";
    } else if (score > 50 && score < 80) {
      return "#ffaa00";
    } else {
      return "rgb(67, 230, 148)";
    }
  };
  const drawImgOnCanvas = (predictions) => {
    const { pred_boxes, scores, image_height, image_width, pred_classes } =
      predictions;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const img = imgRef.current;
    canvas.width = image_width;
    canvas.height = image_height;
    ctx.drawImage(img, 0, 0, image_width, image_height);

    pred_boxes.forEach((box, index) => {
      ctx.beginPath();
      const score = Math.round(scores[index] * 100);
      const predClass = pred_classes[index];
      const color = getMarkerColor(score);
      ctx.lineWidth = "6";
      ctx.strokeStyle = color;
      console.log(box[0], box[1], box[2] - box[0], box[3] - box[1]);
      ctx.rect(box[0], box[1], box[2] - box[0], box[3] - box[1]);
      ctx.font = "16px Arial";
      ctx.fillStyle = "#000";
      ctx.fillRect(box[0], box[1], 65, 30);
      ctx.fillStyle = getScoreColor(score);
      ctx.fillText(`${predClass} ${score} %`, box[0] + 5, box[1] + 20);
      ctx.stroke();
    });
  };
  useEffect(() => {
    const { accessToken } = JSON.parse(localStorage.getItem("userInfo"));
    const fetchPredictions = async () => {
      const {
        data: { predictions },
      } = await axios.get(`/api/download_predictions/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const { pred_boxes, scores } = predictions;
      drawImgOnCanvas(predictions);
      setHideImg(true);
    };

    fetchPredictions();
  }, [imageURL]);

  useEffect(() => {
    const { accessToken } = JSON.parse(localStorage.getItem("userInfo"));
    const fetchPipe = async () => {
      const response = await axios.get(`/api/pipe/${id}`, {
        responseType: "blob",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      setImageURL(URL.createObjectURL(blob));
    };
    fetchPipe();
  }, []);

  return (
    <Box bg="#fff" h="100vh">
      <Box maxW="1400px" m="auto" p="4rem 5%">
        <HStack alignItems="flex-start" gap="6">
          <VStack>
            {imageURL && (
              <Box maxW="1400px" w="1100px" overflow="auto">
                {imageURL && <canvas ref={canvasRef} position="absolute" />}
                <img ref={imgRef} src={imageURL} style={{ display: "none" }} />
              </Box>
            )}
          </VStack>
        </HStack>
      </Box>
    </Box>
  );
};

export default UploadDetails;
