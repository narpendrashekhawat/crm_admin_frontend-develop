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
    Select,
    Table,
        Thead,
        Tbody,
        Tr,
        Th,
        Td,

} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaUpload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import File_icon from "../../../src/assets/icons/File (2).svg";
import i_icon from "../../assets/icons/i.svg";
import { Config } from "../Utils/Config";

const BulkUploadData = ({ isOpen, onClose, mode }) => {
    const toast = useToast();
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [manufacturers, setManufacturers] = useState([]);
    const [formData, setFormData] = useState({ manufacturerId: '', manufacturerName: '' });
    const [dropdownLoading, setDropdownLoading] = useState(false);
    const [error, setError] = useState(null);
    const [errorRows, setErrorRows] = useState([]); 

    useEffect(() => {
        fetchAllManufacturers();
    }, []);

    const handleClose = () => {
    setErrorRows([]);      
    setSelectedFile(null); 
    setFormData({ manufacturerId: '', manufacturerName: '' }); 
    onClose();             
};
    const fetchAllManufacturers = async () => {
        setDropdownLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${Config?.manufacturers_list}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
            });
            if (response.data.status === 200) {
                setManufacturers(response?.data?.data?.manufacturers);
            }
        } catch (err) {
            setError("Error fetching manufacturers");
            console.error(err);
        }
        setDropdownLoading(false);
    };

    const handleManufacturerChange = (e) => {
        const selectedId = e.target.value;
        const selected = manufacturers.find(
            m => (m._id?.toString() === selectedId || m.ManufacturerID?.toString() === selectedId)
        );
        if (selected) {
            setFormData({ manufacturerId: selectedId, manufacturerName: selected.CompanyName || selected.firmName || '' });
        } else {
            setFormData({ manufacturerId: '', manufacturerName: '' });
        }
    };

    const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

    const uploadProductSheetToServer = async (file) => {
        if (!formData.manufacturerId) {
            toast({
                title: "Manufacturer Required",
                description: "Please select a manufacturer before uploading.",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        const uploadFormData = new FormData();
        uploadFormData.append("file", file);
        uploadFormData.append("manufacturerId", formData.manufacturerId);
        uploadFormData.append("uploadedBy", localStorage.getItem("userId"));

        try {
            setLoading(true);
            const response = await axios.post(`${Config?.BulkUploadData_url}`, uploadFormData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    'Content-Type': 'multipart/form-data',
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
                setFormData({ manufacturerId: '', manufacturerName: '' }); 
                onClose();
            }
        } catch (error) {
            setLoading(false);
            toast({
                title: "Upload Failed",
                description: error.response?.data?.message || "Something went wrong",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            console.error(error);
        }
    };

    const handleUpload = () => {
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

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalOverlay />
            <ModalContent>
                <VStack gap={0} p={5} borderRadius="md" boxShadow="md" bg="white" alignItems="flex-start">
                    <HStack justifyContent="space-between" w="full" marginBottom='11px'>
                        <Text fontSize="17px" fontWeight="bold" color="#364261">
                            {mode === "uploadProductSheet" ? "Bulk Upload Products" : "Bulk Upload Products Stock"}
                        </Text>
                        <ModalCloseButton right='6px' />
                    </HStack>
                    <Divider />
                    <VStack marginTop='8px' gap='2px' alignItems='baseline'>
                        <Text fontSize="12px" color='#364261'>
                            {mode === "uploadProductSheet"
                                ? "This will help you upload bulk products in your product master."
                                : "This will help you upload bulk products stock in your product master."}
                        </Text>
                        <VStack gap={"0"} alignItems={"start"}>
                            <Text fontSize="12px" color='#364261'>
                                {mode === "uploadProductSheet"
                                    ? "Step 1: Download Blank Sheet from the menu."
                                    : "Step 1: Download Existing Data Sheet from the menu"}
                            </Text>
                            
                        </VStack>
                        <Text fontSize="12px" color='#364261'>
                            {mode === "uploadProductSheet"
                                ? "Step 2: Fill the sheet with product information."
                                : "Step 2: Fill the sheet with product stock information."}
                        </Text>

                        <Text fontSize="12px" color='#364261'>Step 3: Upload the file here.</Text>
                    </VStack>

                    <Box width="100%" mt={5}>
                        {dropdownLoading ? (
                            <Box display="flex" justifyContent="center" my={4}>
                                <Spinner size="md" color="#0162E8" />
                            </Box>
                        ) : (
                            <Select
                                placeholder="Select Manufacturer"
                                value={formData.manufacturerId}
                                onChange={handleManufacturerChange}
                                bg='#eff1f999'
                                fontSize='15px'
                                height='48px'
                                borderRadius="md"
                            >
                                {manufacturers?.map((m) => (
                                    <option key={m._id || m.ManufacturerID} value={(m._id || m.ManufacturerID)?.toString()}>
                                        {m.CompanyName || m.firmName}
                                    </option>
                                ))}
                            </Select>
                        )}
                        {error && <Text color="red.500" fontSize="sm" mt={1}>{error}</Text>}
                    </Box>

                    {formData.manufacturerId && (
                        <Text fontSize="14px" color="#0162E8" mt={2}>
                            Selected Manufacturer: {formData.manufacturerName}
                        </Text>
                    )}

                    <Box width="100%" mt={3}>
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
                                width="100%"
                            >
                                {selectedFile ? (
                                    <Text fontSize="14px" mb={3}>Selected File: {selectedFile.name}</Text>
                                ) : (
                                    <>
                                        <Box display="flex" justifyContent="center">
                                            <Img src={File_icon} boxSize={8} alt="File Icon" w="38.6px" h="30px" />
                                        </Box>
                                        <Text mt={2} fontSize="14px" mb={3} color='#364261'>
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
                                                     maxH={errorRows.length > 5 ? "300px" : "auto"} 
                                                     overflowY={errorRows.length > 5 ? "auto" : "visible"} 
                                                     border="1px solid #e2e8f0"
                                                     borderRadius="md"
                                                 >
                                                     <Table variant="simple" size="sm">
                                                         <Thead bg="gray.100" position="sticky" top="0" zIndex="1">
                                                             <Tr>
                                                                 <Th>Row No.</Th>
                                                                 <Th>Product Name</Th>
                                                                 <Th>Error Message</Th>
                                                             </Tr>
                                                         </Thead>
                                                         <Tbody>
                                                             {errorRows.map((row, idx) => (
                                                                 <Tr key={idx}>
                                                                     <Td>{row.rowNumber || idx + 1}</Td>
                                                                     <Td>{row.PName}</Td>
                                                                     <Td color="red.500">{row.errorMessage}</Td>
                                                                 </Tr>
                                                             ))}
                                                         </Tbody>
                                                     </Table>
                                                 </Box>
                                             </Box>
                                         )}

                    <HStack alignItems='baseline' mt={3}>
                        <Img src={i_icon} alt="IButton_icon" />
                        <Text fontSize="xs" color="gray.500" mt={0} mb={0}>
                            By browsing and uploading a file, this will submit the file automatically (No need to re-submit)
                        </Text>
                    </HStack>

                    <HStack width="100%" justifyContent="space-between" marginTop='28px'>
                        <Button
                            variant="outline"
                            border="1px solid #0162E8"
                            color="#0162E8"
                            width="108px"
                            height="40px"
                            fontSize='14px'
                            fontWeight='500'
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
                            fontSize='14px'
                            fontWeight='500'
                            onClick={handleUpload}
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

export default BulkUploadData;
