import {
    Box, Input, Button, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Text, Flex,
    HStack, VStack, useDisclosure, Modal, ModalOverlay, ModalContent,
    ModalBody, useToast, FormControl, FormLabel, FormErrorMessage, Stack,
} from "@chakra-ui/react";
import { useState, useCallback } from "react";
import { GoHomeFill } from "react-icons/go";
import { RiCloseCircleLine } from "react-icons/ri";
import { IoIosArrowDown } from "react-icons/io";
import axios from "axios";
import HeaderBar from "../../components/Header/HeaderBar";
import LeftSidebar from "../../components/LeftSideBarLayout/LeftSideBar";
import { Config } from "../Utils/Config";
import Footer from "../footer";

const EmployeeSelector = ({ selected, setSelected }) => {
    const employeeOptions = ["0<20", "20<50", "50<100", "100<..."];
    return (
        <Box width="100%">
            <Text fontSize="14px" color="#333333" mb="2" display="flex">
                Number of employees <Text color="#8B8D97" fontSize="14px" ml="1">(Optional)</Text>
            </Text>
            <Flex gap={2}>
                {employeeOptions.map((option) => (
                    <Box
                        key={option}
                        width="72px"
                        height="44px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        border="1px solid"
                        borderColor={selected === option ? "#4743E0" : "#E5E5E5"}
                        color={selected === option ? "#4743E0" : "#333333"}
                        cursor="pointer"
                        onClick={() => setSelected(option)}
                        _hover={{ borderColor: "#4743E0", color: "#4743E0" }}
                        bg={selected === option ? "#F7F7FD" : "white"}
                    >
                        {option}
                    </Box>
                ))}
            </Flex>
        </Box>
    );
};

const TypeSelector = ({ selected, setSelected }) => {
    const [isOpen, setIsOpen] = useState(false);
    const options = ["Distributor", "CNF"];


    // Form validation state
    const [errors, setErrors] = useState({
        companyName: "",
        email: ""
    });

    //API state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [companyName, email, phoneCode] = useState(false);
    const [employees, phoneNumber, setCompanyName, setEmail] = useState(false);
    const [Config, setPhoneNumber, setEmployees] = useState(false);
    // UI hooks
    const { onOpen, onClose } = useDisclosure();
    const toast = useToast();

    //Form Validation function
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
    const addDistributor = useCallback(async () => {
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
                // phone: phoneNumber ? `${phoneNumber.trim().slice(-10)}` : Number(''),
                empMin: empMin,
                empMax: empMax
            };

            console.log("Sending Data:", manufacturerData); // Debugging log

            const response = await axios.post(
                `${Config?.AddDistributor_url}`,
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
        <Box width="100%">
            <Text fontSize="14px" color="#333333" mb="2">Type Select</Text>
            <Box
                position="relative"
            >
                <Box
                    border="1px solid #E5E5E5"
                    height="44px"
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    px={4}
                    cursor="pointer"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <Text color={selected ? "#333333" : "#8B8D97"}>
                        {selected || "Select"}
                    </Text>
                    <IoIosArrowDown />
                </Box>

                {isOpen && (
                    <Box
                        position="absolute"
                        top="100%"
                        left="0"
                        width="100%"
                        bg="white"
                        border="1px solid #E5E5E5"
                        zIndex={10}
                    >
                        {options.map((option) => (
                            <Box
                                key={option}
                                p={2}
                                cursor="pointer"
                                _hover={{ bg: "#F7F7FD" }}
                                onClick={() => {
                                    setSelected(option);
                                    setIsOpen(false);
                                }}
                            >
                                {option}
                            </Box>
                        ))}
                    </Box>
                )}
            </Box>
        </Box>
    );
};

const AddDistributor = () => {
    // State hooks for form fields
    const [type, setType] = useState("");
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

    // API call with proper error handling
    // const addDistributor = useCallback(async () => {
    //     if (!validateForm()) {
    //         return;
    //     }

    //     setIsSubmitting(true);
    //     try {
    //         // Function to map employee range to min & max values
    //         const getEmployeeRange = (range) => {
    //             switch (range) {
    //                 case "0<20":
    //                     return { empMin: 0, empMax: 20 };
    //                 case "20<50":
    //                     return { empMin: 20, empMax: 50 };
    //                 case "50<100":
    //                     return { empMin: 50, empMax: 100 };
    //                 case "100<":
    //                     return { empMin: 100, empMax: null };
    //                 default:
    //                     return { empMin: null, empMax: null };
    //             }
    //         };

    //         const { empMin, empMax } = getEmployeeRange(employees);

    //         // Prepare request data
    //         const distributorData = {
    //             companyName: companyName.trim(),
    //             email: email.trim(),
    //             phone: phoneNumber ? `${phoneCode} ${phoneNumber.trim()}` : "",
    //             type: type,
    //             empMin,
    //             empMax
    //         };

    //         console.log("Sending Data:", distributorData);

    //         // Simulate success for now
    //         setSubmitSuccess(true);
    //         onOpen();

    //         // Reset form fields after successful submission
    //         setCompanyName("");
    //         setEmail("");
    //         setEmployees("");
    //         setPhoneNumber("");
    //         setType("");

    //     } catch (error) {
    //         console.error("Registration error:", error);
    //         let errorMessage = "Failed to register distributor";

    //         if (error.response) {
    //             errorMessage = error.response.data.message || errorMessage;
    //         }

    //         toast({
    //             title: "Registration Failed",
    //             description: errorMessage,
    //             status: "error",
    //             duration: 5000,
    //             isClosable: true,
    //             position: "top-right"
    //         });
    //     } finally {
    //         setIsSubmitting(false);
    //     }
    // }, [companyName, email, employees, phoneCode, phoneNumber, type, onOpen, validateForm, toast]);
    const addDistributor = useCallback(async () => {
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            const getEmployeeRange = (range) => {
                switch (range) {
                    case "0<20":
                        return { empMin: 0, empMax: 20 };
                    case "20<50":
                        return { empMin: 20, empMax: 50 };
                    case "50<100":
                        return { empMin: 50, empMax: 100 };
                    case "100<":
                        return { empMin: 100, empMax: null };
                    default:
                        return { empMin: null, empMax: null };
                }
            };
            const { empMin, empMax } = getEmployeeRange(employees);

            // Prepare request data
            const manufacturerData = {
                companyName: companyName.trim(),
                email: email.trim(),
                phone: phoneNumber ? `${phoneCode} ${phoneNumber.trim()}` : "",
                empMin: empMin,
                empMax: empMax,
                "userType": "Distributor"
            };

            console.log("Sending Data:", manufacturerData); // Debugging log

            const response = await axios.post(
                `${Config?.AddDistributor_url}`,
                manufacturerData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`                    }
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

    const handleCloseModal = useCallback(() => {
        onClose();
    }, [onClose]);

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
                    <Box maxWidth="100%" p={4} bg="white">


                        <Breadcrumb color="#8B8D97" mb={6}>
                            <BreadcrumbItem>
                                <BreadcrumbLink href='/'>
                                    <GoHomeFill color="#5570F1" />
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbItem>
                                <BreadcrumbLink href='/distributor' color='#8B8D97' fontSize='14px'>
                                    Distributor CNF
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbItem>
                                <BreadcrumbLink href='/distributor/add' color='#8B8D97' fontSize='14px'>
                                    Add D OR CNF Profile Detail
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                        </Breadcrumb>

                        <Box maxWidth="700px" mx="auto">
                            <Stack spacing={8} direction="column">
                                <Stack spacing={8} direction={["column", "row"]}>
                                    <FormControl isInvalid={Boolean(errors.companyName)}>
                                        <FormLabel fontSize="14px" color="#333333">Company Name</FormLabel>
                                        <Input
                                            value={companyName}
                                            onChange={handleCompanyChange}
                                            placeholder="Enter Name"
                                            fontSize="14px"
                                            color="#333333"
                                            border="1px solid #E5E5E5"
                                            height="44px"
                                            borderRadius="4px"
                                        />
                                        {errors.companyName && (
                                            <FormErrorMessage>{errors.companyName}</FormErrorMessage>
                                        )}
                                    </FormControl>

                                    <FormControl isInvalid={Boolean(errors.email)}>
                                        <FormLabel fontSize="14px" color="#333333">Work email</FormLabel>
                                        <Input
                                            value={email}
                                            onChange={handleEmailChange}
                                            placeholder="Enter email"
                                            fontSize="14px"
                                            color="#333333"
                                            border="1px solid #E5E5E5"
                                            height="44px"
                                            borderRadius="4px"
                                        />
                                        {errors.email && (
                                            <FormErrorMessage>{errors.email}</FormErrorMessage>
                                        )}
                                    </FormControl>
                                </Stack>

                                <Stack spacing={8} direction={["column", "row"]}>
                                    <TypeSelector selected={type} setSelected={setType} />

                                    <Box>
                                        <Text fontSize="14px" color="#333333" mb="2" display="flex" width="334px">
                                            Phone number <Text color="#8B8D97" fontSize="14px" ml="1">(Optional)</Text>
                                        </Text>
                                        <Flex>
                                            <Box
                                                width="80px"
                                                height="44px"
                                                border="1px solid #E5E5E5"
                                                borderRight="none"
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="space-between"
                                                px={2}
                                            >
                                                <Text>+91</Text>
                                                <IoIosArrowDown />
                                            </Box>
                                            <Input
                                                value={phoneNumber}
                                                onChange={(e) => setPhoneNumber(e.target.value)}
                                                height="44px"
                                                placeholder="00 0000 0000"
                                                borderRadius="4px"
                                                borderLeftRadius="0"
                                                color="#333333"
                                                border="1px solid #E5E5E5"
                                            />
                                        </Flex>
                                    </Box>
                                    
                                </Stack>

                                <EmployeeSelector selected={employees} setSelected={setEmployees} />

                                <Box border='1px dashed' width="100%" height="1px" bg="#8B8D97" opacity="20%" my={38} />

                                <Flex justifyContent="flex-end">
                                    <Button
                                        backgroundColor="#4743E0"
                                        color="white"
                                        fontSize="14px"
                                        width="102px"
                                        height="44px"
                                        borderRadius="4px"
                                        onClick={addDistributor}
                                        isLoading={isSubmitting}
                                        loadingText="Submitting"
                                        disabled={isSubmitting}
                                    >
                                        Register
                                    </Button>
                                </Flex>
                            </Stack>
                        </Box>
                        

                        {/* Success Modal */}
                        <Modal isOpen={isOpen} onClose={handleCloseModal} isCentered>
                            <ModalOverlay />
                            <ModalContent
                                bgGradient="linear(to-r, #1B4A98, #2B81B0)" // Adjusted gradient to match image
                                color="white"
                                borderRadius="8px" // Reduced border radius to match image
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
                                            <Text fontSize="14px" fontWeight="bold">Distributor / CNF Registered</Text>
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

export default AddDistributor;