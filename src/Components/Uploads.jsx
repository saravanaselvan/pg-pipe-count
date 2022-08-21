import { Box, Text } from "@chakra-ui/layout";
import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/table";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Uploads = () => {
  const [uploads, setUploads] = useState([]);

  useEffect(() => {
    const fetchUploads = async () => {
      const { accessToken } = JSON.parse(localStorage.getItem("userInfo"));
      const { data } = await axios.get("/api/uploads", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setUploads(data.pipes);
    };

    fetchUploads();
  }, []);
  return (
    <Box bg="#fff" h="100vh">
      <Box maxW="1400px" m="auto" p="4rem 5%">
        <Table
          size="md"
          variant="striped"
          sx={{ width: "100%", tableLayout: "fixed" }}
        >
          <Thead>
            <Tr>
              <Th>Input File</Th>
              <Th>Status</Th>
              <Th>Upload Date</Th>
              <Th>Output</Th>
            </Tr>
          </Thead>
          <Tbody>
            {uploads.map(
              (
                { id, status, original_uploaded_file_name, created_at },
                index,
              ) => (
                <Tr key={id}>
                  <Td>
                    <Link to={`/upload-details/${id}`}>
                      {original_uploaded_file_name}
                    </Link>
                  </Td>
                  <Td>{status}</Td>
                  <Td>{created_at}</Td>
                  <Td>
                    <Link to={`/upload-details/${id}`}>View</Link>
                  </Td>
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
