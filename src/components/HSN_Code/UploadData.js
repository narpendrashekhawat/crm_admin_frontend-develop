import {
  Box,
  Button,
  Text,
  VStack,
  Divider,
  HStack,
  Img,
  Modal,
  ModalContent,
  ModalOverlay,
  ModalCloseButton,
  useToast,
  Spinner,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";

import File_icon from "../../../src/assets/icons/File (2).svg";
import i_icon from "../../assets/icons/i.svg";
import { FaUpload } from "react-icons/fa";
import { Config } from "../Utils/Config";

const UploadData = ({ isOpen, onClose, mode }) => {
  const toast = useToast();
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedStockFile, setSelectedStockFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorRows, setErrorRows] = useState([]);
  const [headerId, setHeaderId] = useState(null);
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleStockFileChange = (e) => {
    setSelectedStockFile(e.target.files[0]);
  };

  const handleClose = () => {
    setErrorRows([]);
    setHeaderId(null);
    setFileName("");
    setSelectedFile(null);
    setSelectedStockFile(null);
    onClose();
  };

  // reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setHeaderId(null);
      setFileName("");
      setSelectedFile(null);
      setSelectedStockFile(null);
      setErrorRows([]);
    }
  }, [isOpen]);

  const uploadProductSheetToServer = async (file) => {

    const uploadData = new FormData();
    uploadData.append("file", file);
        // uploadData.append("manufacturerId", formData.manufacturerId);
    uploadData.append("uploadedBy", localStorage.getItem("userId"));

    try {
      setLoading(true);
      const response = await axios.post(`${Config?.Upload_HSN_url}`, uploadData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    'Content-Type': 'multipart/form-data'
        },
      });
      setLoading(false);

      // ✅ save error info
      setHeaderId(response?.data?.headerId || null);
      setFileName(response?.data?.fileName || "");
      setErrorRows(response?.data?.rowsWithErrors || []);

      if (response?.data?.rowsWithErrors?.length > 0) {
        toast({
          title: "Upload Completed with Errors",
          description: "Some rows have issues. Please review below.",
          status: "warning",
          duration: 4000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Upload Successful",
          description: response?.data?.message || "File uploaded successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onClose();
      }
    } catch (error) {
      setLoading(false);
      toast({
        title: "Upload Failed",
        description: error?.response?.data?.message || "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.error(error);
    }
  };

  const handleProductSheetUpload = () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    uploadProductSheetToServer(selectedFile);
  };

  const handleStockSheetUpload = () => {
    if (!selectedStockFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    uploadProductSheetToServer(selectedStockFile);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
      <ModalOverlay />
      <ModalContent>
        <VStack
          gap={0}
          p={5}
          borderRadius="md"
          boxShadow="md"
          bg="white"
          alignItems="flex-start"
        >
          <HStack justifyContent="space-between" w="full" mb="11px">
            <Text fontSize="17px" fontWeight="bold" color="#364261">
              {mode === "uploadProductSheet"
                ? "Bulk Upload Products"
                : "Upload File"}
            </Text>
            <ModalCloseButton right="6px" />
          </HStack>
          <Divider />

          {/* File Input */}
          <Box width="100%" mt={3}>
            <input
              type="file"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              style={{ display: "none" }}
              id="file-input"
              onChange={
                mode === "uploadProductSheet"
                  ? handleFileChange
                  : handleStockFileChange
              }
            />
            <label htmlFor="file-input">
              <Box
                border="2px dashed #0162e8"
                borderRadius="md"
                bg="#ecf0fa"
                p={6}
                textAlign="center"
                cursor="pointer"
                width="100%"
              >
                {selectedFile || selectedStockFile ? (
                  <Box textAlign="center">
                    <Text fontSize="14px" mb={3}>
                      Selected File:{" "}
                      {selectedFile?.name || selectedStockFile?.name}
                    </Text>
                  </Box>
                ) : (
                  <>
                    <Box display="flex" justifyContent="center">
                      <Img
                        src={File_icon}
                        boxSize={8}
                        alt="File Icon"
                        w="38.6px"
                        h="30px"
                      />
                    </Box>
                    <Text mt={2} fontSize="14px" mb={3} color="#364261">
                      Drag and Drop Files here or
                    </Text>
                  </>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  border="1px solid #0162E8"
                  color="#0162E8"
                  bg="#ecf0fa"
                  w="144px"
                  h="40px"
                  onClick={() => document.getElementById("file-input").click()}
                >
                  Browse Files
                </Button>
              </Box>
            </label>
          </Box>

          {/* Error Info Section */}
          {(headerId || fileName || errorRows.length > 0) && (
            <Box mt={6} w="100%">
              <Text
                fontWeight="bold"
                fontSize="15px"
                color="red.500"
                mb={3}
              >
                Upload Errors:
              </Text>

              <Box border="1px solid #e2e8f0" borderRadius="md" p={3} bg="gray.50">
                {fileName && (
                  <Text fontSize="14px" color="#364261" mb={1}>
                    <b>File Name:</b> {fileName}
                  </Text>
                )}
                {headerId && (
                  <Text fontSize="14px" color="#364261" mb={3}>
                    <b>Header ID:</b> {headerId}
                  </Text>
                )}

                {/* ✅ Error Rows Table */}
                {errorRows.length > 0 && (
                  <Table size="sm" variant="simple" mt={3}>
                    <Thead bg="gray.100">
                      <Tr>
                        <Th>Row No</Th>
                        <Th>HSN Code</Th>
                        <Th>Description</Th>
                        <Th>Category</Th>
                        <Th>Error</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {errorRows.map((row, index) => (
                        <Tr key={index}>
                          <Td>{row.rowNumber}</Td>
                          <Td>{row.HSN_CD || "-"}</Td>
                          <Td>{row.HSN_Description}</Td>
                          <Td>{row.category}</Td>
                          <Td color="red.500">{row.error}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                )}
              </Box>
            </Box>
          )}

          {/* Info Text */}
          <HStack alignItems="baseline" mt={4}>
            <Img src={i_icon} alt="IButton_icon" />
            <Text fontSize="xs" color="gray.500">
              By browsing and uploading a file, this will submit the file
              automatically (No need to re-submit)
            </Text>
          </HStack>

          {/* Action Buttons */}
          <HStack width="100%" justifyContent="space-between" mt="28px">
            <Button
              variant="outline"
              border="1px solid #0162E8"
              color="#0162E8"
              width="108px"
              height="40px"
              fontSize="14px"
              fontWeight="500"
              onClick={handleClose}
              isDisabled={loading}
            >
              Cancel
            </Button>
            <Button
              bg="#3E60AA"
              width="108px"
              height="40px"
              color="#FFFFFF"
              fontSize="14px"
              fontWeight="500"
              onClick={
                mode === "uploadProductSheet"
                  ? handleProductSheetUpload
                  : handleStockSheetUpload
              }
              isLoading={loading}
              spinner={<Spinner size="sm" />}
            >
              <FaUpload />
              <Text ml="7px">Upload</Text>
            </Button>
          </HStack>
        </VStack>
      </ModalContent>
    </Modal>
  );
};

export default UploadData;
