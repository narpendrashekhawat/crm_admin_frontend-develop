import React, { useEffect, useRef } from "react";

import {
    Box,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    HStack,
    Text,
    Heading,
    Input,
    Button,
    SimpleGrid,
    Spinner,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
} from "@chakra-ui/react";

import { GoHomeFill } from "react-icons/go";

import LeftSidebar from "../../components/LeftSideBarLayout/LeftSideBar";
import HeaderBar from "../../components/Header/HeaderBar";
import Footer from "../../components/footer";
import { useState } from "react";
import axios from "axios";
import { Config } from "../../components/Utils/Config";
import { useNavigate, useParams } from "react-router-dom";

const AddSupplierMfr = () => {

    const { id } = useParams();

    return (
        <Box backgroundColor="#F0F4F9" minH="100vh">
            <HStack
                justifyContent="space-between"
                px="20px"
                alignItems="flex-start"
            >
                {/* Sidebar */}
                <LeftSidebar />

                {/* Main Content */}
                <Box width="80%">
                    {/* Header */}
                    <HeaderBar />

                    {/* Page Content */}
                    <Box
                        p={4}
                        bg="white"
                        mt="0.5rem"
                        borderRadius="15px 15px 0px 0px"
                    >
                        {/* Breadcrumb */}
                        <Breadcrumb
                            color="#8B8D97"
                            padding="10px 0px 0.5rem 0px"
                        >

                            <BreadcrumbItem>
                                <BreadcrumbLink href="/overview">
                                    <GoHomeFill color="#5570F1" />
                                </BreadcrumbLink>
                            </BreadcrumbItem>

                            <BreadcrumbItem>
                                <BreadcrumbLink
                                    href="/distributors"
                                    color="#8B8D97"
                                    fontSize="13px"
                                >
                                    Distributors
                                </BreadcrumbLink>
                            </BreadcrumbItem>

                            <BreadcrumbItem>
                                <BreadcrumbLink
                                    href={`/distributors/business-details/${id}`}
                                    color="#8B8D97"
                                    fontSize="13px"
                                >
                                    Business Details
                                </BreadcrumbLink>
                            </BreadcrumbItem>

                            <BreadcrumbItem isCurrentPage>
                                <BreadcrumbLink
                                    color="#8B8D97"
                                    fontSize="13px"
                                >
                                    Add Manufacturer
                                </BreadcrumbLink>
                            </BreadcrumbItem>

                        </Breadcrumb>

                        {/* Page Heading */}
                        <Box mb={0} ml={"1.275rem"}>
                            <Heading
                                size="lg"
                                color="gray.800"
                            >
                                Add Manufacturer
                            </Heading>

                            <Text
                                mt={0}
                                color="gray.500"
                                fontSize="sm"
                            >
                                Create and manage manufacturer details.
                            </Text>
                        </Box>

                        {/* Actual Page Content */}
                        <Box
                            bg="white"
                            borderRadius="2xl"
                            p={1}
                            boxShadow="sm"
                        >
                            <ManufacturerForm />
                        </Box>
                    </Box>

                    {/* Footer */}
                    <Footer />
                </Box>
            </HStack>
        </Box>
    );
};

export default AddSupplierMfr;

const ManufacturerForm = () => {

    const { id } = useParams();
    console.log(id);

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        userId: id,
        companyName: "",
        phone: "",
        email: "",
        addLine1: "",
        addLine2: "",
        city: "",
        state: "",
        pinCode: "",
        creditCycle: null,
        nickName: "",
        contactPerson: "",
        MR: "",
        openingBalance: null,
        creditLimit: null,
        billLimit: null,
        ccEmails: null,
        drugLicense: "",
    });

    const [searchText, setSearchText] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [allowSearch, setAllowSearch] = useState(true);
    const [highlightedIndex, setHighlightedIndex] = useState(0);

    const inputRef = useRef(null);
    const dropdownRef = useRef(null);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    const [loadingStates, setLoadingStates] = useState({
        isStateLoading: true,
        isCityLoading: false,
    });

    const nav = useNavigate();

    const resetForm = () => {

        setFormData({
            userId: id,
            companyName: "",
            phone: "",
            email: "",
            addLine1: "",
            addLine2: "",
            city: "",
            state: "",
            pinCode: "",
            creditCycle: null,
            nickName: "",
            contactPerson: "",
            MR: "",
            openingBalance: null,
            creditLimit: null,
            billLimit: null,
            ccEmails: null,
            drugLicense: "",
        });

        setSearchText("");
        setSearchResults([]);
        setSearchLoading(false);
        setAllowSearch(true);
        setHighlightedIndex(0);

        setCities([]);
    };

    useEffect(() => {

        (async () => {

            try {

                const response = await axios.get(
                    Config.Get_State_And_Cities
                );

                if (response.status === 200 && response.data.success) {

                    setStates(response.data.data);

                    setLoadingStates((prev) => ({
                        ...prev,
                        isStateLoading: false,
                    }));
                }

            } catch (err) {

                console.log(err);

            }

        })();

    }, []);

    const handleStateSelect = async (state) => {

        setFormData((prev) => ({
            ...prev,
            state,
            city: "",
        }));

        const stateObj = states.find(
            (s) => s.state === state || s.name === state
        );

        if (!stateObj) return;

        setLoadingStates((prev) => ({
            ...prev,
            isCityLoading: true,
        }));

        try {

            const response = await axios.get(
                `${Config.Get_State_And_Cities}?stateId=${stateObj.id}`
            );

            if (response.status === 200 && response.data.success) {

                setCities(response.data.data);

                setLoadingStates((prev) => ({
                    ...prev,
                    isCityLoading: false,
                }));
            }

        } catch (err) {

            console.log(err);

            setLoadingStates((prev) => ({
                ...prev,
                isCityLoading: false,
            }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Company search
        if (name === "companyName") {
            setSearchText(value);
            setAllowSearch(true);
        }
    };

    useEffect(() => {

        if (!allowSearch) return;

        if (searchText.length < 3) {
            setSearchResults([]);
            setHighlightedIndex(0);
            return;
        }

        const delayDebounce = setTimeout(async () => {

            setSearchLoading(true);

            try {

                const res = await axios.get(
                    `${Config.search_mfr}?search=${searchText}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                    }
                }
                );

                if (res.data.status === 200) {
                    setSearchResults(res.data.data || []);
                    setHighlightedIndex(0);
                }

            } catch (err) {
                console.log(err);
            } finally {
                setSearchLoading(false);
            }

        }, 300);

        return () => clearTimeout(delayDebounce);

    }, [searchText]);

    const submitManufacturer = async () => {
        try {
            setLoading(true);

            console.log("Payload:", formData);

            const response = await axios.post(
                Config.add_supplier_mfr_user,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    }
                }
            );

            console.log(response.data);

            if (response.data.status === 200) {

                resetForm();

                nav(-1);
            }

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectCompany = (item) => {

        setFormData((prev) => ({
            ...prev,
            companyName: item.companyName,
            email: item.email || "",
            phone: item.phone || "",
        }));

        setSearchResults([]);
        setSearchText(item.companyName);
        setAllowSearch(false);
    };

    useEffect(() => {

        const handleKeyDown = (e) => {

            if (searchResults.length === 0) return;

            if (e.key === "ArrowDown") {
                e.preventDefault();
                setHighlightedIndex((prev) =>
                    Math.min(prev + 1, searchResults.length - 1)
                );
            }

            if (e.key === "ArrowUp") {
                e.preventDefault();
                setHighlightedIndex((prev) =>
                    Math.max(prev - 1, 0)
                );
            }

            if (e.key === "Enter") {
                e.preventDefault();
                handleSelectCompany(searchResults[highlightedIndex]);
            }

            if (e.key === "Escape") {
                setSearchResults([]);
                setHighlightedIndex(0);
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () =>
            document.removeEventListener("keydown", handleKeyDown);

    }, [searchResults, highlightedIndex]);

    useEffect(() => {

        const handleClickOutside = (event) => {

            if (
                inputRef.current &&
                !inputRef.current.contains(event.target) &&
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setSearchResults([]);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () =>
            document.removeEventListener("mousedown", handleClickOutside);

    }, []);
    return (
        <Box p={4}>
            <SimpleGrid
                columns={{ base: 1, md: 2, lg: 4 }}
                spacing={4}
                w="100%"
            >

                {/* Company Name */}
                <Box position="relative">

                    <Text
                        mb="1"
                        fontSize="14px"
                        color="#4A5568"
                        fontWeight="500"
                    >
                        Company Name
                        <Text as="span" color="red.500">*</Text>
                    </Text>

                    <Input
                        ref={inputRef}
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        placeholder="Enter Company Name"
                        bg="#eff1f999"
                        height="48px"
                    />

                    {searchLoading && (
                        <Text
                            position="absolute"
                            top="42px"
                            right="10px"
                            fontSize="12px"
                        >
                            Loading...
                        </Text>
                    )}

                    {searchResults.length > 0 && (

                        <Box
                            position="absolute"
                            top="75px"
                            left="0"
                            width="100%"
                            bg="white"
                            border="1px solid #E2E8F0"
                            borderRadius="8px"
                            maxH="200px"
                            overflowY="auto"
                            zIndex="999"
                            ref={dropdownRef}
                            boxShadow="md"
                        >

                            {searchResults.map((item, index) => (

                                <Box
                                    key={item.id}
                                    p={3}
                                    cursor="pointer"
                                    bg={
                                        highlightedIndex === index
                                            ? "blue.100"
                                            : "white"
                                    }
                                    _hover={{ bg: "blue.50" }}
                                    onClick={() => handleSelectCompany(item)}
                                >
                                    {item.companyName}
                                </Box>

                            ))}

                        </Box>
                    )}
                </Box>

                {/* Nick Name */}
                <Box>
                    <Text
                        mb="1"
                        fontSize="14px"
                        color="#4A5568"
                        fontWeight="500"
                    >
                        Nick Name
                    </Text>

                    <Input
                        placeholder="Enter Nick Name"
                        bg="#eff1f999"
                        height="48px"
                        name="nickName"
                        value={formData.nickName}
                        onChange={handleChange}
                    />
                </Box>

                {/* Phone */}
                <Box>
                    <Text
                        mb="1"
                        fontSize="14px"
                        color="#4A5568"
                        fontWeight="500"
                    >
                        Phone
                        <Text as="span" color="red.500">*</Text>
                    </Text>

                    <Input
                        placeholder="Enter Phone"
                        bg="#eff1f999"
                        height="48px"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                </Box>

                {/* Email */}
                <Box>
                    <Text
                        mb="1"
                        fontSize="14px"
                        color="#4A5568"
                        fontWeight="500"
                    >
                        Email
                        <Text as="span" color="red.500">*</Text>
                    </Text>

                    <Input
                        placeholder="Enter Email"
                        bg="#eff1f999"
                        height="48px"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </Box>

                {/* Address Line1 */}
                <Box>
                    <Text
                        mb="1"
                        fontSize="14px"
                        color="#4A5568"
                        fontWeight="500"
                    >
                        Address Line1
                        <Text as="span" color="red.500">*</Text>
                    </Text>

                    <Input
                        placeholder="Enter Address Line1"
                        bg="#eff1f999"
                        height="48px"
                        name="addLine1"
                        value={formData.addLine1}
                        onChange={handleChange}
                    />
                </Box>

                {/* Address Line2 */}
                <Box>
                    <Text
                        mb="1"
                        fontSize="14px"
                        color="#4A5568"
                        fontWeight="500"
                    >
                        Address Line2
                    </Text>

                    <Input
                        placeholder="Enter Address Line2"
                        bg="#eff1f999"
                        height="48px"
                        name="addLine2"
                        value={formData.addLine2}
                        onChange={handleChange}
                    />
                </Box>

                {/* State */}
                <Box position="relative">

                    <Text
                        mb="1"
                        fontSize="14px"
                        color="#4A5568"
                        fontWeight="500"
                    >
                        State
                        <Text as="span" color="red.500">*</Text>
                    </Text>

                    {loadingStates.isStateLoading ? (
                        <Spinner />
                    ) : (

                        <Menu>

                            <MenuButton
                                as={Button}
                                width="100%"
                                height="48px"
                                bg="#eff1f999"
                                textAlign="left"
                                fontWeight="normal"
                                _hover={{ bg: "#eff1f999" }}
                                _active={{ bg: "#eff1f999" }}
                            >
                                {formData.state || "Select State"}
                            </MenuButton>

                            <MenuList maxH="250px" overflowY="auto">

                                {states.map((state) => (

                                    <MenuItem
                                        key={state.id}
                                        onClick={() =>
                                            handleStateSelect(
                                                state.state || state.name
                                            )
                                        }
                                    >
                                        {state.state || state.name}
                                    </MenuItem>

                                ))}

                            </MenuList>

                        </Menu>

                    )}
                </Box>

                {/* City Dropdown */}
                <Box position="relative">

                    <Text
                        mb="1"
                        fontSize="14px"
                        color="#4A5568"
                        fontWeight="500"
                    >
                        City
                        <Text as="span" color="red.500">*</Text>
                    </Text>

                    {loadingStates.isCityLoading ? (
                        <Spinner />
                    ) : (

                        <Menu>

                            <MenuButton
                                as={Button}
                                width="100%"
                                height="48px"
                                bg="#eff1f999"
                                textAlign="left"
                                fontWeight="normal"
                                isDisabled={!formData.state}
                                _hover={{ bg: "#eff1f999" }}
                                _active={{ bg: "#eff1f999" }}
                            >
                                {formData.city || "Select City"}
                            </MenuButton>

                            <MenuList maxH="250px" overflowY="auto">

                                {cities.map((city) => (

                                    <MenuItem
                                        key={city.id}
                                        onClick={() =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                city: city.city,
                                            }))
                                        }
                                    >
                                        {city.city}
                                    </MenuItem>

                                ))}

                            </MenuList>

                        </Menu>

                    )}
                </Box>

                {/* Pin Code */}
                <Box>
                    <Text
                        mb="1"
                        fontSize="14px"
                        color="#4A5568"
                        fontWeight="500"
                    >
                        Pin Code
                    </Text>

                    <Input
                        placeholder="Enter Pin Code"
                        bg="#eff1f999"
                        height="48px"
                        name="pinCode"
                        value={formData.pinCode}
                        onChange={handleChange}
                    />
                </Box>

                {/* Contact Person */}
                <Box>
                    <Text
                        mb="1"
                        fontSize="14px"
                        color="#4A5568"
                        fontWeight="500"
                    >
                        Contact Person
                    </Text>

                    <Input
                        placeholder="Enter Contact Person"
                        bg="#eff1f999"
                        height="48px"
                        name="contactPerson"
                        value={formData.contactPerson}
                        onChange={handleChange}
                    />
                </Box>

                {/* MR */}
                <Box>
                    <Text
                        mb="1"
                        fontSize="14px"
                        color="#4A5568"
                        fontWeight="500"
                    >
                        MR
                    </Text>

                    <Input
                        placeholder="Enter MR"
                        bg="#eff1f999"
                        height="48px"
                        name="MR"
                        value={formData.MR}
                        onChange={handleChange}
                    />
                </Box>

                {/* CC Emails */}
                <Box>
                    <Text
                        mb="1"
                        fontSize="14px"
                        color="#4A5568"
                        fontWeight="500"
                    >
                        CC Emails
                    </Text>

                    <Input
                        placeholder="Enter CC Emails"
                        bg="#eff1f999"
                        height="48px"
                        name="ccEmails"
                        value={formData.ccEmails}
                        onChange={handleChange}
                    />
                </Box>

                {/* Credit Cycle */}
                <Box>
                    <Text
                        mb="1"
                        fontSize="14px"
                        color="#4A5568"
                        fontWeight="500"
                    >
                        Credit Cycle
                        <Text as="span" color="red.500">*</Text>
                    </Text>

                    <Input
                        placeholder="Enter Credit Cycle"
                        bg="#eff1f999"
                        height="48px"
                        name="creditCycle"
                        value={formData.creditCycle}
                        onChange={handleChange}
                    />
                </Box>

                {/* Drug License */}
                <Box>
                    <Text
                        mb="1"
                        fontSize="14px"
                        color="#4A5568"
                        fontWeight="500"
                    >
                        Drug License
                        <Text as="span" color="red.500">*</Text>
                    </Text>

                    <Input
                        placeholder="Enter Drug License"
                        bg="#eff1f999"
                        height="48px"
                        name="drugLicense"
                        value={formData.drugLicense}
                        onChange={handleChange}
                    />
                </Box>

                {/* Opening Balance */}
                <Box>
                    <Text
                        mb="1"
                        fontSize="14px"
                        color="#4A5568"
                        fontWeight="500"
                    >
                        Opening Balance
                    </Text>

                    <Input
                        placeholder="Enter Opening Balance"
                        bg="#eff1f999"
                        height="48px"
                        name="openingBalance"
                        value={formData.openingBalance}
                        onChange={handleChange}
                    />
                </Box>

                {/* Credit Limit */}
                <Box>
                    <Text
                        mb="1"
                        fontSize="14px"
                        color="#4A5568"
                        fontWeight="500"
                    >
                        Credit Limit
                    </Text>

                    <Input
                        placeholder="Enter Credit Limit"
                        bg="#eff1f999"
                        height="48px"
                        name="creditLimit"
                        value={formData.creditLimit}
                        onChange={handleChange}
                    />
                </Box>

                {/* Bill Limit */}
                <Box>
                    <Text
                        mb="1"
                        fontSize="14px"
                        color="#4A5568"
                        fontWeight="500"
                    >
                        Bill Limit
                    </Text>

                    <Input
                        placeholder="Enter Bill Limit"
                        bg="#eff1f999"
                        height="48px"
                        name="billLimit"
                        value={formData.billLimit}
                        onChange={handleChange}
                    />
                </Box>

            </SimpleGrid>

            {/* Buttons */}
            <HStack mt={6}>
                <Button
                    bg="transparent"
                    borderWidth={2}
                    borderColor="blue.700"
                    color="blue.700"
                    onClick={() => nav(-1)}
                >
                    Cancel
                </Button>

                <Button
                    bg="blue.700"
                    color="white"
                    onClick={submitManufacturer}
                >
                    Save Manufacturer
                </Button>
            </HStack>
        </Box>
    );
};