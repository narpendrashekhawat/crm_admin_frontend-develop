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
import { useState } from "react";
import axios from "axios";
import File_icon from "../../../assets/icons/File (2).svg";
import i_icon from "../../../assets/icons/i.svg";
import { FaUpload } from "react-icons/fa";
import { Config } from "../../Utils/Config";

const BulkUpload = ({ isOpen, onClose }) => {
    const toast = useToast();
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorRows, setErrorRows] = useState([]); //  store rows with errors

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

     const handleClose = () => {
        setErrorRows([]);      
        setSelectedFile(null); 
        onClose();             
    };

    const uploadManufacturerSheet = async () => {
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

        const uploadData = new FormData();
        uploadData.append("file", selectedFile);
        uploadData.append("uploadedBy", localStorage.getItem("userId"));

        try {
            setLoading(true);
            const response = await axios.post(`${Config?.BulkUploadManufacturer_url}`, uploadData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            setLoading(false);

            if (response?.data?.rowsWithErrors?.length > 0) {
                // Store error rows in state
                setErrorRows(response.data.rowsWithErrors);
                toast({
                    title: "Upload Completed with Errors",
                    description: "Some rows could not be uploaded. See details below.",
                    status: "warning",
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                setErrorRows([]); //  clear errors if none
                toast({
                    title: "Upload Successful",
                    description: response?.data?.message || "Manufacturer data uploaded successfully.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                setSelectedFile(null);
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

    return (
        <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
            <ModalOverlay />
            <ModalContent>
                <VStack gap={0} p={5} borderRadius="md" boxShadow="md" bg="white" alignItems="flex-start">
                    <HStack justifyContent="space-between" w="full" marginBottom="11px">
                        <Text fontSize="17px" fontWeight="bold" color="#364261">
                            Bulk Upload Manufacturers
                        </Text>
                        <ModalCloseButton right="6px" />
                    </HStack>
                    <Divider />

                    {/* Info Steps */}
                    <VStack marginTop="8px" gap="2px" alignItems="baseline">
                        <Text fontSize="12px" color="#364261">
                            This will help you upload bulk manufacturers into your system.
                        </Text>
                        <Text fontSize="12px" color="#364261">Step 1: Fill the sheet with manufacturer information.</Text>
                        <Text fontSize="12px" color="#364261">Step 2: Upload the file here.</Text>
                    </VStack>

                    {/* File Upload Box */}
                    <Box width="100%" mt={5}>
                        <input
                            type="file"
                            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                            style={{ display: "none" }}
                            id="file-input"
                            onChange={handleFileChange}
                        />
                        <label htmlFor="file-input">
                            <Box
                                border="2px dashed #0162e8"
                                borderRadius="md"
                                bg="#ecf0fa"
                                p={6}
                                textAlign="center"
                                cursor="pointer"
                                mt={3}
                                width="100%"
                            >
                                {selectedFile ? (
                                    <Box textAlign="center">
                                        <Text fontSize="14px" mb={3}>
                                            Selected File: {selectedFile.name}
                                        </Text>
                                    </Box>
                                ) : (
                                    <>
                                        <Box display="flex" justifyContent="center">
                                            <Img src={File_icon} boxSize={8} alt="File Icon" w="38.6px" h="30px" />
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

                    {/* Error Info Table */}
                     {errorRows.length > 0 && (
                         <Box mt={6} w="100%">
                             <Text fontWeight="bold" fontSize="15px" color="red.500" mb={3}>
                                 Upload Errors:
                             </Text>
                     
                             <Box
                                 maxH={errorRows.length > 10 ? "300px" : "auto"} 
                                 overflowY={errorRows.length > 10 ? "auto" : "visible"} 
                                 border="1px solid #e2e8f0"
                                 borderRadius="md"
                             >
                                 <Table variant="simple" size="sm">
                                     <Thead bg="gray.100" position="sticky" top="0" zIndex="1">
                                         <Tr>
                                             <Th>Row No.</Th>
                                             <Th>Company Name</Th>
                                             <Th>Error Message</Th>
                                         </Tr>
                                     </Thead>
                                     <Tbody>
                                         {errorRows.map((row, idx) => (
                                             <Tr key={idx}>
                                                 <Td>{row.rowNumber}</Td>
                                                 <Td>{row.companyName}</Td>
                                                 <Td color="red.500">{row.error}</Td>
                                             </Tr>
                                         ))}
                                     </Tbody>
                                 </Table>
                             </Box>
                         </Box>
                     )}


                    {/* Buttons */}
                    <HStack width="100%" justifyContent="space-between" marginTop="28px">
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
                            onClick={uploadManufacturerSheet}
                            isLoading={loading}
                            spinner={<Spinner size="sm" />}
                        >
                            <FaUpload />
                            <Text marginLeft="7px"> Upload</Text>
                        </Button>
                    </HStack>
                </VStack>
            </ModalContent>
        </Modal>
    );
};

export default BulkUpload;
