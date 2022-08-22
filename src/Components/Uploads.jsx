import { Box } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";
import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/table";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Uploads = () => {
  const [uploads, setUploads] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUploads = async () => {
      const { accessToken } = JSON.parse(localStorage.getItem("userInfo"));
      setIsLoading(true);
      const { data } = await axios.get("/api/uploads", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setUploads(data.pipes);
      setIsLoading(false);
    };

    fetchUploads();
  }, []);
  return (
    <Box bg="#fff" h="100vh">
      <Box maxW="1400px" m="auto" p="4rem 5%">
        <Table
          size="sm"
          variant="striped"
          sx={{ width: "100%", tableLayout: "fixed" }}
        >
          <Thead>
            <Tr>
              <Th>Input File</Th>
              <Th>Upload Date</Th>
              <Th textAlign="center">No. of Pipes</Th>
              <Th>Status</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {isLoading && (
              <Tr height="60vh">
                <Td colspan="5" textAlign="center">
                  <Spinner
                    thickness="4px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color="blue.500"
                    size="xl"
                  />
                </Td>
              </Tr>
            )}
            {uploads.map(
              (
                {
                  id,
                  status,
                  original_uploaded_file_name,
                  pipe_count,
                  created_at,
                },
                index,
              ) => (
                <Tr key={id}>
                  <Td>
                    {/* <Link to={`/upload-details/${id}`}> */}
                    {original_uploaded_file_name}
                    {/* </Link> */}
                  </Td>
                  <Td>{created_at}</Td>
                  {status !== "COMPLETED" && (
                    <Td
                      colspan="3"
                      textAlign="center"
                      color={
                        status === "PENDING" || status.includes("ERR")
                          ? "red"
                          : "orange"
                      }
                      fontWeight="bold"
                    >
                      {status}
                    </Td>
                  )}
                  {status === "COMPLETED" && (
                    <>
                      <Td
                        color="#3182ce"
                        _hover={{ textDecoration: "underline" }}
                        fontWeight="bold"
                        textAlign="center"
                      >
                        <Link to={`/upload-details/${id}`}>{pipe_count}</Link>
                      </Td>
                      <Td color="green" fontWeight="bold">
                        {status}
                      </Td>
                      <Td
                        color="#3182ce"
                        _hover={{ textDecoration: "underline" }}
                      >
                        <Link to={`/upload-details/${id}`}>View</Link>
                      </Td>
                    </>
                  )}
                </Tr>
              ),
            )}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default Uploads;
