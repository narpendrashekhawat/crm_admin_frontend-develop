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
    Image,
    useToast,
    Spinner,
    Select,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";

import File_icon from "../../../src/assets/icons/File (2).svg";
import i_icon from "../../assets/icons/i.svg";
import download_icon from "../../assets/icons/download.svg";
import { Config } from "../Utils/Config";

const BulkUploadData = ({ isOpen, onClose, mode }) => {
    const toast = useToast();
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedStockFile, setSelectedStockFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [manufacturers, setManufacturers] = useState([]);
    const [formData, setFormData] = useState({
        manufacturerId: '',
        manufacturerName: ''
    });
    const [dropdownLoading, setDropdownLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleStockFileChange = (e) => {
        setSelectedStockFile(e.target.files[0]);
    };

    useEffect(() => {
        fetchAllManufacturers();
    }, []);

    const fetchAllManufacturers = async () => {
        setDropdownLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${Config?.Get_Company_Name}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
            });
            if (response.data.status === 200) {
                setManufacturers(response.data.manufacturers);
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
            setFormData({
                manufacturerId: selectedId,
                manufacturerName: selected.CompanyName || selected.firmName || ''
            });
        } else {
            setFormData({
                manufacturerId: '',
                manufacturerName: ''
            });
        }
    };

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

        const uploadData = new FormData();
        uploadData.append("file", file);
        uploadData.append("manufacturerId", formData.manufacturerId);
        uploadData.append("uploadedBy", localStorage.getItem("userId"));

        try {
            setLoading(true);
            const response = await axios.post(`${Config?.BulkUploadData_url}`, uploadData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    'Content-Type': 'multipart/form-data'
                },
            });
            setLoading(false);
            toast({
                title: "Upload Successful",
                description: response?.data?.message || "Product sheet uploaded successfully.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            onClose();
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
                        <HStack>
                            <Text fontSize="12px" color='#364261'>
                                {mode === "uploadProductSheet"
                                    ? "Step 1: Download Blank Sheet from the menu."
                                    : "Step 1: Download Existing Data Sheet from the menu"}
                            </Text>
                            <Text fontSize="12px" color='#364261'>Step 3: Upload the file here.</Text>
                        </HStack>
                        <Text fontSize="12px" color='#364261'>
                            {mode === "uploadProductSheet"
                                ? "Step 2: Fill the sheet with product information."
                                : "Step 2: Fill the sheet with product stock information."}
                        </Text>
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
                                {manufacturers.map((manufacturer) => (
                                    <option
                                        key={manufacturer._id || manufacturer.ManufacturerID}
                                        value={(manufacturer._id || manufacturer.ManufacturerID)?.toString()}
                                    >
                                        {manufacturer.CompanyName || manufacturer.firmName}
                                    </option>
                                ))}
                            </Select>
                        )}
                        {error && (
                            <Text color="red.500" fontSize="sm" mt={1}>
                                {error}
                            </Text>
                        )}
                    </Box>

                    {formData.manufacturerId && (
                        <Text fontSize="14px" color="#0162E8" mt={2}>
                            Selected Manufacturer: {formData.manufacturerName}
                        </Text>
                    )}

                    <Box width="100%">
                        <input
                            type="file"
                            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                            style={{ display: "none" }}
                            id="file-input"
                            onChange={mode === "uploadProductSheet" ? handleFileChange : handleStockFileChange}
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
                                {(selectedFile || selectedStockFile) ? (
                                    <Box textAlign="center">
                                        <Text fontSize="14px" mb={3}>
                                            Selected File: {selectedFile?.name || selectedStockFile?.name}
                                        </Text>
                                    </Box>
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

                    <HStack alignItems='baseline'>
                        <Img src={i_icon} alt="IButton_icon" />
                        <Text fontSize="xs" color="gray.500" mt={3} mb={3}>
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
                            onClick={onClose}
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
                            onClick={mode === "uploadProductSheet" ? handleProductSheetUpload : handleStockSheetUpload}
                            isLoading={loading}
                            spinner={<Spinner size="sm" />}
                        >
                            <Image src={download_icon} alt="Upload icon" />
                            <Text marginLeft="7px"> Upload</Text>
                        </Button>
                    </HStack>
                </VStack>
            </ModalContent>
        </Modal>
    );
};

export default BulkUploadData;
