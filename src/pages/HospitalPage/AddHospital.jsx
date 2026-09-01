import {
    Box, Input, Button, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Select, Text, Flex,
    HStack, VStack, useDisclosure, Modal, ModalOverlay, ModalContent,
    ModalBody, useToast, FormControl, FormLabel, FormErrorMessage,
    MenuButton,
    IconButton,
    AlertIcon,
    Alert,
} from "@chakra-ui/react";
import { useState, useCallback, useEffect } from "react";
import { GoHomeFill } from "react-icons/go";
import { RiCloseCircleLine } from "react-icons/ri";
import successIcon from "../../assets/icons/Icon-2.svg";
import axios from "axios";
import HeaderBar from "../../components/Header/HeaderBar";
import LeftSidebar from "../../components/LeftSideBarLayout/LeftSideBar";
import { Config } from "../../components/Utils/Config";
import Footer from "../../components/footer";
import useAxios from "../../components/Context/axiosInstance";
import { useNavigate } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

function AddHospital() {
    // State hooks for form fields





    const [hospitalName, setHospitalName] = useState("");
    const [email, setEmail] = useState("");
    const [type, setType] = useState("");
    const [error, setError] = useState(null);
    const [phoneCode, setPhoneCode] = useState("+91");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [pinCode, setpinCode] = useState("");
    const [location, setLocation] = useState({
        address: "",
        state: "",
        city: "",
        pinCode: ""
    });

    const [loadingStates, setLoadingStates] = useState({
        isStateLoading: true,
    });
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedState, setSelectedState] = useState({
        id: 0,
        state: 'Select State',
    });
    const [selectedCity, setSelectedCity] = useState({
        id: 0,
        city: 'Select City',
        state_id: 0
    });


    const Nav = useNavigate()
    const axiosInstance = useAxios();
    // Form validation state
    const [errors, setErrors] = useState({
        companyName: "",
        email: ""
    });

    // State API 

    useEffect(() => {
        ; (async () => {
            try {
                const response = await axios.get(`${Config.Get_State_And_Cities}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`
                    }
                });
                if (response.status === 200 && response.data.success) {
                    setStates(response.data.data);
                    setLoadingStates((prev) => ({ ...prev, isStateLoading: false }));
                };
            } catch (err) {
                console.error('caught this error', err);
            }
        })();
    }, [localStorage.getItem('authToken')]);

    // useEffect(() => {
    //     if (states.length) {
    //         setSelectedState(states.find(item => item.state.toLowerCase() == userProfileData?.addresses?.businessAdd?.State?.toLowerCase()));
    //     }
    // }, [states]);

    // Cities API
    useEffect(() => {
        if (selectedState?.id) {

            ; (async () => {
                try {
                    const response = await axios.get(`${Config.Get_State_And_Cities}?stateId=${selectedState.id}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('authToken')}`
                        }
                    });
                    if (response.status === 200 && response.data.success) {
                        setCities(response.data.data);
                        setLoadingStates((prev) => ({ ...prev, isCityLoading: false }));
                    };
                } catch (err) {
                    console.error('caught this error', err);
                }
            })();
        }
    }, [selectedState, localStorage.getItem('authToken')]);

    // API state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // UI hooks
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    // Form validation function
    const validateForm = useCallback(() => {
        const newErrors = {
            hospitalName: "",
            email: ""
        };

        let isValid = true;

        if (!hospitalName.trim()) {
            newErrors.hospitalName = "Hospital name is required";
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
    }, [hospitalName, email]);


    // Close modal and handle post-registration actions
    const handleCloseModal = useCallback(() => {
        onClose();
        if (submitSuccess) {
            Nav(0)
            // You can add additional logic here if needed
        }
    }, [onClose, submitSuccess]);

    // Handle input changes with validation
    const handleHospitalChange = (e) => {
        setHospitalName(e.target.value);
        if (errors.hospitalName) {
            setErrors({ ...errors, hospitalName: "" });
        }
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        if (errors.email) {
            setErrors({ ...errors, email: "" });
        }
    };

    const addHospital = async () => {
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const body = {
                hospitalName: hospitalName.trim(),
                email: email.trim(),
                type: type || null,
                phone: phoneNumber.trim() || null,
                pinCode: Number(pinCode.trim()) || null,
                // pinCode: { location.pinCode },
                address: location.address,
                city: location.city,
                state: location.state
            };
            console.log("Submitting data:", body);

            // ✅ Await karo
            const response = await axiosInstance.post(`${Config?.Add_Hospital}`, body, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            console.log("Hospital create response:", response);

            // ✅ Response status ko sahi check karo
            if (response?.status === 200 || response?.status === 201) {
                toast({
                    title: "Hospital Registered",
                    description: "Hospital created successfully.",
                    status: "success",
                    duration: 4000,
                    isClosable: true,
                    position: "top-right"
                });

                onOpen();

                setHospitalName("");
                setEmail("");
                setType("");
                setPhoneNumber("");
                setpinCode("");
                setLocation({ address: "", city: "", state: "" });

                //   Nav(-1)
            } else {
                toast({
                    title: "Failed to create hospital",
                    description: response?.data?.message || "Unexpected server response.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "top-right"
                });
            }

        } catch (error) {
            console.error("Error creating hospital:", error);
            toast({
                title: "Failed to create hospital",
                description: error?.response?.data?.message || "Something went wrong. Please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top-right"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleStateChange = (e) => {
        const selectedStateName = e.target.value;
        const selectedStateObj = states.find(state => state.state === selectedStateName);

        setLocation(prev => ({ ...prev, state: selectedStateName }));
        setSelectedState(selectedStateObj || { id: 0, state: 'Select State' });

        // Reset city when state changes
        setLocation(prev => ({ ...prev, city: '' }));
        setSelectedCity({ id: 0, city: 'Select City', state_id: 0 });
    };
    const handleCityChange = (e) => {
        const selectedCityName = e.target.value;
        setLocation(prev => ({ ...prev, city: selectedCityName }));
    };
    // useEffect(()=>{
    //     const getCitiesAndState = async () => {
    //     try {
    //         const response = await axiosInstance.get(`${Config.Get_State_And_Cities}`, {
    //             headers: {
    //                 Authorization: `Bearer ${localStorage.getItem('authToken')}`
    //             }
    //         })
    //         if (response.status === 200) {
    //             setCities(response.data);  // assuming response.data = [{ name: 'Jaipur' }, { name: 'Jodhpur' }]
    //         }
    //         console.log(cities, "city")

    //     } catch (error) {
    //         console.error("Error fetching city and state:", error);
    //         setError("Failed to load hospital data. Please try again later.");
    //     }
    // }
    // getCitiesAndState()
    // },[])


    // Error handling
    if (error) {
        return (
            <Box p={4} bg="white" mt="1rem" padding="12px 20px" borderRadius="15px 15px 0px 0px">
                <Alert status="error" borderRadius="md">
                    <AlertIcon />
                    {error}
                </Alert>
            </Box>
        );
    }

    // useEffect(()=>{
    //     getCitiesAndState()
    // },[])
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
                                <BreadcrumbLink href='/hospitals' color='#8B8D97' fontSize='13px'>Hospitals</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbItem>
                                <BreadcrumbLink href='/hospitals/add-hospital' color='#8B8D97' fontSize='13px'>Add Hospital</BreadcrumbLink>
                            </BreadcrumbItem>
                        </Breadcrumb>

                        <VStack padding="32px" spacing={6}>
                            <HStack gap={"5rem"} alignItems="flex-start">
                                <FormControl isInvalid={Boolean(errors.hospitalName)} flex="1">
                                    <FormLabel fontSize="12px" color="#333333">Hospital Name</FormLabel>
                                    <Input
                                        value={hospitalName}
                                        onChange={handleHospitalChange}
                                        placeholder="Enter Name"
                                        fontSize="14px"
                                        color="#333333"
                                        border="1px solid"
                                        width="300px"
                                        height="48px"
                                        borderRadius="none"
                                    />
                                    {errors.hospitalName && (
                                        <FormErrorMessage>{errors.hospitalName}</FormErrorMessage>
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
                                {/* <EmployeeSelector selected={employees} setSelected={setEmployees} /> */}

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
                                <Box flex="1">
                                    <Text fontSize="12px" color="#333333" mt="4" display="flex">
                                        Type <Text color="#8B8D97" fontSize="12px" ml="1">(Optional)</Text>
                                    </Text>
                                    <Flex width="300px" mt={2}>
                                        <Select
                                            placeholder="Select Type"
                                            height="48px"
                                            value={type}
                                            onChange={(e) => setType(e.target.value)}
                                            border="1px solid"
                                            borderRadius="none"
                                        >
                                            <option value="Private">Private</option>
                                            <option value="Clinic">Clinic</option>
                                            <option value="Government">Government</option>
                                            <option value="Trust">Trust</option>
                                        </Select>

                                    </Flex>
                                </Box>

                            </HStack>


                            <HStack gap={"5rem"} justify={"center"} alignItems="flex-start">
                                {/* <EmployeeSelector selected={employees} setSelected={setEmployees} /> */}

                                <Box flex="1">
                                    <Text fontSize="12px" color="#333333" mt="4" display="flex">
                                        Address <Text color="#8B8D97" fontSize="12px" ml="1">(Optional)</Text>
                                    </Text>
                                    <Flex width="300px" mt={2}>


                                        <Input
                                            value={location.address}
                                            onChange={(e) =>
                                                setLocation(prev => ({
                                                    ...prev,
                                                    address: e.target.value
                                                }))
                                            }
                                            height="48px"
                                            placeholder="Enter Address"
                                            borderRadius="none"
                                            color="#333333"
                                            border="1px solid"
                                        />
                                    </Flex>
                                </Box>

                                <Box flex="1">
                                    <Text fontSize="12px" color="#333333" mt="4" display="flex">
                                        State <Text color="#8B8D97" fontSize="12px" ml="1">(Optional)</Text>
                                    </Text>
                                    <Flex width="300px" mt={2}>
                                        <Select
                                            placeholder="Select State"
                                            height="48px"
                                            value={location?.state || ''}
                                            onChange={handleStateChange} border="1px solid"
                                            borderRadius="none"
                                        >
                                            <option value="">Select State</option>
                                            {states.map((item) => (
                                                <option key={item.id} value={item.state}>
                                                    {item.state}
                                                </option>
                                            ))}
                                        </Select>
                                    </Flex>
                                </Box>


                                {/* <Box flex="1">
                                    <Text fontSize="12px" color="#333333" mt="4" display="flex">
                                        City <Text color="#8B8D97" fontSize="12px" ml="1">(Optional)</Text>
                                    </Text>
                                    <Flex width="300px" mt={2}>
                                        <Select
                                            placeholder="Select City"
                                            height="48px"
                                            value={location.city || ''}
                                            onChange={handleCityChange}
                                            border="1px solid"
                                            borderRadius="none"
                                            disabled={!selectedState.id}
                                        >
                                            <option value="">Select City</option>
                                            {cities.map((city) => (
                                                <option key={city.id} value={city.city}>  //Changed from city.name to city.city 
                                                    {city.city}
                                                </option>
                                            ))}
                                        </Select>
                                    </Flex>
                                </Box> */}


                            </HStack>


                            <HStack gap={"5rem"} justify={"center"} alignItems="flex-start">
                                {/* <EmployeeSelector selected={employees} setSelected={setEmployees} /> */}

                                <Box flex="1">
                                    <Text fontSize="12px" color="#333333" mt="4" display="flex">
                                        City <Text color="#8B8D97" fontSize="12px" ml="1">(Optional)</Text>
                                    </Text>
                                    <Flex width="300px" mt={2}>
                                        <Select
                                            placeholder="Select City"
                                            height="48px"
                                            value={location.city || ''}
                                            onChange={handleCityChange}
                                            border="1px solid"
                                            borderRadius="none"
                                            disabled={!selectedState.id}
                                        >
                                            {/* <option value="">Select City</option> */}
                                            {cities.map((city) => (
                                                <option key={city.id} value={city.city}>  {/* Changed from city.name to city.city */}
                                                    {city.city}
                                                </option>
                                            ))}
                                        </Select>
                                    </Flex>
                                </Box>

                                {/* <Box flex="1">
                                    <Text fontSize="12px" color="#333333" mt="4" display="flex">
                                        State <Text color="#8B8D97" fontSize="12px" ml="1">(Optional)</Text>
                                    </Text>
                                    <Flex width="300px" mt={2}>
                                        <Select
                                            placeholder="Select State"
                                            height="48px"
                                            value={location?.state || ''}
                                            onChange={handleStateChange} border="1px solid"
                                            borderRadius="none"
                                        >
                                            <option value="">Select State</option>
                                            {states.map((item) => (
                                                <option key={item.id} value={item.state}>
                                                    {item.state}
                                                </option>
                                            ))}
                                        </Select>
                                    </Flex>
                                </Box> */}

                                <Box flex="1">
                                    <Text fontSize="12px" color="#333333" mt="4" display="flex">
                                        Pincode <Text color="#8B8D97" fontSize="12px" ml="1"></Text>
                                    </Text>
                                    <Flex width="300px" mt={2}>

                                        <Input
                                            value={pinCode}
                                            onChange={(e) =>
                                                setpinCode(e.target.value)
                                            }
                                            height="48px"
                                            placeholder="Enter pinCode"
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
                                    onClick={addHospital}
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

}

export default AddHospital