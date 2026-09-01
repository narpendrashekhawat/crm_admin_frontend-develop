import {
    Box, Input, Button, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Select, Text, Flex,
    HStack, VStack, useDisclosure, Modal, ModalOverlay, ModalContent,
    ModalBody,  useToast, FormControl, FormLabel, FormErrorMessage,
} from "@chakra-ui/react";
import { useState, useCallback } from "react";
import { GoHomeFill } from "react-icons/go";
import { RiCloseCircleLine } from "react-icons/ri";
import successIcon from "../../assets/icons/Icon-2.svg";
import axios from "axios";
import HeaderBar from "../../components/Header/HeaderBar";
import LeftSidebar from "../../components/LeftSideBarLayout/LeftSideBar";
import { Config } from "../Utils/Config";
import Footer from "../footer";

const EmployeeSelector = ({ selected, setSelected }) => {
    const employeeOptions = ["0<20", "20<50", "50<100", "100<..."];
    return (
        <Box flex="1" width="300px">
            <Text fontSize="12px" color="#333333" mt="4" display="flex">
                Number of employees <Text color="#8B8D97" fontSize="12px" ml="1">(Optional)</Text>
            </Text>
            <Flex gap={2} mt={2}>
                {employeeOptions.map((option) => (
                    <Box
                        key={option}
                        w="70px"
                        h="48px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        border="1px solid"
                        borderColor={selected === option ? "blue.500" : "gray.300"}
                        color={selected === option ? "blue.500" : "gray.400"}
                        cursor="pointer"
                        onClick={() => setSelected(option)}
                        _hover={{ color: "#4743E0" }}
                    >
                        {option}
                    </Box>
                ))}
            </Flex>
        </Box>
    );
};

const ManufacturerForm = () => {
    // State hooks for form fields
    const [employees, setEmployees] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneCode, setPhoneCode] = useState("+91");
    const [phoneNumber, setPhoneNumber] = useState("");

    // Form validation state
    const [errors, setErrors] = useState({
        companyName: "",
        email: ""
    });

    // API state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // UI hooks
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    // Form validation function
    const validateForm = useCallback(() => {
        const newErrors = {
            companyName: "",
            email: ""
        };

        let isValid = true;

        if (!companyName.trim()) {
            newErrors.companyName = "Company name is required";
            isValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
            newErrors.email = "Email is required";
            isValid = false;
        } else if (!emailRegex.test(email)) {
            newErrors.email = "Please enter a valid email address";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    }, [companyName, email]);

    // Function to map employee range to min & max values
    const getEmployeeRange = (range) => {
        switch (range) {
            case "0<20":
                return { empMin: 0, empMax: 20 };
            case "20<50":
                return { empMin: 20, empMax: 50 };
            case "50<100":
                return { empMin: 50, empMax: 100 };
            case "100<...":
                return { empMin: 100, empMax: null }; // No upper limit
            default:
                return { empMin: null, empMax: null }; // If no selection
        }
    };

    // API call with proper error handling
    const addManufacturer = useCallback(async () => {
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            const { empMin, empMax } = getEmployeeRange(employees);

            // Prepare request data
            const manufacturerData = {
                companyName: companyName.trim(),
                email: email.trim(),
                phone: phoneNumber ? `${phoneCode} ${phoneNumber.trim()}` : "",
                empMin: empMin,
                empMax: empMax
            };

            console.log("Sending Data:", manufacturerData); // Debugging log

            const response = await axios.post(
                `${Config?.AddManufacturer_url}`,
                manufacturerData,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            console.log(response.data)

            // Success handling
            setSubmitSuccess(true);
            onOpen(); // Open the popup modal

            // Reset form fields after successful submission
            setCompanyName("");
            setEmail("");
            setEmployees("");
            setPhoneNumber("");

        } catch (error) {
            console.error("Registration error:", error);
            let errorMessage = "Failed to register manufacturer";

            if (error.response) {
                errorMessage = error.response.data.message || errorMessage;
            }

            toast({
                title: "Registration Failed",
                description: errorMessage,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top-right"
            });
        } finally {
            setIsSubmitting(false);
        }
    }, [companyName, email, employees, phoneCode, phoneNumber, onOpen, validateForm, toast]);

    // Close modal and handle post-registration actions
    const handleCloseModal = useCallback(() => {
        onClose();
        if (submitSuccess) {
            // You can add additional logic here if needed
        }
    }, [onClose, submitSuccess]);

    // Handle input changes with validation
    const handleCompanyChange = (e) => {
        setCompanyName(e.target.value);
        if (errors.companyName) {
            setErrors({ ...errors, companyName: "" });
        }
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        if (errors.email) {
            setErrors({ ...errors, email: "" });
        }
    };

    return (
        
        <Box backgroundColor='#F0F4F9' height={"100%"}>
            <HStack justifyContent='space-between' px='20px' alignItems='flex-start'>
                <LeftSidebar />
                <Box width='80%'>
                    <HeaderBar />
                   
                    <Box p={4} bg="white" mt='1rem' padding='12px 20px'>
                        <Breadcrumb color="#8B8D97" padding='10px 0px 2rem 0px'>
                            <BreadcrumbItem>
                                <BreadcrumbLink href='/overview'><GoHomeFill color="#5570F1" /></BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbItem>
                                <BreadcrumbLink href='/manufacturers' color='#8B8D97' fontSize='13px'>Manufacturer</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbItem>
                                <BreadcrumbLink href='/manufacturers/add-manufacturer' color='#8B8D97' fontSize='13px'>Add Manufacturer</BreadcrumbLink>
                            </BreadcrumbItem>
                        </Breadcrumb>

                        <VStack padding="32px" spacing={6}>
                            <HStack gap={"5rem"} alignItems="flex-start">
                                <FormControl isInvalid={Boolean(errors.companyName)} flex="1">
                                    <FormLabel fontSize="12px" color="#333333">Company Name</FormLabel>
                                    <Input
                                        value={companyName}
                                        onChange={handleCompanyChange}
                                        placeholder="Enter Name"
                                        fontSize="14px"
                                        color="#333333"
                                        border="1px solid"
                                        width="300px"
                                        height="48px"
                                        borderRadius="none"
                                    />
                                    {errors.companyName && (
                                        <FormErrorMessage>{errors.companyName}</FormErrorMessage>
                                    )}
                                </FormControl>

                                <FormControl isInvalid={Boolean(errors.email)} flex="1">
                                    <FormLabel fontSize="12px" color="#333333">Work email</FormLabel>
                                    <Input
                                        value={email}
                                        onChange={handleEmailChange}
                                        placeholder="Enter email"
                                        fontSize="14px"
                                        color="#333333"
                                        border="1px solid"
                                        width="300px"
                                        height="48px"
                                        borderRadius="none"
                                    />
                                    {errors.email && (
                                        <FormErrorMessage>{errors.email}</FormErrorMessage>
                                    )}
                                </FormControl>
                            </HStack>

                            <HStack gap={"5rem"} justify={"center"} alignItems="flex-start">
                                <EmployeeSelector selected={employees} setSelected={setEmployees} />

                                <Box flex="1">
                                    <Text fontSize="12px" color="#333333" mt="4" display="flex">
                                        Phone number <Text color="#8B8D97" fontSize="12px" ml="1">(Optional)</Text>
                                    </Text>
                                    <Flex width="300px" mt={2}>
                                        <Select
                                            width="40%"
                                            height="48px"
                                            value={phoneCode}
                                            onChange={(e) => setPhoneCode(e.target.value)}
                                            color="#333333"
                                            border="1px solid"
                                            borderRadius="none"
                                        >
                                            <option value="+91">+91</option>
                                        </Select>
                                        <Input
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            height="48px"
                                            placeholder="00 0000 0000"
                                            borderRadius="none"
                                            color="#333333"
                                            border="1px solid"
                                        />
                                    </Flex>
                                </Box>
                            </HStack>

                            <Box textAlign="right" mt="6" width="680px">
                                <Box border='1px dashed #8B8D97' width="100%" opacity="20%" my="38px" />
                                <Button
                                    backgroundColor="#4743E0"
                                    borderRadius="none"
                                    color="white"
                                    fontSize="14px"
                                    w="102px"
                                    h="48px"
                                    margin="32px 0px"
                                    onClick={addManufacturer}
                                    isLoading={isSubmitting}
                                    loadingText="Submitting"
                                    disabled={isSubmitting}
                                >
                                    Register
                                </Button>
                            </Box>
                        </VStack>

                        {/* Success Modal - Styled to match the design in the screenshot */}
                        <Modal isOpen={isOpen} onClose={handleCloseModal} isCentered>
                            <ModalOverlay />
                            <ModalContent
                                bgGradient="linear(to-r, #1B4A98, #2B81B0)"
                                color="white"
                                borderRadius="8px"
                                width="300px"
                                padding="16px"
                                display="flex"
                                flexDirection="column"
                                alignItems="flex-start"
                                position="relative"
                            >
                                {/* Close button in top right */}
                                <Box
                                    position="absolute"
                                    top="2px"
                                    right="2px"
                                    cursor="pointer"
                                    onClick={handleCloseModal}
                                >
                                    <RiCloseCircleLine style={{ color: "black", fontSize: '25px' }} />
                                </Box>

                                <ModalBody px={0} py={0}>
                                    <HStack align="flex-start" width="100%" spacing={3}>
                                        <Flex
                                            w="30px"
                                            h="30px"
                                            borderRadius="full"
                                            bg="rgba(255, 255, 255, 0.2)"
                                            alignItems="center"
                                            justifyContent="center"
                                        >
                                            <Text fontSize="20px" fontWeight="bold">i</Text>
                                        </Flex>
                                        <VStack alignItems="flex-start" spacing={1}>
                                            <Text fontSize="14px" fontWeight="bold">Manufacturer Registered</Text>
                                            <Text fontSize="12px" lineHeight="1.4">
                                                Please ask the client to check<br />
                                                the provided email for Username,<br />
                                                Password and unique link.
                                            </Text>
                                        </VStack>
                                    </HStack>
                                </ModalBody>
                            </ModalContent>
                        </Modal>
                    </Box>
                    <Footer />
                </Box>
                
            </HStack>
           
            
        </Box>
        
        
    );
    
};
  
export default ManufacturerForm;